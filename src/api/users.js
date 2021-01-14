const router = require('express').Router();
const { logger } = require('./lib/logging');
const { requireAdmin, isAdmin, getUser, asyncHandler } = require('./lib/auth');
const { checkPassword, encodePassword } = require('./lib/password');
const { userPasswordUpdateWorkflow, userDeletionWorkflow } = require('./workflows/native/user.js');
const sequelize = require('sequelize');
const models = require('./models');
const User = models.account_user;
const RestrictedUsername = models.account_restrictedusername;
const config = require('../config.json');

//TODO move into module
const likeAny = (key, vals) => sequelize.where(sequelize.fn('lower', sequelize.col(key)), { [sequelize.Op.like]: { [sequelize.Op.any]: vals.map(k => `%${k}%`) } }) 

// Get all users (STAFF ONLY)
router.get('/', requireAdmin, asyncHandler(async (req, res) => {
    const offset = req.query.offset;
    const limit = req.query.limit || 10;
    const keyword = req.query.keyword;
    const keywords = keyword && keyword.split(' ').filter(k => k)

    const { count, rows } = await User.unscoped().findAndCountAll({
        where: 
            keyword
                ? sequelize.or(
                    { id: isNaN(keyword) ? 0 : keyword }, 
                    likeAny('first_name', keywords),
                    likeAny('last_name', keywords),
                    likeAny('username', keywords),
                    likeAny('email', keywords),
                    likeAny('institution', keywords),
                    likeAny('occupation.name', keywords),
                    likeAny('region.name', keywords),
                    likeAny('region.country.name', keywords),
                  )
                : null,
        include: [
            'occupation',
            { 
                model: models.account_region, 
                as: 'region',
                include: [ 'country' ]
            }
        ],
        attributes: [ 'id', 'username', 'first_name', 'last_name', 'email', 'institution' ],
        order: [ ['id', 'DESC'] ],
        offset: offset,
        limit: limit,
        distinct: true,
        subQuery: false
    });

    res.status(200).json({ count, results: rows });
}));

// Get current user based on token
router.get('/mine', getUser, (req, res) => {
    res.status(200).json(req.user);
});

// Get individual user (STAFF ONLY)
router.get('/:id(\\d+)', requireAdmin, asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id);
    res.status(200).json(user);
}));

// Update user 
// If body is empty then will just return the user
router.post('/:id(\\d+)', getUser, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const fields = req.body;

    // Check permission -- user can only update their own record unless admin
    if (id != req.user.id && !isAdmin(req))
        return res.status(403).send('Permission denied');

    let user = await User.findByPk(id);
    if (!user)
        return res.status(404).send('User not found');

    // Update
    const SUPPORTED_FIELDS = [
        'first_name', 'last_name', 'orcid_id', 'institution', 'department',
        'aware_channel_id', 'ethnicity_id', 'funding_agency_id', 'gender_id',
        'occupation_id', 'research_area_id', 'region_id', 'settings'
    ]
    if (fields) {
        for (let key in fields) {
            // Ignore any non-updateable fields
            if (SUPPORTED_FIELDS.includes(key))
                user[key] = fields[key];
        }
    }
    await user.save();
    await user.reload();

    res.status(200).json(user);
}));

/*
 * Update password (password change in Account page)
 *
 * For password reset see src/api/public.js:/users/password
 */
router.post('/password', getUser, asyncHandler(async (req, res) => {
    const fields = req.body;
    if (!fields || !('password' in fields) || !('oldPassword' in fields)) 
        return res.status(400).send('Missing required field');

    // Re-fetch user unscoped so password is present
    const user = await User.unscoped().findByPk(req.user.id, { include: [ 'occupation' ] });

    // Check the password
    if (!checkPassword(user.password, fields.oldPassword))
        return res.status(400).send('Invalid password');

    // Update password in DB
    user.password = encodePassword(fields.password);
    await user.save();

    res.status(200).send('success');

    // Update password in LDAP (do after response as to not delay it)
    logger.info(`Updating password for user ${user.username}`);
    user.password = fields.password; // kludgey, but use raw password
    if (config.argo)
        await submitUserWorkflow('update-password', user);
    else
        await userPasswordUpdateWorkflow(user);
}));

