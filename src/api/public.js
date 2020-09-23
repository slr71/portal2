const router = require('express').Router();
const { renderEmail, generateHMAC } = require('./lib/email')
const { email } = require('../config');
const { UI_PASSWORD_SET_URL, UI_REQUESTS_URL } = require('../constants')
const sequelize = require('sequelize');
const models = require('../models');
const User = models.account_user;
const RestrictedUsername = models.account_restrictedusername;
const EmailAddress = models.account_emailaddress;

// Create user //TODO require API key?
router.put('/users/:username(\\w+)', async (req, res) => {
    const username = req.params.username;
    let fields = req.body; // null for username availability test
    console.log("fields:", fields);

    // Check for existing username
    const user = await User.findOne({ where: { username } });
    const restricted = await RestrictedUsername.findOne({ where: { username } });
    if (user || restricted)
        return res.send('Username already taken').status(400);

    // Empty body, just testing username for availability
    if (!fields || Object.keys(fields).length == 0)
        return res.send('success').status(200);

    // Validate fields
    const REQUIRED_FIELDS = [
        'first_name', 'last_name', 'email', 'institution', 'department',
        'occupation_id', 'research_area_id', 'funding_agency_id',
        'country_id', 'region_id', 'gender_id', 'ethnicity_id', 'aware_channel_id'
    ];
    if (!REQUIRED_FIELDS.every(f => fields[f]))
        return res.send('Missing required field(s)').status(400);


    //TODO move into module
    const lowerEqualTo = (key, val) => sequelize.where(sequelize.fn('lower', sequelize.col(key)), val.toLowerCase()); 

    // Check for existing username
    const user2 = await User.unscoped().findOne({ where: lowerEqualTo('email', fields['email']) });
    const emails = await EmailAddress.findOne({ where: lowerEqualTo('email', fields['email']) });
    if (user2 || emails)
        return res.send('Email already in use').status(400);

    // Generate HMAC for temp password and confirmation email code
    const hmac = generateHMAC(fields['email']);

    // Set defaults
    fields['username'] = username;
    fields['password'] = hmac; //FIXME is the correct/okay?
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

    await EmailAddress.create({
        user_id: newUser.id,
        email: newUser.email,
        primary: true,
        verified: false
    });

    res.json(newUser).status(200);

    // Send confirmation email after response as to not delay it
    const confirmationUrl = `${UI_PASSWORD_SET_URL}?code=${hmac}`;
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

// Public endpoint (no auth required)
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