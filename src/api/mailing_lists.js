const router = require('express').Router();
const { requireAdmin } = require('../auth');
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

router.post('/:name(\\w+)/subscriptions', requireAdmin, async (req, res) => {
    const name = req.params.name; // mailing list name, e.g. "de-users"
    const email = req.body.email; // email address
    const subscribe = req.body.subscribe; // boolean
    if (!name || !email)
        return res.status(400);

    const mailingList = await MailingList.findOne({ where: { list_name: name }});
    if (!mailingList)
        return res.send('Mailing list not found').status(404);

    const emailAddress = await EmailAddress.findOne({ where: { email: email }});
    if (!emailAddress)
        return res.send('Email address not found').status(404);
    
    const [, success] = await EmailAddressToMailingList.upsert({ 
        mailing_list_id: mailingList.id,
        email_address_id: emailAddress.id,
        is_subscribed: subscribe
    });
    if (!success)
        return res.status(500);

    return res.status(200);
});

module.exports = router;