const router = require('express').Router();
const { logger } = require('./lib/logging');
const { emailNewAccountConfirmation, emailPasswordReset } = require('./lib/email');
const { decodeHMAC, generatePasswordResetToken, decodePasswordResetToken } = require('./lib/hmac');
const { asyncHandler, getUser } = require('./lib/auth');
const { checkPassword, encodePassword } = require('./lib/password')
const { emailServiceAccessGranted } = require('./lib/email');
const { notifyClientOfServiceRequestStatusChange } = require('./lib/ws');
const config = require('../config');
const Argo = require('./lib/argo');
const serviceApprovers = require('./approvers/service');
const { userCreationWorkflow, userPasswordUpdateWorkflow } = require('./workflows/native/user.js');
const sequelize = require('sequelize');
const models = require('./models');
const User = models.account_user;
const AccessRequest = models.api_accessrequest;
const CyVerseService = models.api_cyverseservice;
const RestrictedUsername = models.account_restrictedusername;
const EmailAddress = models.account_emailaddress;
const PasswordReset = models.account_passwordreset;
const PasswordResetRequest = models.account_passwordresetrequest;
const EmailAddressToMailingList = models.api_emailaddressmailinglist;

const MINIMUM_TIME_ON_PAGE = 1000*60 // one minute
const MAXIMUM_TIME_ON_PAGE = 1000*60*60 // one hour

//TODO move into module
const lowerEqualTo = (key, val) => sequelize.where(sequelize.fn('lower', sequelize.col(key)), val.toLowerCase()); 

// Check for existing username and/or email address
router.post('/exists', asyncHandler(async (req, res) => {
    let fields = req.body;
    console.log("fields:", fields);
    let result = {}

    // Check for existing username
    const username = fields.username;
    if (username) {
        const user = await User.findOne({ where: { username } });
        const restricted = await RestrictedUsername.findOne({ where: { username } });
        result.username = !!(user || restricted);
    }

    // Check for existing email
    const email = fields.email;
    if (email) {
        const user = await User.unscoped().findOne({ where: lowerEqualTo('email', email) });
        const emailAddress = await EmailAddress.findOne({ where: lowerEqualTo('email', email) });
        result.email = !!(user || emailAddress);
    }

    res.json(result).status(200);
}));

// Create user //TODO require API key or valid HMAC
router.put('/users/:username(\\w+)', asyncHandler(async (req, res) => {
    const username = req.params.username;
    let fields = req.body;
    console.log("fields:", fields);

    // Check for existing username
    const user = await User.findOne({ where: { username } });
    const restricted = await RestrictedUsername.findOne({ where: { username } });
    if (user || restricted)
        return res.send('Username already taken').status(400);

    // Detect bots using honeypot fields
    const HONEYPOT_FIELDS = [ 'first_name', 'last_name' ]; // index corresponds to modulus identifier
    for (let key in fields) {
        if (isNaN(key)) {
            if (HONEYPOT_FIELDS.includes(key)) // fields must be encoded
                return res.send('Validity test failed (1)').status(400);
        }
        else {
            const index = (key % config.honeypotDivisor) - 1;
            if (index >= 0 && index < HONEYPOT_FIELDS.length) {
                const realKey = HONEYPOT_FIELDS[index];
                fields[realKey] = fields[key]; // replace encoded key with actual field name
            }
            else { // a fake field was populated
                logger.error(`Honeypot field was populated: key=${key} index=${index} value=${fields[key]}`);
                return res.send('Validity test failed (2)').status(400);
            }
        }
    }

    // Detect bots using page load time
    if (!fields['plt']) 
        return res.send('Validity test failed (3)').status(400);

    const pageLoadTime = decodeHMAC(fields['plt']);
    const timeExpired = Date.now - pageLoadTime;
    if (timeExpired < MINIMUM_TIME_ON_PAGE || timeExpired >= MAXIMUM_TIME_ON_PAGE)
        return res.send('Validity test failed (4)').status(400);

    // Validate fields
    const REQUIRED_FIELDS = [
        'first_name', 'last_name', 'email', 'institution', 'department',
        'occupation_id', 'research_area_id', 'funding_agency_id',
        'country_id', 'region_id', 'gender_id', 'ethnicity_id', 'aware_channel_id'
    ];
    if (!REQUIRED_FIELDS.every(f => fields[f]))
        return res.send('Missing required field').status(400);

    // Check for existing email
    const user2 = await User.unscoped().findOne({ where: lowerEqualTo('email', fields['email']) });
    const emails = await EmailAddress.findOne({ where: lowerEqualTo('email', fields['email']) });
    if (user2 || emails)
        return res.send('Email already in use').status(400);

    // Set defaults
    fields['username'] = username;
    fields['password'] = '';
    fields['is_superuser'] = false;
    fields['is_staff'] = false;
    fields['is_active'] = true;
    fields['has_verified_email'] = false;
    fields['participate_in_study'] = true;
    fields['subscribe_to_newsletter'] = true; 
    fields['orcid_id'] = '';

    // Create user
    logger.info(`Creating user ${username}`);
    let newUser = await User.create(fields)
    if (!newUser)
        return res.send('Error creating user').status(500);

    // Create primary email address
    const emailAddress = await EmailAddress.create({
        user_id: newUser.id,
        email: newUser.email,
        primary: true,
        verified: false
    });
    if (!emailAddress)
        return res.send('Error creating email address').status(500);

    res.json(newUser).status(200);

    // Send confirmation email (after the response as to not delay it)
    const hmac = generatePasswordResetToken(emailAddress.id);
    await emailNewAccountConfirmation(newUser.email, hmac)
}));

