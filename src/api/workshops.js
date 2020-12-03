const router = require('express').Router();
const { getUser, requireAdmin, asyncHandler } = require('./lib/auth');
const sequelize = require('sequelize');
const models = require('./models');
const User = models.account_user;
const Workshop = models.api_workshop;
const WorkshopEnrollmentRequest = models.api_workshopenrollmentrequest;
const WorkshopEnrollmentRequestLog = models.api_workshopenrollmentrequestlog;
const WorkshopOrganizer = models.api_workshoporganizer;
const WorkshopContact = models.api_workshopcontact;
const WorkshopService = models.api_workshopservice;
const WorkshopParticipant = models.api_userworkshop;
const WorkshopEmail= models.api_workshopuseremail;
const { approveRequest, grantRequest } = require('./approvers/workshop');
const { notifyClientOfWorkshopRequestStatusChange } = require('./lib/ws');

function hasHostAccess(workshop, user) {
    return workshop.creator_id == user.id || user.is_staff
}

function hasOrganizerAccess(workshop, user) {
    return hasHostAccess(workshop, user) || workshop.organizers.some(o => o.id == user.id)
}

// Get all workshops
router.get('/', asyncHandler(async (req, res) => {
    const workshops = await Workshop.findAll({
        include: [ //TODO create scope for this
            {
                model: User.unscoped(), 
                as: 'organizers', 
                through: { attributes: [] }, // remove connector table
                attributes: [ 'id' ]
            }
        ],
        order: [ [ 'enrollment_begins', 'DESC' ] ]
    });

    return res.json(workshops).status(200);
}));

// Get workshop by ID
router.get('/:id(\\d+)', asyncHandler(async (req, res) => {
    const workshop = await Workshop.findByPk(req.params.id, {
        include: [ //TODO create scope for this
            'contacts',
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
            }
        ],
        order: [ [ 'services', 'name', 'ASC' ] ]
    });

    return res.json(workshop).status(200);
}));

// Create workshop (STAFF ONLY)
router.put('/', getUser, requireAdmin, asyncHandler(async (req, res) => {
    if (!req.body.title)
        return res.send('Missing title').status(400);
    
    // Set default workshop properties
    const timeNow = Date.now()
    const defaults = {
        creator_id: req.user.id,
        about: '',
        description: '',
        enrollment_begins: timeNow,
        enrollment_ends: timeNow,
        contact_email: '',
        contact_name: '',
        end_date: timeNow,
        start_date: timeNow
    };
    const fields = { ...defaults, ...req.body }; // override default values with request values, if any

    // Create workshop
    const workshop = await Workshop.create(fields);
    if (!workshop)
        return res.send('Failed to create workshop').status(500);

    res.json(workshop).status(201);
}));

