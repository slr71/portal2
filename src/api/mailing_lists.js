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
        return res.status(400).send('Missing required field(s)');

    let emailAddress = await EmailAddress.findOne({ where: lowerEqualTo('email', email) });
    if (!emailAddress) {
        emailAddress = await EmailAddress.create({
            user_id: req.user.id,
            email: email,
            primary: false,
            verified: false
        });
        if (!emailAddress)
            return res.status(500).send('Error creating email address');
    }
    else if (emailAddress.user_id != req.user.id)
        return res.status(404).send('Email address not found');

    // Generate HMAC for temp password and confirmation email code
    const hmac = generateHMAC(emailAddress.id);

    res.status(200).send(emailAddress);

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
        return res.status(404).send('Email address not found');
    if (emailAddress.primary)
        return res.status(403).send('Cannot delete primary email address');

    await emailAddress.destroy();
    res.status(200).send('success');
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
        return res.status(400).send('Missing required field');

    const mailingList = await MailingList.findByPk(id);
    if (!mailingList)
        return res.status(404).send('Mailing list not found');

    const emailAddress = await EmailAddress.findOne({ 
        where: { 
            email: email,
            user_id: req.user.id
        }
    });
    if (!emailAddress)
        return res.status(404).send('Email address not found');

    const emailAddressToMailingList = await EmailAddressToMailingList.findOne({ 
        where: {
            mailing_list_id: mailingList.id,
            email_address_id: emailAddress.id
        } 
    });
    if (!emailAddressToMailingList)
        return res.status(404).send('Email address to mailing list not found');
    
    if (emailAddressToMailingList.is_subscribed == subscribe)
        return res.status(200).send('success');

    emailAddressToMailingList.is_subscribed = subscribe;
    await emailAddressToMailingList.save();

    res.status(200).send('success');

    // Update subscription status in Mailman (do after response as to not delay it)
    await mailmanUpdateSubscription(mailingList.list_name, email, subscribe);
}));

module.exports = router;