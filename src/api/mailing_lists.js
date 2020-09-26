const router = require('express').Router();
const { requireAdmin } = require('../auth');
const sequelize = require('sequelize');
const models = require('../models');
const MailingList = models.api_mailinglist;
const EmailAddress = models.account_emailaddress;
const EmailAddressToMailingList = models.api_emailaddressmailinglist;

router.get('/', requireAdmin, async (req, res) => {
    // TODO
});

router.get('/:id(\\d+)', requireAdmin, async (req, res) => {
    // TODO 
});

router.post('/subscriptions', requireAdmin, async (req, res) => {
    console.log(req.body)
    const id = req.body.id // mailing list id
    const name = req.body.name; // OR mailing list name, e.g. "de-users"
    const email = req.body.email; // email address
    const subscribe = !!req.body.subscribe;

    if ((!id && !name) || !email)
        return res.status(400);

    const mailingList = await MailingList.findOne({
        where:
            sequelize.or(
                { id: id ? id : 0 },
                { list_name: name ? name : '' }
            )
    });
    if (!mailingList)
        return res.send('Mailing list not found').status(404);

    const emailAddress = await EmailAddress.findOne({ where: { email: email }});
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
});

module.exports = router;