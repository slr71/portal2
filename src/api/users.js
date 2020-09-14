const router = require('express').Router();
const { requireAdmin, isAdmin } = require('../auth');
const sequelize = require('sequelize');
const models = require('../models');
const User = models.account_user;
const RestrictedUsername = models.account_restrictedusername;

//TODO move into module
const like = (key, val) => sequelize.where(sequelize.fn('lower', sequelize.col(key)), { [sequelize.Op.like]: '%' + val.toLowerCase() + '%' }) 

router.get('/mine', (req, res) => {
    res.json(req.user).status(200);
});

router.get('/', requireAdmin, async (req, res) => {
    const offset = req.query.offset;
    const limit = req.query.limit || 10;
    const keyword = req.query.keyword;

    const { count, rows } = await User.unscoped().findAndCountAll({
        where: 
            keyword
                ? sequelize.or(
                    { id: isNaN(keyword) ? 0 : keyword }, 
                    like('first_name', keyword),
                    like('last_name', keyword),
                    like('username', keyword),
                    like('institution', keyword),
                    like('department', keyword),
                    like('occupation.name', keyword),
                    like('region.name', keyword),
                    like('region.country.name', keyword),
                  )
                : null,
        include: [
            'occupation',
            { model: models.account_region, 
                as: 'region',
                include: [ 'country' ]
            }
        ],
        order: [ ['id', 'DESC'] ],
        offset: offset,
        limit: limit,
        distinct: true,
        subQuery: false
    });

    res.json({ count, results: rows }).status(200);
});

router.get('/:id(\\d+)', requireAdmin, async (req, res) => {
    const user = await User.findByPk(req.params.id);

    res.json(user).status(200);
});

// Update user info
router.post('/:id(\\d+)', async (req, res) => {
    const id = req.params.id;
    const fields = req.body;
    console.log(fields);

    const SUPPORTED_FIELDS = [
        'first_name', 'last_name', 'orcid_id', 'institution', 'department',
        'aware_channel_id', 'ethnicity_id', 'funding_agency_id', 'gender_id',
        'occupation_id', 'research_area_id', 'region_id'
    ]

    // User can only update their own record unless admin
    if (id != req.user.id && !isAdmin(req))
        return res.send('Permission denied').status(403);

    let user = await User.findByPk(id);
    if (!user)
        return res.send('User not found').status(404);

    for (let key in fields) {
        // Ignore any non-updateable fields
        if (SUPPORTED_FIELDS.includes(key))
            user[key] = fields[key];
    }
    await user.save();
    await user.reload();

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

router.put('/restricted/:username(\\S+)', requireAdmin, async (req, res) => {
    const [username, created] = await RestrictedUsername.findOrCreate({ where: { username: req.params.username } });
    res.json(username).status(201);
});

router.delete('/restricted/:username(\\S+)', requireAdmin, async (req, res) => {
    const username = await RestrictedUsername.findOne({ where: { username: req.params.username } });
    if (!username)
        return res.send('Restricted username not found').status(404);

    await username.destroy();

    res.send('success').status(200);
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