// Update workshop
router.post('/:id(\\d+)', getUser, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const fields = req.body;
    console.log(fields);

    const workshop = await Workshop.findByPk(id, {
        include: [ //TODO create scope for this
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
    if (!workshop)
        return res.send('Workshop not found').status(404);

    // Check permission
    if (!hasOrganizerAccess(workshop, req.user))
        return res.send('Permission denied').status(403);

    // Verify and update fields
    for (let key in fields) {
        const SUPPORTED_FIELDS = ['title', 'description', 'about', 'enrollment_begins', 'enrollment_ends', 'creator_id'];
        const RESTRICTED_FIELDS = [ 'enrollment_begins', 'enrollment_ends', 'creator_id' ]
        if (RESTRICTED_FIELDS.includes(key) && !req.user.is_staff)
            return res.send('Restricted field').status(403);
        if (!SUPPORTED_FIELDS.includes(key))
            return res.send('Unsupported field').status(400);
        workshop[key] = fields[key];
    }
    await workshop.save();
    await workshop.reload();

    res.json(workshop).status(200);
}));

// Get workshop participants (enrollees)
router.get('/:id(\\d+)/participants', getUser, asyncHandler(async (req, res) => {
    const workshop = await Workshop.findByPk(req.params.id, {
        include: [ 
            {
                model: User.unscoped(), //TODO create scope for this
                as: 'users',
                attributes: [ 'id', 'username', 'first_name', 'last_name', 'email' ],
                through: { attributes: [] } // remove connector table
            }
        ],
        order: [ [ sequelize.fn('lower', sequelize.col('first_name')), 'ASC' ] ]
    });
    if (!workshop)
        return res.send('Workshop not found').status(404);

    // Check permission -- only workshop host/organizer and staff 
    if (!hasOrganizerAccess(workshop, req.user))
        return res.send('Permission denied').status(403);

    return res.json(workshop.users).status(200);
}));

// Add participant to workshop (enroll user)
router.put('/:id(\\d+)/participants', getUser, asyncHandler(async (req, res) => {
    const userId = req.body.userId
    if (!userId)
        return res.send('Missing user id').status(400);

    const workshop = await Workshop.findByPk(req.params.id);
    if (!workshop)
        return res.send('Workshop not found').status(404);

    // Check permission -- only workshop host/organizer and staff 
    if (!hasOrganizerAccess(workshop, req.user))
        return res.send('Permission denied').status(403);

    const [participant, created] = await WorkshopParticipant.findOrCreate({ 
        where: { 
            workshop_id: workshop.id,
            user_id: userId
        } 
    });

    res.json(participant).status(201);

    // Call granter (do this after response as to not delay it)
    const request = await WorkshopEnrollmentRequest.create({
        workshop_id: workshop.id,
        user_id: req.user.id,
        auto_approve: true,
        status: WorkshopEnrollmentRequest.constants.STATUS_REQUESTED,
        message: WorkshopEnrollmentRequest.constants.MESSAGE_REQUESTED
    });
    await grantRequest(request); 
}));

// Remove participant from workshop
router.delete('/:workshopId(\\d+)/participants/:userId(\\d+)', getUser, asyncHandler(async (req, res) => {
    const workshop = await Workshop.findByPk(req.params.workshopId);
    if (!workshop)
        return res.send('Workshop not found').status(404);

    // Check permission -- only workshop host/organizer and staff 
    if (!hasOrganizerAccess(workshop, req.user))
        return res.send('Permission denied').status(403);

    const participant = await WorkshopParticipant.findOne({ 
        where: { 
            workshop_id: workshop.id,
            user_id: req.params.userId
        } 
    });
    if (!participant)
        return res.send('Participant not found').status(404);

    await participant.destroy();
    res.send('success').status(200);
}));

// Get workshop emails (pre-approved users)
router.get('/:id(\\d+)/emails', getUser, asyncHandler(async (req, res) => {
    const workshop = await Workshop.findByPk(req.params.id, {
        include: [ 
            {
                model: WorkshopEmail, //TODO create scope for this
                as: 'emails',
                attributes: [ 'id', 'email' ]
            }
        ],
        order: [ [ sequelize.fn('lower', sequelize.col('email')), 'ASC' ] ]
    });
    if (!workshop)
        return res.send('Workshop not found').status(404);

    // Check permission -- only workshop host/organizer and staff 
    if (!hasOrganizerAccess(workshop, req.user))
        return res.send('Permission denied').status(403);

    return res.json(workshop.emails).status(200);
}));

// Add email to workshop
router.put('/:id(\\d+)/emails', getUser, asyncHandler(async (req, res) => {
    const workshop = await Workshop.findByPk(req.params.id);
    if (!workshop)
        return res.send('Workshop not found').status(404);

    // Check permission -- only workshop host/organizer and staff 
    if (!hasOrganizerAccess(workshop, req.user))
        return res.send('Permission denied').status(403);

    const [email, created] = await WorkshopEmail.findOrCreate({ 
        where: { 
            workshop_id: workshop.id,
            email: req.body.email
        }
    });
    res.json(email).status(201);
}));

// Remove email from workshop
router.delete('/:workshopId(\\d+)/emails/:email(\\S+)', getUser, asyncHandler(async (req, res) => {
    const workshop = await Workshop.findByPk(req.params.workshopId);
    if (!workshop)
        return res.send('Workshop not found').status(404);

    // Check permission -- only workshop host/organizer and staff 
    if (!hasOrganizerAccess(workshop, req.user))
        return res.send('Permission denied').status(403);

    const email = await WorkshopEmail.findOne({ 
        where: { 
            workshop_id: workshop.id,
            email: req.params.email
        } 
    });
    if (!email)
        return res.send('Email not found').status(404);

    await email.destroy();
    res.send('success').status(200);
}));

// Add organizer to workshop
router.put('/:id(\\d+)/organizers', getUser, asyncHandler(async (req, res) => {
    const userId = req.body.userId
    if (!userId)
        return res.send('Missing user id').status(400);

    const workshop = await Workshop.findByPk(req.params.id);
    if (!workshop)
        return res.send('Workshop not found').status(404);

    // Check permission -- only workshop host and staff 
    if (!hasHostAccess(workshop, req.user))
        return res.send('Permission denied').status(403);

    const [organizer, created] = await WorkshopOrganizer.findOrCreate({ 
        where: { 
            workshop_id: workshop.id,
            organizer_id: userId
        } 
    });
    res.json(organizer).status(201);
}));

// Remove organizer from workshop
router.delete('/:workshopId(\\d+)/organizers/:userId(\\d+)', getUser, asyncHandler(async (req, res) => {
    const workshop = await Workshop.findByPk(req.params.workshopId);
    if (!workshop)
        return res.send('Workshop not found').status(404);

    // Check permission -- only workshop host and staff
    if (!hasHostAccess(workshop, req.user))
        return res.send('Permission denied').status(403);

    const organizer = await WorkshopOrganizer.findOne({ 
        where: { 
            workshop_id: workshop.id,
            organizer_id: req.params.userId
        } 
    });
    if (!organizer)
        return res.send('Organizer not found').status(404);

    await organizer.destroy();
    res.send('success').status(200);
}));

// Add contact to workshop
router.put('/:id(\\d+)/contacts', getUser, asyncHandler(async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    if (!name || !email)
        return res.send('Missing params').status(400);

    const workshop = await Workshop.findByPk(req.params.id, {
        include: [ //TODO create scope for this
            {
                model: User.unscoped(), 
                as: 'organizers', 
                through: { attributes: [] }, // remove connector table
                attributes: [ 'id' ]
            }
        ]
    });
    if (!workshop)
        return res.send('Workshop not found').status(404);

    // Check permission -- only workshop host/organizer and staff 
    if (!hasOrganizerAccess(workshop, req.user))
        return res.send('Permission denied').status(403);

    const [contact, created] = await WorkshopContact.findOrCreate({ 
        where: { 
            workshop_id: workshop.id,
            name,
            email
        } 
    });
    res.json(contact).status(201);
}));