// Update user password -- assumes password requirements were enforced by front-end
router.post('/users/password', asyncHandler(async (req, res) => {
    const fields = req.body;
    if (!fields || !('password' in fields)) 
        return res.send('Missing required field').status(400);

    let user, isUpdate;
    if ('hmac' in fields && 'password' in fields) { // Password set (new user) or reset
        // Decode HMAC
        const obj = decodePasswordResetToken(fields.hmac)
        if (!('key' in obj))
            return res.send('Invalid HMAC (1)').status(400);
        const emailId = parseInt(obj.key)
        if (isNaN(emailId))
            return res.send('Invalid HMAC (2)').status(400);
        if (Date.now() > obj.expires)
            return res.status(400).send('Expired HMAC');

        // Fetch email address
        const emailAddress = await EmailAddress.findByPk(emailId);
        if (!emailAddress)
            return res.send('Email address not found').status(404);

        // Check if password was already reset using this HMAC
        const passwordReset = await PasswordReset.findOne({ 
            where: {
                key: fields.hmac,
                user_id: emailAddress.user_id
            }
        });
        if (passwordReset) 
            return res.send('Password already reset').status(400);

        // Confirm email address
        emailAddress.verified = true
        emailAddress.primary = true
        emailAddress.save()

        // Fetch user -- unscoped so password is present
        user = await User.unscoped().findByPk(emailAddress.user_id, { include: [ 'occupation' ] });

        if (user.password == '') { // New user //FIXME move to after response
            // Run user creation workflow
            logger.info(`Running user creation workflow for user ${user.username}`)
            let rc;
            if ('argo' in config) 
                rc = await submitUserWorkflow('create-user', user);
            else
                rc = await userCreationWorkflow(user);

            // Grant access to default services
            logger.info(`Granting access to default services for user ${user.username}`)
            const defaultServices = await CyVerseService.findAll({ 
                where: { auto_add_new_users: true },
                include: [ 'service' ]
            });
            for (let cyverseService of defaultServices) {
                const serviceRequest = await AccessRequest.create({
                    service_id: cyverseService.service_ptr_id,
                    user_id: user.id,
                    auto_approve: true,
                    status: AccessRequest.constants.STATUS_REQUESTED,
                    message: AccessRequest.constants.MESSAGE_REQUESTED
                });
    
                serviceRequest.service = cyverseService.service;
                serviceRequest.user = user;
                serviceApprovers.grantRequest(serviceRequest)
            }
        }
        else { // Existing user
            // Log password reset
            const passwordReset = PasswordReset.create({
                user_id: user.id,
                key: fields.hmac
            });
            if (!passwordReset)
                logger.error('Error creating password reset');
            
            isUpdate = true;
        }
    }
    else if ('oldPassword' in fields) { // Existing user password change, must be authenticated //TODO move to separate endpoint
        // Get user from token
        await getUser(req);

        // Fetch user -- unscoped so password is present
        user = await User.unscoped().findByPk(req.user.id, { include: [ 'occupation' ] });

        // Check the password
        if (!checkPassword(user.password, fields.oldPassword))
            return res.send('Invalid password').status(400);

        logger.info(`Updating password for user ${user.username}`)
        isUpdate = true;
    }
    else {
        return res.send('Invalid request').status(400);
    }

    // Update password in DB
    user.password = encodePassword(fields.password);
    await user.save();

    res.send('success').status(200);

    // Update password in LDAP and IRODS (do after response as to not delay it)
    if (isUpdate) { // only do this for password change/reset, not for new user
        user.password = fields.password; // kludgey, but use raw password
        if (config.argo)
            await submitUserWorkflow('update-password', user);
        else
            await userPasswordUpdateWorkflow(user);
    }
}));

async function submitUserWorkflow(templateName, user) {
    // Calculate number of days since epoch (needed for LDAP)
    const daysSinceEpoch = Math.floor(new Date()/8.64e7);

    // Calculate uidNumber
    // Old method: /repos/portal/cyverse_ldap/utils/get_uid_number.py
    const uidNumber = user.id + config.uidNumberOffset;

    // Submit Argo workflow
    return await Argo.submit(
        'user.yaml',
        templateName,
        {
            // User params
            user_id_number: uidNumber,
            user_id: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
            department: user.department,
            organization: user.institution,
            title: user.occupation.name,
            daysSinceEpoch: daysSinceEpoch,

            // Other params
            portal_api_base_url: config.apiBaseUrl,
            ldap_host: config.ldap.host,
            ldap_admin: config.ldap.admin,
            ldap_password: config.ldap.password,
            mailchimp_api_url: config.mailchimp.baseUrl,
            mailchimp_api_key: config.mailchimp.apiKey,
            mailchimp_list_id: config.mailchimp.listId,
        }
    );
}

