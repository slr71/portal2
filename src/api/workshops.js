const router = require('express').Router();
const { requireAdmin, getUser } = require('../auth');
const models = require('../models');
const User = models.account_user;
const Workshop = models.api_workshop;
const WorkshopEnrollmentRequest = models.api_workshopenrollmentrequest;
const WorkshopEnrollmentRequestLog = models.api_workshopenrollmentrequestlog;
const { approveRequest, grantRequest } = require('./approvers/workshop');

router.get('/', async (req, res) => {
    const workshops = await Workshop.findAll({
        order: [ [ 'enrollment_begins', 'DESC' ] ]
    });

    return res.json(workshops).status(200);
});

router.get('/:id(\\d+)', async (req, res) => {
    const workshop = await Workshop.findByPk(req.params.id, {
        include: [
            { 
                model: User.unscoped(), 
                as: 'owner',
                attributes: [ 'id', 'username', 'first_name', 'last_name', 'email' ]
            },
            {
                model: models.api_service, 
                as: 'services', 
                through: { attributes: [] } // remove connector table
            },
            {
                model: User.unscoped(), 
                as: 'organizers', 
                through: { attributes: [] }, // remove connector table
                attributes: [ 'id', 'username', 'first_name', 'last_name', 'email' ]
            },
            'contacts'
        ]
    });

    return res.json(workshop).status(200);
});

// Update workshop (RESTRICTED TO STAFF)
router.post('/:id(\\d+)', requireAdmin, async (req, res) => {
    const id = req.params.id;
    const fields = req.body;
    console.log(fields);

    let workshop = await Workshop.findByPk(id);
    if (!workshop)
        return res.send('Workshop not found').status(404);

    for (let key in fields) {
        // Ignore any non-updateable fields
        if (['title', 'description', 'about'].includes(key))
            workshop[key] = fields[key];
    }
    await workshop.save();
    await workshop.reload();

    res.json(workshop).status(200);
});

// Get workshop enrollees (RESTRICTED TO STAFF)
router.get('/:id(\\d+)/participants', requireAdmin, async (req, res) => {
    const workshop = await Workshop.findByPk(req.params.id, {
        include: [ 
            {
                model: User.unscoped(),
                as: 'users',
                attributes: [ 'id', 'username', 'first_name', 'last_name', 'email' ],
                through: { attributes: [] } // remove connector table
            }
        ]
    });

    return res.json(workshop.users).status(200);
});

// Create new enrollment request
router.put('/:id(\\d+)/requests', getUser, async (req, res) => {
    const workshopId = req.params.id;

    // Fetch workshop
    const workshop = await Workshop.findByPk(workshopId, { include: [ 'emails' ] });
    if (!workshop)
        return res.send('Workshop not found').status(404);

    // Create enrolllment request if it doesn't already exist
    const [request, created] = await WorkshopEnrollmentRequest.findOrCreate({
        where: { 
            workshop_id: workshop.id,
            user_id: req.user.id
        },
        defaults: {
            status: WorkshopEnrollmentRequest.constants.STATUS_REQUESTED,
            message: WorkshopEnrollmentRequest.constants.MESSAGE_REQUESTED,
            auto_approve: false
        }
    });
    if (!request)
        return res.send('Failed to create request').status(500);

    request.user = req.user;
    request.workshop = workshop;

    // Create initial enrollmment request log entry. Subsequent entries will be automatically created each time
    // the request is updated (see "afterUpdateRequest" hook in src/models/index.js).
    const log = await WorkshopEnrollmentRequestLog.create({
        workshop_enrollment_request_id: request.id,
        status: request.status,
        message: request.message
    })
    if (!log)
        return res.send('Failed to create enrollment request log').status(500);
    
    // Send response to client
    res.json(request).status(201);

    // Call approver and granter (do this after response as to not delay it)
    if (created) // new request
        await approveRequest(request); // updates request status
    if (request.isApproved())
        await grantRequest(request);

    notifyClientOfRequestStatusChange(req.ws, request)
});

// Update enrollment request status //TODO require api key
router.post('/:id(\\d+)/requests', getUser, async (req, res) => {
    const workshopId = req.params.id;
    const status = req.body.status;
    const message = req.body.message;

    if (!status || !message) //TODO verify valid status value
        return res.send('Missing parameter').status(400);

    // Fetch workshop
    const workshop = await Workshop.findByPk(workshopId);
    if (!workshop)
        return res.send("Workshop not found").status(404);

    // Fetch request
    const request = await models.WorkshopEnrollmentRequest.findOne({
        where: { 
            workshop_id: workshop.id,
            user_id: req.user.id
        }
    });
    if (!request)
        return res.send("Request not found").status(404);

    // Update status
    request.set('status', status);
    request.set('message', message);
    await request.save();

    // Send response to client
    res.json(request).status(200);

    // Call granter (do this after response as to not delay it)
    if (request.isApproved())
        await grantRequest(request);

    notifyClientOfRequestStatusChange(req.ws, request)
});

//TODO move into library
function notifyClientOfRequestStatusChange(ws, request) {
    // Send websocket event to client 
    if (ws) {
        ws.send(JSON.stringify({ 
            type: WS_WORKSHOP_ENROLLMENT_REQUEST_STATUS_UPDATE,
            data: {
                requestId: request.id,
                workshopId: request.workshop.id,
                status: request.status
            }
        }))
    }
}

module.exports = router;