// Remove contact from workshop
router.delete('/:workshopId(\\d+)/contacts/:email(\\S+)', getUser, asyncHandler(async (req, res) => {
    const workshop = await Workshop.findByPk(req.params.workshopId, {
        include: [ //TODO create scope for this
            {
                model: User.unscoped(), 
                as: 'organizers', 
                through: { attributes: [] }, // remove connector table
                attributes: [ 'id' ]
            }
        ]
    });
    if (!workshop)
        return res.send('Workshop not found').status(404);

    // Check permission -- only workshop host/organizer and staff
    if (!hasOrganizerAccess(workshop, req.user))
        return res.send('Permission denied').status(403);

    const contact = await WorkshopContact.findOne({ 
        where: {
            workshop_id: workshop.id,
            email: req.params.email
        } 
    });
    if (!contact)
        return res.send('Contact not found').status(404);

    await contact.destroy();
    res.send('success').status(200);
}));

// Add service to workshop
router.put('/:id(\\d+)/services', getUser, asyncHandler(async (req, res) => {
    const serviceId = req.body.serviceId
    if (!serviceId)
        return res.send('Missing service id').status(400);

    const workshop = await Workshop.findByPk(req.params.id, {
        include: [ //TODO create scope for this
            {
                model: User.unscoped(), 
                as: 'organizers', 
                through: { attributes: [] }, // remove connector table
                attributes: [ 'id' ]
            }
        ]
    });
    if (!workshop)
        return res.send('Workshop not found').status(404);

    // Check permission -- only workshop host/organizer or staff
    if (!hasOrganizerAccess(workshop, req.user))
        return res.send('Permission denied').status(403);

    const [service, created] = await WorkshopService.findOrCreate({ 
        where: { 
            workshop_id: workshop.id,
            service_id: serviceId
        } 
    });
    res.json(service).status(201);
}));

