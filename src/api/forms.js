const router = require('express').Router();
const { requireAdmin } = require('../auth');
const sequelize = require('sequelize');
const models = require('../models');
const FormGroup = models.api_formgroup;
const Form = models.api_form;
const FormSection = models.api_formsection;
const FormField = models.api_formfield;
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
    const fields = req.body;
    console.log(fields)

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
    //TODO check that submitted field IDs are valid for specified form
    for (const field of fields) {
        const fieldSubmission = await FormFieldSubmission.create({
            form_submission_id: submission.id,
            form_field_id: field.id,
            value_string: field.value_string,
            value_text: field.value_text,
            value_boolean: field.value_boolean,
            value_number: field.value_number,
            //value_select_id: null, //FIXME!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
                model: Form,
                as: 'form',
                include: [ 'intercom_teams' ]
            }
        ]
    });
    
    // Send response to client
    res.json(submission).status(200);

    // Send message via Intercom (do this after response as to not delay it)
    //intercom_send_form_submission_confirmation_message(submission);
});

// Fetch form by ID or name
router.get('/:nameOrId([\\w\\%]+)', async (req, res) => {
    const nameOrId = decodeURI(req.params.nameOrId);

    let request = await Form.findOne({
        where:
            sequelize.or(
                { id: isNaN(nameOrId) ? 0 : nameOrId },
                sequelize.where(sequelize.fn('lower', sequelize.col('name')), nameOrId.toLowerCase())
            ),
        include: [ // move to default scope
            { 
                model: FormSection,
                as: 'sections',
                include: [ 
                    { 
                        model: FormField, 
                        as: 'fields', 
                        include: [ 'options' ],
                        // order: [ ['index', 'ASC'] ] // not working, see order below
                    }
                ],
                order: [ ['index', 'ASC'] ]
            }
        ],
        order: [ [ { model: FormSection, as: 'sections' }, { model: FormField, as: 'fields' }, 'index', 'asc' ] ]
    });
    if (!request)
        return res.send('Form not found').status(404);

    return res.json(request).status(200);
});

// Update form
router.post('/:id(\\d+)', requireAdmin, async (req, res) => {
    const formId = req.params.id;
    const newForm = req.body;
    console.log(newForm)

    // Fetch form
    const form = await Form.findByPk(formId, {
        // include: [ // move to default scope
        //     { 
        //         model: FormSection,
        //         as: 'sections',
        //         include: [ 
        //             { 
        //                 model: FormField, 
        //                 as: 'fields', 
        //                 include: [ 'options' ],
        //                 order: [ ['index', 'ASC'] ]
        //             }
        //         ],
        //         order: [ ['index', 'ASC'] ]
        //     }
        // ]
    });
    if (!form)
        return res.send('Form not found').status(404);

    // Update form fields
    form.name = newForm.name;
    form.description = newForm.description;
    await form.save();

    // Update/create sections/fields
    // for (let newSection of newForm.sections) {
    //     const section = await FormSection.upsert({
    //         form_id: formId,
    //         name: newSection.name,
    //         description: newSection.description,
    //         index: newSection.index
    //     }, { returning: true });
    //     if (!section)
    //         return res.send('Failed to upsert form section').status(500);

    //     for (let newField of newSection.fields) {
    //         const field = await FormField.upsert({
    //             form_section_id: section.id,
    //             name: newField.name,
    //             description: newField.description,
    //             type: newField.type,
    //             index: newField.index,
    //             is_required: newField.is_required,
    //             conversion_key: newField.conversion_key
    //         }, { returning: true });
    //         if (!field)
    //             return res.send('Failed to upsert form field').status(500);
    //     }
    // }

    await form.reload();
    return res.json(form).status(200);
});

// Create form section
router.put('/sections', async (req, res) => {
    const newSection = req.body;
    console.log(newSection)

    if (!newSection || !newSection.name)
        return res.send('Missing fields').status(400);

    const section = await FormSection.create(newSection);
    if (!section)
        return res.send('Failed to create section').status(500)

    return res.json(section).status(201);
});

// Update form section
router.post('/sections/:id(\\d+)/', async (req, res) => {
    const sectionId = req.params.id;
    const newSection = req.body;
    console.log(newSection)

    const section = await FormSection.udpate(newSection, { 
        where: { id: sectionId },
        fields: [ 'name', 'description', 'index' ],
        returning: true
    });
    if (!section)
        return res.send('Failed to update section').status(500)

    return res.json(section).status(200);
});

// Delete form section
router.delete('/sections/:id(\\d+)/', async (req, res) => {
    const section = await FormSection.findByPk(req.params.id);
    if (!section)
        return res.send('Section not found').status(404);

    await section.destroy();

    return res.send(req.params.id).status(200);
});

// Create form field
router.put('/fields', async (req, res) => {
    const newField = req.body;
    console.log(newField)

    if (!newField || !newField.name || !newField.type)
        return res.send('Missing fields').status(400);

    const field = await FormField.create(newField);
    if (!field)
        return res.send('Failed to create field').status(500)

    return res.json(field).status(201);
});

// Update form field
router.post('/fields/:id(\\d+)/', async (req, res) => {
    const fieldId = req.params.id;
    const newField = req.body;
    console.log('update field:', newField)

    const field = await FormField.update(newField, { 
        where: { id: fieldId },
        fields: [ 'name', 'type', 'description', 'index', 'conversion_key', 'is_required' ],
        returning: true
    });
    if (!field)
        return res.send('Failed to update field').status(500)

    return res.json(field).status(200);
});

// Delete form field
router.delete('/fields/:id(\\d+)/', async (req, res) => {
    const field = await FormField.findByPk(req.params.id);
    if (!field)
        return res.send('Field not found').status(404);

    await field.destroy();

    return res.send(req.params.id).status(200);
});

module.exports = router;