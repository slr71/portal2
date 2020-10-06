const router = require('express').Router();
const models = require('../models');
const sequelize = require('sequelize');
const Service = models.api_service;
const User = models.account_user;
const AccessRequest = models.request;
const AccessRequestLog = models.api_accessrequestlog;
const AccessRequestQuestion = models.api_accessrequestquestion;
const AccessRequestAnswer = models.api_accessrequestanswer;
const { approveRequest, grantRequest } = require('./approvers/service');
const intercom = require('../intercom');
const { getUser, requireAdmin } = require('../auth');

const poweredServiceQuery = [sequelize.literal('(select exists(select 1 from api_poweredservice where service_ptr_id=id))'), 'is_powered' ];

//TODO move into module
const like = (key, val) => sequelize.where(sequelize.fn('lower', sequelize.col(key)), { [sequelize.Op.like]: '%' + val.toLowerCase() + '%' }) 


router.get('/requests', requireAdmin, async (req, res) => {
    const offset = req.query.offset;
    const limit = req.query.limit || 10;
    const keyword = req.query.keyword;

    const where = 
        keyword
            ? { where:
                    sequelize.or(
                        { id: isNaN(keyword) ? 0 : keyword }, 
                        like('status', keyword),
                        like('service.name', keyword),
                        like('user.username', keyword),
                        like('user.email', keyword),
                        like('user.region.country.name', keyword),
                    ),
                  subQuery: false
                }
            : {};

    const { count, rows } = await AccessRequest.findAndCountAll({
        ...where,
        include: [ 
            { model: User.scope('lite'), as: 'user' },
            'service' 
        ],
        order: [ ['updated_at', 'DESC'] ],
        offset: offset,
        limit: limit,
        distinct: true
    });

    return res.json({ count, results: rows }).status(200);
});

router.get('/requests/:id(\\d+)', requireAdmin, async (req, res) => {
    const request = await AccessRequest.findByPk(req.params.id, {
        include: [ 
            'user',
            { 
                model: Service,
                as: 'service',
                include: { 
                    model: AccessRequestQuestion,
                    as: 'questions'
                }
            },
            'conversation',
            'logs'
        ],
        order: [ [ 'logs', 'created_at', 'ASC' ] ]
    });
    if (!request)
        return res.send('Request not found').status(404);

    let answers = await models.api_accessrequestanswer.findAll({
        where: {
            access_request_question_id: request.service.questions.map(q => q.id),
            user_id: request.user.id
        }
    });
    request.setDataValue('answers', answers);

    if (request.conversation) {
        const conversation = await intercom.get_conversation(request.conversation.intercom_conversation_id);
        request.conversation.setDataValue('source', conversation.source);
        if (conversation && conversation.conversation_parts)
            request.conversation.setDataValue('parts', conversation.conversation_parts.conversation_parts);
    }

    return res.json(request).status(200);
});

// Create new access request
router.put('/:id(\\d+)/requests', getUser, requireAdmin, async (req, res) => {
    const serviceId = req.params.id;
    const answers = req.body.answers; // [ { questionId, value } ]

    // Fetch service
    const service = await Service.findByPk(serviceId, { include: [ 'questions' ] });
    if (!service)
        return res.send('Service not found').status(404);

    // Verify there is an answer for every question
    // for (question of service.questions) {
    //     const answer = answers ? answers.filter(a => a.questionId == question.id) : null;
    //     if (!answer || typeof answer.value == 'undefined')
    //         return res.send('Missing answer to question ' + question.id).status(400);
    // }

    // Create access request if it doesn't already exist
    const [request, created] = await models.request.findOrCreate({
        where: { 
            service_id: service.id,
            user_id: req.user.id
        },
        defaults: {
            status: AccessRequest.constants.STATUS_REQUESTED,
            message: AccessRequest.constants.MESSAGE_REQUESTED
        }
    });
    if (!request)
        return res.send('Failed to create request').status(500);

    request.service = service;
    request.user = req.user;

    // Create answers
    request.answers = [];
    if (service.questions && answers) {
        for (const question of service.questions) {
            for (const answer of answers) {
                if (answer.questionId == question.id) {
                    const [ans, created] = await AccessRequestAnswer.findOrCreate({
                        where: {
                            user_id: req.user.id,
                            access_request_question_id: question.id,
                        },
                        defaults: {
                            value_text: answer.value
                        }
                    });
                    request.answers.push(ans); // Save answers for use in approveRequest call below -- a little kludgey
                }
            }
        }
    }

    // Create initial access request log entry. Subsequent entries will be automatically created each time
    // the request is updated (see "afterUpdateRequest" hook in src/models/index.js).
    const log = await AccessRequestLog.create({
        access_request_id: request.id,
        status: request.status,
        message: request.message
    })
    if (!log)
        return res.send('Failed to create access request log').status(500);
    
    // Send response to client
    res.json(request).status(201);

    // Call approver and granter (do this after response as to not delay it)
    if (created) // new request
        await approveRequest(request); // updates request status
    if (request.isApproved())
        await grantRequest(request);
});

// Update request status
router.post('/:nameOrId(\\w+)/requests', getUser, requireAdmin, async (req, res) => {
    const nameOrId = req.params.nameOrId;

    const status = req.body.status;
    if (!status) //TODO verify valid status value
        return res.send('Missing status').status(400);

    const message = req.body.message;
    if (!message)
        return res.send('Missing message').status(400);

    const service = await Service.findOne({
        where:
            sequelize.or(
                { id: isNaN(nameOrId) ? 0 : nameOrId },
                sequelize.where(sequelize.fn('lower', sequelize.col('name')), nameOrId.toLowerCase())
            )
    });
    if (!service)
        return res.send("Service not found").status(404);

    const request = await models.request.findOne({
        where: { 
            service_id: service.id,
            user_id: req.user.id
        }
    });
    if (!request)
        return res.send("Request not found").status(404);

    request.set('status', status);
    request.set('message', message);
    await request.save();

    // Send response to client
    res.json(request).status(200);

    // Call granter (do this after response as to not delay it)
    if (request.isApproved())
        await grantRequest(request);
});

router.get('/', async (req, res) => {
    const services = await Service.findAll({
        attributes: { include: [ poweredServiceQuery] },
        order: [ [ 'name', 'ASC' ] ]
    });

    return res.json(services).status(200);
});

router.get('/:nameOrId(\\w+)', async (req, res) => {
    const nameOrId = req.params.nameOrId;
    if (!nameOrId)
        return res.send('Missing required name/id parameter').status(400);

    const service = await Service.findOne({
        include: [
            'service_maintainer',
            'contacts',
            'resources',
            'questions',
            { model: models.api_form, 
                as: 'forms', 
                through: { attributes: [] } // remove connector table
            }
        ],
        attributes: { include: [ poweredServiceQuery ] },
        where:
            sequelize.or(
                { id: isNaN(nameOrId) ? 0 : nameOrId },
                sequelize.where(sequelize.fn('lower', sequelize.col('name')), nameOrId.toLowerCase())
            )
    });

    if (!service)
        return res.send('Service not found').status(404);

    return res.json(service).status(200);
});

module.exports = router;