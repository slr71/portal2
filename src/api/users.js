const router = require('express').Router();
const { requireAdmin } = require('../auth');
const models = require('../models');
const User = models.account_user;
const RestrictedUsername = models.account_restrictedusername;

router.get('/mine', (req, res) => {
    res.json(req.user).status(200);
});

router.get('/', requireAdmin, async (req, res) => {
    const offset = req.query.offset;
    const limit = req.query.limit || 10;
    //const search = req.query.search;

    const { count, rows } = await User.findAndCountAll({
        order: [ ['id', 'DESC'] ],
        offset: offset,
        limit: limit
    });

    res.json({ count, results: rows }).status(200);
});

router.get('/:id(\\d+)', requireAdmin, async (req, res) => {
    const user = await User.findByPk(req.params.id);

    res.json(user).status(200);
});

router.get('/restricted', requireAdmin, async (req, res) => {
    const usernames = await RestrictedUsername.findAll({
        attributes: [ 'id', 'username' ],
        order: [ ['username', 'ASC'] ],
        // limit: 10
    });

    res.json(usernames).status(200);
});

router.get('/properties', async (req, res) => {
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