// Delete user (SUPERUSER ONLY)
router.delete('/:id(\\d+)', getUser, asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!req.user.is_superuser)
        return res.status(403).send('Permission denied');

    if (id == req.user.id)
        return res.status(403).send('Cannot delete yourself');

    let user = await User.unscoped().findByPk(id, {
        include: [
            {
                model: models.account_emailaddress,
                as: 'emails',
                include: [
                    {
                        model: models.api_mailinglist,
                        as: 'mailing_lists'
                    }
                ]
            }
        ]
    });
    if (!user)
        return res.status(404).send('User not found');

    if (user.is_staff || user.is_superuser)
        return res.status(403).send('Cannot delete privileged user');

    // Submit user deletion workflow to remove user from subsystems (LDAP, IRODS, etc)
    if (config.argo) {
        await Argo.submit(
            'user.yaml',
            'delete-user',
            {
                // User params
                user_id: user.username,
                email: user.email,

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
    else {
        await userDeletionWorkflow(user);
    }

    // Remove user from database
    //TODO automate cascading deletes
    logger.info(`Deleting account_passwordreset for user ${user.username} id=${user.id}`);
    await models.account_passwordreset.destroy({ where: { user_id: user.id } });

    logger.info(`Deleting account_passwordresetrequest for user ${user.username} id=${user.id}`);
    await models.account_passwordresetrequest.destroy({ where: { user_id: user.id } });

    logger.info(`Deleting api_accessrequest for user ${user.username} id=${user.id}`);
    const accessRequests = await models.api_accessrequest.findAll({ 
        where: { user_id: user.id },
        include: [ 'logs' ]
    });
    for (const request of accessRequests) {
        for (const log of request.logs) 
            await log.destroy();
        await request.destroy();
    }

    logger.info(`Deleting api_workshopenrollmentrequest for user ${user.username} id=${user.id}`);
    const enrollmentRequests = await models.api_workshopenrollmentrequest.findAll({ 
        where: { user_id: user.id },
        include: [ 'logs' ]
    });
    for (const request of enrollmentRequests) {
        for (const log of request.logs) 
            await log.destroy();
        await request.destroy();
    }

    logger.info(`Deleting api_formsubmission for user ${user.username} id=${user.id}`);
    const submissions = await models.api_formsubmission.findAll({ 
        where: { user_id: user.id },
        include: [ 
            'conversations',  
            { 
                model: api_formfieldsubmission,
                as: 'fields'
            }
        ]
    });
    for (const submission of submissions) {
        for (const conversation of submission.conversations)
            await conversation.destroy();
        for (const field of submission.fields)
            await field.destroy();
        await submission.destroy();
    }
    
    for (const email of user.emails) {
        for (const mailingList of email.mailing_lists) {
            logger.info(`Deleting from api_emailaddressmailinglist: mailing_list_id ${mailingList.id}, email_address_id ${email.id}`);
            await models.api_emailaddressmailinglist.destroy({ 
                where: { 
                    mailing_list_id: mailingList.id, 
                    email_address_id: email.id
                } 
            });
        }

        logger.info(`Deleting email ${email.email} id=${email.id}`);
        email.destroy();
    }

    logger.info(`Deleting user ${user.username} id=${user.id}`);
    await user.destroy();

    res.status(200).send('success');
}));

// Get restricted usernames
router.get('/restricted', requireAdmin, asyncHandler(async (req, res) => {
    const usernames = await RestrictedUsername.findAll({
        attributes: [ 'id', 'username' ],
        order: [ ['username', 'ASC'] ],
        // limit: 10
    });

    res.status(200).json(usernames);
}));

// Add restricted username
router.put('/restricted/:username(\\S+)', requireAdmin, asyncHandler(async (req, res) => {
    const [username, created] = await RestrictedUsername.findOrCreate({ where: { username: req.params.username } });
    res.status(201).json(username);
}));

// Delete restricted username
router.delete('/restricted/:username(\\S+)', requireAdmin, asyncHandler(async (req, res) => {
    const username = await RestrictedUsername.findOne({ where: { username: req.params.username } });
    if (!username)
        return res.status(404).send('Restricted username not found');

    await username.destroy();

    res.status(200).send('success');
}));

module.exports = router;