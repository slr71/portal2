const Intercom = require('intercom-client');
const axios = require('axios');
const models = require('./models');
const AccessRequestConversation = models.api_accessrequestconversation;
const logger = require('./logging');
const config = require('./config.json');

const intercom = new Intercom.Client({ token: config.intercom.token });

async function create_contact(user) {
    const contacts = await search('contacts', {
        field: 'external_id',
        operator: '=',
        value: user.username
    }); 
    if (contacts)
        return contacts[0];

    const contact = await intercom.contacts.create({
        role: "user",
        email: user.email,
        name: user.first_name + ' ' + user.last_name,
        external_id: user.username
    });
    logger.info(`Created Intercom contact ${contact.id} for ${user.username}`);
    return contact;
}

// Their Node client is pretty outdated and doesn't support the search endpoint yet
async function search(resource, query) {
    const res = await axios.post(
        `${intercom.requestOpts.baseUrl}/${resource}/search`, 
        { query },
        { headers: { Authorization: `Bearer ${config.intercom.token}` } }
    );
    if (res && res.data && res.data.total_count > 0) {
        if (res.data.type == 'list')
            return res.data.data;
        else
            return res.data[resource];
    }
}

async function get_conversation(id) {
    const res = await intercom.conversations.find({ id });
    if (res && res.body)
        return res.body;
}

async function start_conversation(user, body) {
    // Make sure contact exists
    const contact = await create_contact(user);

    // Create message (which will result in a new conversation)
    const message = await intercom.messages.create({
        "from": {
            "type": "user",
            "email": contact.email
        },
        "body": body
    });

    // Poll for conversation creation
    let tries = 10;
    let conversation;
    do {
        await new Promise(resolve => setTimeout(resolve, 1000)); // sleep 1 second

        const conversations = await search('conversations', {
            field: 'source.id',
            operator: '=',
            value: message.body.id
        });
        if (conversations)
            conversation = conversations[0];
    } while (!conversation && tries-- > 0);

    return [conversation, message.body]
}

function get_atmosphere_conversation_body(questions, answers) {
    let body = "Atmosphere access requested.";

    if (questions && questions.length > 0) {
        body += " Here are the details:";

        for (question of questions) {
            body += "\n\n" + question.question;
            const answer = answers.find(a => a.access_request_question_id == question.id);
            if (!answer) {
                body = body + "\n\n[blank]"
                continue;
            }

            if (question.type == 'char')
                body += "\n\n" + answer.value_char;
            else if (question.type == 'text')
                body += "\n\n" + answer.value_text;
            else if (question.type == 'bool')
                body += "\n\n" + answer.value_bool;
        }
    }

    return body;
}

async function intercom_atmosphere(request, responseMessage) {
    const service = request.service;
    const user = request.user;

    const body = get_atmosphere_conversation_body(service.questions, request.answers);
    const [conversation, message] = await start_conversation(user, body);

    await AccessRequestConversation.create({
        access_request_id: request.id,
        intercom_message_id: message.id,
        intercom_conversation_id: conversation.id
    });

    await add_note_to_conversation(conversation.id, `This request can be viewed at ${config.accessRequestsUrl}/${request.id}`);

    await reply_to_conversation(conversation.id, responseMessage);
    await assign_conversation_to_atmosphere_team(conversation.id);
}

async function intercom_send_form_submission_confirmation_message(submission) {
    const user = submission.user;
    const intercomTeams = submission.intercomTeams;

    const body = get_form_submission_conversation_body(user, submission);
    connst [conversation, message] = await start_conversation(user, body);

    await FormSubmissionConversation.create(
        form_submission=form_submission,
        intercom_message_id=message.id,
        intercom_conversation_id=conversation.id
    );

    await add_note_to_conversation(conversation.id, `This form submission can be viewed at ${config.formSubmissionUrl}/${submission.id}`);
   
    await reply_to_conversation(conversation.id,
        `Hi ${user.first_name}! Thanks for submitting the form. One of the staff will review it and get back to you. In the meantime, feel free to respond to this message if you'd like to chat more about your request.`
    );

    if (intercomTeams && intercomTeams.length > 0)
        assign_conversation_to_intercom_team(conversation.id, intercomTeams[0].id)
}

async function add_note_to_conversation(conversationId, message) {
    try {
        await intercom.conversations.reply({
            id: conversationId,
            type: 'admin',
            admin_id: config.intercom.adminBotId,
            message_type: 'note',
            body: message
        })
    }
    catch (e) {
        console.log(e.body.errors)
    }
}

async function assign_conversation_to_atmosphere_team(conversationId) {
    await assign_conversation(conversationId, config.intercom.adminTier1AtmosphereId)
}

async function assign_conversation_to_science_team(conversationId) {
    await assign_conversation(conversationId, config.intercom.adminTier1ScienceTeamId)
}

async function assign_conversation_to_intercom_team(conversationId, intercomTeamId) {
    await assign_conversation(conversationId, intercomTeamId)
}

async function assign_conversation(conversationId, assigneeId) {
    await intercom.conversations.reply({
        id: conversationId,
        type: 'admin',
        admin_id: config.intercom.adminBotId,
        assignee_id: assigneeId,
        message_type: 'assignment'
    })
}

async function reply_to_conversation(conversationId, message) {
    await intercom.conversations.reply({
        id: conversationId,
        type: 'admin',
        admin_id: config.intercom.adminBotId,
        message_type: 'comment',
        body: message
    });
}

module.exports = { get_conversation, intercom_atmosphere, intercom_send_form_submission_confirmation_message };