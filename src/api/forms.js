const router = require('express').Router();
const { requireAdmin } = require('../auth');
const sequelize = require('sequelize');
const models = require('../models');
const FormGroup = models.api_formgroup;
const Form = models.api_form;
const FormSubmission = models.api_formsubmission;
const FormFieldSubmission = models.api_formfieldsubmission;
const { intercom_send_form_submission_confirmation_message } = require('../intercom');

router.get('/', async (req, res) => {
    let requests = await FormGroup.findAll({
        include: [ 
            { 
                model: models.api_form, 
                as: 'forms', 
                through: { attributes: [] } // remove connector table
            }
        ],
        order: [ ['index', 'ASC'] ]
    });

    return res.json(requests).status(200);
});

router.get('/submissions', requireAdmin, async (req, res) => {
    const offset = req.query.offset;
    const limit = req.query.limit || 10;
    const search = req.query.search;

    const { count, rows } = await models.api_formsubmission.findAndCountAll({
        include: [ 'user', 'form' ],
        order: [ ['updated_at', 'DESC'] ],
        offset: offset,
        limit: limit
    });

    return res.json({ count, results: rows }).status(200);
});

router.get('/submissions/:id(\\d+)', requireAdmin, async (req, res) => {
    let submission = await models.api_formsubmission.findByPk(req.params.id, {
        include: [ 
            'user', 'form', 'fields'
        ]
    });

    return res.json(submission).status(200);
});

// Create new form submission
router.put('/:id(\\d+)/submissions', requireAdmin, async (req, res) => {
    const formId = req.params.id;
    const fields = req.body.fields;

    if (!fields || fields.length == 0)
        return res.send('Missing fields').status(400);

    // Fetch form
    const form = await Form.findByPk(formId); //, { include: [] });
    if (!form)
        return res.send('Form not found').status(404);

    // Create form submission
    let submission = await FormSubmission.create({
        form_id: formId,
        user_id: req.user.id,
    });
    if (!submission)
        return res.send('Failed to create form submission').status(500);

    // Save field values
    for (const field of fields) {
        const fieldSubmission = await FormFieldSubmission.create({
            form_submission_id: submission.id,
            form_field_id: field.id,
            value_string: field.value_string,
            value_text: field.value_text,
            value_boolean: field.value_boolean,
            value_number: field.value_number,
            value_select_id: null, //FIXME!!!
            value_email: field.value_email,
            value_date: field.value_date
        });
        if (!fieldSubmission)
            return res.send('Failed to create form field submission').status(500);
    }

    // Refetch submission with additional info
    submission = await FormSubmission.findByPk(submission.id, {
        include: [ 
            'fields',
            { 
                model: 'form',
                include: [ 'intercom_teams' ]
            }
        ]
    });
    
    // Send response to client
    res.json(submission).status(200);

    // Send message via Intercom (do this after response as to not delay it)
    intercom_send_form_submission_confirmation_message(submission);
});

router.get('/:nameOrId([\\w\\%]+)', async (req, res) => {
    const nameOrId = decodeURI(req.params.nameOrId);

    let request = await Form.findOne({
        where:
            sequelize.or(
                { id: isNaN(nameOrId) ? 0 : nameOrId },
                sequelize.where(sequelize.fn('lower', sequelize.col('name')), nameOrId.toLowerCase())
            ),
        include: [ 
            { 
                model: models.api_formsection,
                as: 'sections',
                include: [ 
                    { 
                        model: models.api_formfield, 
                        as: 'fields', 
                        include: [ 'options' ],
                        order: [ ['index', 'ASC'] ]
                    }
                ],
                order: [ ['index', 'ASC'] ]
            }
        ]
    });
    if (!request)
        return res.send('Form not found').status(404);

    return res.json(request).status(200);
});

module.exports = router;