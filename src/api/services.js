const router = require('express').Router();
const models = require('./models');
const sequelize = require('sequelize');
const Service = models.api_service;
const ServiceContact = models.api_contact;
const ServiceResource = models.api_serviceresource;
const ServiceForm = models.api_serviceform;
const User = models.account_user;
const AccessRequest = models.api_accessrequest;
const AccessRequestLog = models.api_accessrequestlog;
const AccessRequestQuestion = models.api_accessrequestquestion;
const AccessRequestAnswer = models.api_accessrequestanswer;
const { approveRequest, grantRequest } = require('./approvers/service');
const intercom = require('./lib/intercom');
const { notifyClientOfServiceRequestStatusChange } = require('./lib/ws');
const { getUser, requireAdmin, asyncHandler } = require('./lib/auth');
const { emailServiceAccessGranted } = require('./lib/email');

const poweredServiceQuery = [sequelize.literal('(select exists(select 1 from api_poweredservice where service_ptr_id=id))'), 'is_powered' ];

//TODO move into module
const like = (key, val) => sequelize.where(sequelize.fn('lower', sequelize.col(key)), { [sequelize.Op.like]: '%' + val.toLowerCase() + '%' }) 

router.get('/requests', requireAdmin, asyncHandler(async (req, res) => {
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
}));

router.get('/requests/:id(\\d+)', requireAdmin, asyncHandler(async (req, res) => {
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
            'conversations',
            'logs'
        ],
        order: [ [ 'logs', 'created_at', 'ASC' ] ]
    });
    if (!request)
        return res.send('Request not found').status(404);

    let answers = await AccessRequestAnswer.findAll({
        where: {
            access_request_question_id: request.service.questions.map(q => q.id),
            user_id: request.user.id
        }
    });
    request.setDataValue('answers', answers);

    // Fetch conversations from Intercom
    for (let conversation of request.conversations) {
        const c = await intercom.getConversation(conversation.intercom_conversation_id);
        if (c) {
            conversation.setDataValue('source', c.source);
            if (c.conversation_parts)
                conversation.setDataValue('parts', c.conversation_parts.conversation_parts);
        }
    }

    return res.json(request).status(200);
}));