// Send reset password link //TODO require API key
router.post('/users/reset_password', asyncHandler(async (req, res) => {
    const email = req.body.email;
    console.log(email);

    if (!email) 
        return res.send('Missing email').status(400);

    let emailAddress = await EmailAddress.findOne({ where: { email }, include: [ 'user'] });
    if (!emailAddress)
        return res.send('Email address not associated with an account').status(404);

    // Generate HMAC for confirmation email code
    const hmac = generatePasswordResetToken(emailAddress.id);

    const passwordResetRequest = PasswordResetRequest.create({
        user_id: emailAddress.user.id,
        username: emailAddress.user.username,
        email_address_id: emailAddress.id,
        email: email,
        key: hmac
    });
    if (!passwordResetRequest)
        return res.send('Error creating password reset request').status(500);

    res.send('success').status(200);

    // Send email after response as to not delay it
    await emailPasswordReset(emailAddress, hmac);
}));

router.post('/confirm_email', asyncHandler(async (req, res) => {
    const hmac = req.body.hmac
    if (!hmac) 
        return res.send('Missing hmac').status(400);

    // Decode HMAC
    const obj = decodePasswordResetToken(hmac)
    if (!('key' in obj))
        return res.send('Invalid HMAC (1)').status(400);
    const emailId = parseInt(obj.key)
    if (isNaN(emailId))
        return res.send('Invalid HMAC (2)').status(400);

    // Get email address
    let emailAddress = await EmailAddress.findByPk(emailId);
    if (!emailAddress)
        return res.send('Email address not found').status(404);

    // Confirm email address
    emailAddress.verified = true
    emailAddress.save()

    res.send('success').status(200);
}));

/*
 * Argo callback to set service access request status to "granted"
 * 
 * Called in service registration workflow (src/api/workflows/argo) to signal workflow completion
 */
router.post('/services/requests/:id(\\d+)', asyncHandler(async (req, res) => { //FIXME require API key
    const requestId = req.params.id;

    const request = await AccessRequest.findByPk(requestId, {
        include: [ 'user', 'service' ] // needed by emailServiceAccessGranted()
    });
    if (!request)
        return res.send("Request not found").status(404);

    request.grant();

    res.json(request).status(200);

    // Send notification email to user (do this after response as to not delay it)
    await emailServiceAccessGranted(request);

    // Update status on client
    notifyClientOfServiceRequestStatusChange(req.ws, request);
}));

/*
 * Argo callback to subscribe to mailing list
 * 
 * Called in service registration workflow (src/api/workflows/argo) to subscribe to service mailing list
 */
router.post('/mailing_lists/:nameOrId(\\w+)/subscribe', asyncHandler(async (req, res) => { //FIXME require API key
    console.log(req.body)
    const nameOrId = req.params.nameOrId; // mailing list name (e.g. "de-users") or ID
    const email = req.body.email; // email address to subscribe

    if (!email)
        return res.send('Missing required field').status(400);

    const mailingList = await MailingList.findOne({
        where:
            sequelize.or(
                { id: nameOrId ? nameOrId : 0 },
                { list_name: nameOrId ? nameOrId : '' }
            )
    });
    if (!mailingList)
        return res.send('Mailing list not found').status(404);

    const emailAddress = await EmailAddress.findOne({ where: { email } });
    if (!emailAddress)
        return res.send('Email address not found').status(404);

    const emailAddressToMailingList = await EmailAddressToMailingList.create({ 
        mailing_list_id: mailingList.id,
        email_address_id: emailAddress.id,
        is_subscribed: true
    });
    if (!emailAddressToMailingList)
        return res.send('Failed to subscribe').status(500);
    
    return res.send('success').status(200);
}));

// This endpoint is no longer called directly.  It is used to generate the src/user-properties.json file for static compilation.
// To update the file:  curl -s http://localhost:3000/api/users/properties | jq > user-properties.json
router.get('/users/properties', asyncHandler(async (req, res) => {
    const opts = { attributes: { exclude: [ 'created_at', 'updated_at' ] } };
    const keys = [ 'funding_agencies', 'occupations', 'genders', 'ethnicities', 'countries', 'regions', 'research_areas', 'aware_channels' ];

    const results = {};
    (await Promise.all([
        models.account_fundingagency.findAll(opts),
        models.account_occupation.findAll(opts),
        models.account_gender.findAll(opts),
        models.account_ethnicity.findAll(opts),
        models.account_country.findAll(opts),
        models.account_region.findAll(opts),
        models.account_researcharea.findAll(opts),
        models.account_awarechannel.findAll(opts)
    ]))
    .forEach((e, i) => results[keys[i]] = e);

    res.json(results).status(200);
}));

module.exports = router;
