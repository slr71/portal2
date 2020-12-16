//TODO consider merging this module into users.js

const router = require('express').Router();
const { getUser, asyncHandler } = require('./lib/auth');
const { emailNewEmailConfirmation } = require('./lib/email')
const { generateHMAC } = require('./lib/email')
const { mailmanUpdateSubscription } = require('./workflows/native/lib');
const sequelize = require('sequelize');
const models = require('./models');
const MailingList = models.api_mailinglist;
const EmailAddress = models.account_emailaddress;
const EmailAddressToMailingList = models.api_emailaddressmailinglist;

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
    await emailNewEmailConfirmation(email, hmac)
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

/*
 * Update mailing list subscription
 * 
 * Called in "Account" page to subscribe/unsubscribe
 */
router.post('/:id(\\d+)/subscriptions', getUser, asyncHandler(async (req, res) => {
    console.log(req.body)
    const id = req.params.id // mailing list id
    const email = req.body.email; // email address
    const subscribe = !!req.body.subscribe;

    if (!email)
        return res.send('Missing required field').status(400);

    const mailingList = await MailingList.findByPk(id);
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
    
    if (emailAddressToMailingList.is_subscribed == subscribe)
        return res.send('success').status(200);

    emailAddressToMailingList.is_subscribed = subscribe;
    await emailAddressToMailingList.save();

    res.send('success').status(200);

    // Update subscription status in Mailman (do after response as to not delay it)
    await mailmanUpdateSubscription(mailingList.list_name, email, subscribe);
}));

module.exports = router;