// Create new access request
router.put('/:id(\\d+)/requests', getUser, requireAdmin, asyncHandler(async (req, res) => {
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
    const [request, created] = await AccessRequest.findOrCreate({
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

    // Create initial access request log entry to record that user requested access.
    // Subsequent entries will be automatically created each time the request is updated (see "afterUpdateRequest" hook in src/api/models/index.js).
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
        await approveRequest(request);
    if (request.isApproved())
        await grantRequest(request, req.api.token);

    notifyClientOfServiceRequestStatusChange(req.ws, request);
}));

/*
 * Update request status
 * 
 * Called in 
 *     1. Admin "Access Requests" page to grant/deny request
 *     2. Service registration workflow (src/api/workflows/argo) to grant request
 */
router.post('/:nameOrId(\\w+)/requests', getUser, asyncHandler(async (req, res) => {
    const nameOrId = req.params.nameOrId;

    const status = req.body.status;
    if (!status) //TODO verify valid status value
        return res.send('Missing status').status(400);

    const message = req.body.message;
    if (!message)
        return res.send('Missing message').status(400);

    // Get service
    const service = await Service.findOne({
        where:
            sequelize.or(
                { id: isNaN(nameOrId) ? 0 : nameOrId },
                sequelize.where(sequelize.fn('lower', sequelize.col('name')), nameOrId.toLowerCase())
            )
    });
    if (!service)
        return res.send("Service not found").status(404);

    // Get request
    const request = await AccessRequest.findOne({
        where: { 
            service_id: service.id,
            user_id: req.user.id
        }
    });
    if (!request)
        return res.send("Request not found").status(404);

    // Update request
    request.set('status', status);
    request.set('message', message);
    await request.save();

    // Send response to client
    res.json(request).status(200);

    // Call granter (do this after response as to not delay it)
    if (request.isApproved())
        await grantRequest(request, req.api.token);
    if (request.isGranted()) // callback from workflow
        await emailServiceAccessGranted(request);

    // Update status on client
    notifyClientOfServiceRequestStatusChange(req.ws, request);
}));

router.get('/', asyncHandler(async (req, res) => {
    const services = await Service.findAll({
        attributes: { include: [ poweredServiceQuery] },
        order: [ [ sequelize.fn('lower', sequelize.col('name')), 'ASC' ] ]
    });

    return res.json(services).status(200);
}));

router.get('/:nameOrId(\\w+)', asyncHandler(async (req, res) => {
    const nameOrId = req.params.nameOrId;

    const service = await Service.findOne({
        include: [ //TODO create scope for this
            'service_maintainer',
            'contacts',
            'resources',
            'questions',
            { 
                model: models.api_form, 
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
}));

// Update service (STAFF ONLY)
router.post('/:id(\\d+)', getUser, requireAdmin, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const fields = req.body;
    console.log(fields);

    const service = await Service.findByPk(id, {
        include: [ //TODO create scope for this
            'service_maintainer',
            'contacts',
            'resources',
            'questions',
            { model: models.api_form, 
                as: 'forms', 
                through: { attributes: [] } // remove connector table
            }
        ]
    });
    if (!service)
        return res.send('Service not found').status(404);

    // Verify and update fields
    for (let key in fields) {
        const SUPPORTED_FIELDS = ['name', 'description', 'about', 'service_url', 'icon_url'];
        if (!SUPPORTED_FIELDS.includes(key))
            return res.send('Unsupported field').status(400);
        service[key] = fields[key];
    }
    await service.save();
    await service.reload();

    res.json(service).status(200);
}));

// Add question to service (STAFF ONLY)
router.put('/:id(\\d+)/questions', getUser, requireAdmin, asyncHandler(async (req, res) => {
    const questionText = req.body.question;
    const is_required = true; //req.body.is_required;
    if (!questionText)
        return res.send('Missing required fields').status(400);

    const service = await Service.findByPk(req.params.id);
    if (!service)
        return res.send('Service not found').status(404);

    const [question, created] = await AccessRequestQuestion.findOrCreate({ 
        where: { 
            service_id: service.id,
            question: questionText,
            type: 'text',
            is_required
        } 
    });
    res.json(question).status(201);
}));

// Remove question from service (STAFF ONLY)
router.delete('/:serviceId(\\d+)/questions/:questionId(\\d+)', getUser, requireAdmin, asyncHandler(async (req, res) => {
    const service = await Service.findByPk(req.params.serviceId);
    if (!service)
        return res.send('Service not found').status(404);

    const question = await AccessRequestQuestion.findByPk(req.params.questionId);
    if (!question)
        return res.send('Question not found').status(404);

    await question.destroy();
    res.send('success').status(200);
}));

// Add contact to service (STAFF ONLY)
router.put('/:id(\\d+)/contacts', getUser, requireAdmin, asyncHandler(async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    if (!name || !email)
        return res.send('Missing params').status(400);

    const service = await Service.findByPk(req.params.id);
    if (!service)
        return res.send('Service not found').status(404);

    const [contact, created] = await ServiceContact.findOrCreate({ 
        where: { 
            service_id: service.id,
            name,
            email
        } 
    });
    res.json(contact).status(201);
}));

// Remove contact from service (STAFF ONLY)
router.delete('/:serviceId(\\d+)/contacts/:contactId(\\d+)', getUser, requireAdmin, asyncHandler(async (req, res) => {
    const service = await Service.findByPk(req.params.serviceId);
    if (!service)
        return res.send('Service not found').status(404);

    const contact = await ServiceContact.findByPk(req.params.contactId);
    if (!contact)
        return res.send('Contact not found').status(404);

    await contact.destroy();
    res.send('success').status(200);
}));

// Add resource to service (STAFF ONLY)
router.put('/:id(\\d+)/resources', getUser, requireAdmin, asyncHandler(async (req, res) => {
    const fields = req.body;
    console.log(fields);
    if (!fields.name || !fields.url)
        return res.send('Missing required fields').status(400);

    const service = await Service.findByPk(req.params.id);
    if (!service)
        return res.send('Service not found').status(404);

    const [resource, created] = await ServiceResource.findOrCreate({ 
        where: { 
            service_id: service.id,
            name: fields.name,
            url: fields.url,
            description: fields.description || '',
            icon_url: fields.icon_url || ''
        } 
    });
    res.json(resource).status(201);
}));

// Remove resource from service (STAFF ONLY)
router.delete('/:serviceId(\\d+)/resources/:resourceId(\\d+)', getUser, requireAdmin, asyncHandler(async (req, res) => {
    const service = await Service.findByPk(req.params.serviceId);
    if (!service)
        return res.send('Service not found').status(404);

    const resource = await ServiceResource.findByPk(req.params.resourceId);
    if (!resource)
        return res.send('Resource not found').status(404);

    await resource.destroy();
    res.send('success').status(200);
}));

// Add form to service (STAFF ONLY)
router.put('/:id(\\d+)/forms', getUser, requireAdmin, asyncHandler(async (req, res) => {
    const fields = req.body;
    console.log(fields)
    if (!fields.formId)
        return res.send('Missing required fields').status(400);

    const service = await Service.findByPk(req.params.id);
    if (!service)
        return res.send('Service not found').status(404);

    const [form, created] = await ServiceForm.findOrCreate({ 
        where: { 
            service_id: service.id,
            form_id: fields.formId
        } 
    });
    res.json(form).status(201);
}));

// Remove form from service (STAFF ONLY)
router.delete('/:serviceId(\\d+)/forms/:formId(\\d+)', getUser, requireAdmin, asyncHandler(async (req, res) => {
    const service = await Service.findByPk(req.params.serviceId);
    if (!service)
        return res.send('Service not found').status(404);

    const serviceForm = await ServiceForm.findOne({
        where: { 
            service_id: service.id,
            form_id: req.params.formId
        }
    });
    if (!serviceForm)
        return res.send('Form not found').status(404);

    await serviceForm.destroy();
    res.send('success').status(200);
}));

module.exports = router;