const router = require('express').Router();
const { renderEmail, generateHMAC, decodeHMAC } = require('./lib/email')
const { email } = require('../config');
const { UI_PASSWORD_URL, UI_REQUESTS_URL } = require('../constants')
const sequelize = require('sequelize');
const models = require('../models');
const User = models.account_user;
const RestrictedUsername = models.account_restrictedusername;
const EmailAddress = models.account_emailaddress;
const PasswordReset = models.account_passwordreset;
const PasswordResetRequest = models.account_passwordresetrequest;

//TODO move into module
const lowerEqualTo = (key, val) => sequelize.where(sequelize.fn('lower', sequelize.col(key)), val.toLowerCase()); 

router.post('/exists', async (req, res) => {
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
});

// Create user //TODO require API key?
router.put('/users/:username(\\w+)', async (req, res) => {
    const username = req.params.username;
    let fields = req.body;
    console.log("fields:", fields);

    // Check for existing username
    const user = await User.findOne({ where: { username } });
    const restricted = await RestrictedUsername.findOne({ where: { username } });
    if (user || restricted)
        return res.send('Username already taken').status(400);

    // Validate fields
    const REQUIRED_FIELDS = [
        'first_name', 'last_name', 'email', 'institution', 'department',
        'occupation_id', 'research_area_id', 'funding_agency_id',
        'country_id', 'region_id', 'gender_id', 'ethnicity_id', 'aware_channel_id'
    ];
    if (!REQUIRED_FIELDS.every(f => fields[f]))
        return res.send('Missing required field(s)').status(400);

    // Check for existing email
    const user2 = await User.unscoped().findOne({ where: lowerEqualTo('email', fields['email']) });
    const emails = await EmailAddress.findOne({ where: lowerEqualTo('email', fields['email']) });
    if (user2 || emails)
        return res.send('Email already in use').status(400);

    // Set defaults
    fields['username'] = username;
    fields['password'] = generateHMAC(username); //FIXME how is this initialized in previous version?
    fields['is_superuser'] = false;
    fields['is_staff'] = false;
    fields['is_active'] = true;
    fields['has_verified_email'] = false;
    fields['participate_in_study'] = false; //FIXME should this be in sign-up form?
    fields['subscribe_to_newsletter'] = true; 
    fields['orcid_id'] = '';

    // Create user and email address
    const newUser = await User.create(fields)
    if (!newUser)
        return res.send('Error creating user').status(500);

    const emailAddress = await EmailAddress.create({
        user_id: newUser.id,
        email: newUser.email,
        primary: true,
        verified: false
    });
    if (!emailAddress)
        return res.send('Error creating email address').status(500);

    // Generate HMAC for temp password and confirmation email code
    const hmac = generateHMAC(emailAddress.id);

    res.json(newUser).status(200);

    // Send email after response as to not delay it
    const confirmationUrl = `${UI_PASSWORD_URL}?code=${hmac}`;
    console.log({confirmationUrl});
    await renderEmail({
        to: newUser.email, 
        bcc: email.bccNewAccountConfirmation,
        subject: 'Please Confirm Your E-Mail Address', //FIXME hardcoded
        templateName: 'email_confirmation_signup_message',
        fields: {
            "ACTIVATE_URL": confirmationUrl,
            "FORMS_URL": UI_REQUESTS_URL
        }
    })
});

// Update user password //TODO require API key?
router.post('/users/password', async (req, res) => {
    const fields = req.body;
    console.log(fields);

    if (!fields || !fields.hmac || !fields.password) 
        return res.send('Missing email').status(400);

    const decodedEmailId = decodeHMAC(fields.hmac)
    const emailId = parseInt(decodedEmailId)
    if (isNaN(emailId))
        return res.send('Invalid HMAC').status(400);

    let emailAddress = await EmailAddress.findByPk(emailId, {
        include: [ 'user']
    });
    if (!emailAddress)
        return res.send('Email address not found').status(404);

    // Confirm email address
    emailAddress.verified = true
    emailAddress.primary = true
    emailAddress.save()

    const passwordReset = PasswordReset.create({
        user_id: emailAddress.user.id,
        key: fields.hmac
    });
    if (!passwordReset)
        return res.send('Error creating password reset').status(500);

    res.send('success').status(200);
});

// Send reset password link //TODO require API key?
router.post('/users/reset_password', async (req, res) => {
    const email = req.body.email;
    console.log(email);

    if (!email) 
        return res.send('Missing email').status(400);

    let emailAddress = await EmailAddress.findOne({
        where: {
            email: email
        },
        include: [ 'user']
    });
    if (!emailAddress)
        return res.send('Email address not associated with an account').status(404);

    // Generate HMAC for temp password and confirmation email code
    const hmac = generateHMAC(emailAddress.id);

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
    const resetUrl = `${UI_PASSWORD_URL}?reset&code=${hmac}`;
    console.log({resetUrl});
    await renderEmail({
        to: email, 
        bcc: email.bccPasswordChangeRequest,
        subject: 'CyVerse Password Reset', //FIXME hardcoded
        templateName: 'password_reset',
        fields: {
            "PASSWORD_RESET_URL": resetUrl,
            "USERNAME": emailAddress.user.username
        }
    })
});

router.get('/users/properties', async (req, res) => {
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
});

module.exports = router;