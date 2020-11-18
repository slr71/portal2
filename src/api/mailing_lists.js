const router = require('express').Router();
const { getUser, asyncHandler } = require('../auth');
const { renderEmail } = require('../lib/email')
const { generateHMAC } = require('../lib/email')
const sequelize = require('sequelize');
const models = require('../models');
const User = models.account_user;
const MailingList = models.api_mailinglist;
const EmailAddress = models.account_emailaddress;
const EmailAddressToMailingList = models.api_emailaddressmailinglist;
const { UI_CONFIRM_EMAIL_URL } = require('../constants')

//TODO move into module
const lowerEqualTo = (key, val) => sequelize.where(sequelize.fn('lower', sequelize.col(key)), val.toLowerCase()); 

// Create email address
// Can be submitted again for existing email address to resend confirmation email
router.put('/email_addresses', getUser, asyncHandler(async (req, res) => {
    console.log(req.body)
    const email = req.body.email; // email address

    if (!email)
        return res.send('Missing required field(s)').status(400);

    let emailAddress = await EmailAddress.findOne({ where: lowerEqualTo('email', email) });
    if (!emailAddress) {
        emailAddress = await EmailAddress.create({
            user_id: req.user.id,
            email: email,
            primary: false,
            verified: false
        });
        if (!emailAddress)
            return res.send('Error creating email address').status(500);
    }
    else if (emailAddress.user_id != req.user.id)
        return res.send('Email address not found').status(500);

    // Generate HMAC for temp password and confirmation email code
    const hmac = generateHMAC(emailAddress.id);

    res.send(emailAddress).status(200);

    // Send email after response as to not delay it
    const confirmationUrl = `${UI_CONFIRM_EMAIL_URL}?code=${hmac}`;
    console.log({confirmationUrl});
    await renderEmail({
        to: email, 
        bcc: null,
        subject: 'CyVerse Email Confirmation', //FIXME hardcoded
        templateName: 'add_email_confirmation',
        fields: {
            "ACTIVATE_URL": confirmationUrl,
        }
    })
}));

router.delete('/email_addresses/:id(\\d+)', getUser, asyncHandler(async (req, res) => {
    const id = req.params.id

    const emailAddress = await EmailAddress.findOne({
        where: {
            id: id,
            user_id: req.user.id
        }
    });
    if (!emailAddress)
        return res.send('Email address not found').status(404);
    if (emailAddress.primary)
        return res.send('Cannot delete primary email address').status(404);

    await emailAddress.destroy();
    res.send('success').status(200);
}));

router.post('/subscriptions', getUser, asyncHandler(async (req, res) => {
    console.log(req.body)
    const id = req.body.id // mailing list id
    const name = req.body.name; // OR mailing list name, e.g. "de-users"
    const email = req.body.email; // email address
    const subscribe = !!req.body.subscribe;

    if ((!id && !name) || !email)
        return res.send('Missing required field(s)').status(400);

    const mailingList = await MailingList.findOne({
        where:
            sequelize.or(
                { id: id ? id : 0 },
                { list_name: name ? name : '' }
            )
    });
    if (!mailingList)
        return res.send('Mailing list not found').status(404);

    const emailAddress = await EmailAddress.findOne({ 
        where: { 
            email: email,
            user_id: req.user.id 
        }
    });
    if (!emailAddress)
        return res.send('Email address not found').status(404);

    const emailAddressToMailingList = await EmailAddressToMailingList.findOne({ 
        where: {
            mailing_list_id: mailingList.id,
            email_address_id: emailAddress.id
        } 
    });
    if (!emailAddressToMailingList)
        return res.send('Email address to mailing list not found').status(404);
    
    emailAddressToMailingList.is_subscribed = subscribe;
    await emailAddressToMailingList.save();

    return res.send('success').status(200);
}));

module.exports = router;