// Remove service from workshop
router.delete('/:workshopId(\\d+)/services/:serviceId(\\d+)', getUser, asyncHandler(async (req, res) => {
    const workshop = await Workshop.findByPk(req.params.workshopId, {
        include: [ //TODO create scope for this
            {
                model: User.unscoped(), 
                as: 'organizers', 
                through: { attributes: [] }, // remove connector table
                attributes: [ 'id' ]
            }
        ]
    });
    if (!workshop)
        return res.send('Workshop not found').status(404);

    // Check permission -- only workshop host and staff
    if (!hasHostAccess(workshop, req.user))
        return res.send('Permission denied').status(403);

    const service = await WorkshopService.findOne({
        where: {
            workshop_id: workshop.id,
            service_id: req.params.serviceId
        }
    });
    if (!service)
        return res.send('Service not found').status(404);

    await service.destroy();
    res.send('success').status(200);
}));

// Get workshop enrollment requests 
router.get('/:id(\\d+)/requests', getUser, asyncHandler(async (req, res) => {
    const workshopId = req.params.id;

    // Fetch workshop
    const workshop = await Workshop.findByPk(workshopId);
    if (!workshop)
        return res.send('Workshop not found').status(404);

    // Check permission -- only workshop host/organizer or staff
    if (!hasOrganizerAccess(workshop, req.user))
        return res.send('Permission denied').status(403);

    const requests = await WorkshopEnrollmentRequest.findAll({ 
        where: { 
            workshop_id: workshopId
        },
        include: [ 
            'logs',
            {
                model: User.unscoped(), //TODO create scope for this
                as: 'user',
                attributes: [ 'id', 'username', 'first_name', 'last_name', 'email', 'institution', 'department' ],
                include: [
                    'funding_agency',
                    'occupation',
                    'research_area',
                    { model: models.account_region, 
                      as: 'region',
                      include: [
                        'country'
                      ]
                    }
                ]
            }
        ],
        order: [ [ 'logs', 'created_at', 'ASC' ] ]
    });
    return res.json(requests).status(200);
}));

// Create new enrollment request
router.put('/:id(\\d+)/requests', getUser, asyncHandler(async (req, res) => {
    const workshopId = req.params.id;

    // Fetch workshop
    const workshop = await Workshop.findByPk(workshopId, { 
        include: [ 
            'emails',
            'services'
        ]
    });
    if (!workshop)
        return res.send('Workshop not found').status(404);

    // Check permission -- only workshop host/organizer or staff
    if (!hasOrganizerAccess(workshop, req.user))
        return res.send('Permission denied').status(403);

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
    request.user = req.user;
    request.workshop = workshop;
    if (created) // new request
        await approveRequest(request); // updates request status
    if (request.isApproved())
        await grantRequest(request);

    notifyClientOfWorkshopRequestStatusChange(req.ws, request)
}));

// Update enrollment request status 
router.post('/:id(\\d+)/requests', getUser, asyncHandler(async (req, res) => {
    const workshopId = req.params.id;
    const status = req.body.status;

    // Fetch workshop
    const workshop = await Workshop.findByPk(workshopId, {
        include: [ 
            'services'
        ]
    });
    if (!workshop)
        return res.send("Workshop not found").status(404);

    // Check permission -- only workshop host/organizer or staff
    if (!hasOrganizerAccess(workshop, req.user))
        return res.send('Permission denied').status(403);

    // Fetch request
    const request = await WorkshopEnrollmentRequest.findOne({
        where: { 
            workshop_id: workshop.id,
            user_id: req.user.id
        }
    });
    if (!request)
        return res.send("Request not found").status(404);

    // Update status
    switch (status) {
        case 'pending': request.pend(); break;
        case 'approved': request.approve(); break;
        case 'granted': request.grant(); break;
        case 'denied': request.deny(); break;
        default:
          return res.send('Invalid status').status(400);
    }

    // Send response to client
    res.json(request).status(200);

    // Call granter (do this after response as to not delay it)
    request.user = req.user;
    request.workshop = workshop;
    if (request.isApproved())
        await grantRequest(request);

    notifyClientOfWorkshopRequestStatusChange(req.ws, request)
}));

module.exports = router;