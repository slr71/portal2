const models = require('../models');
const AccessRequestConversation = models.api_accessrequestconversation;
const Argo = require('../lib/argo');
const { emailServiceAccessGranted } = require('../lib/email')
const { logger } = require('../lib/logging');
const intercom = require('../lib/intercom');
const { serviceRegistrationWorkflow } = require('../workflows/native/services.js');
const { UI_ADMIN_SERVICE_ACCESS_REQUEST_URL } = require('../../constants');
const config = require('../../config.json');

// Only the Atmosphere service has a special approval requirements, all other services are auto-approved.
const APPROVERS = {
    ATMOSPHERE: approveAtmosphere
};

async function approveRequest(request) {
    const key = request.service.approval_key;
    
    if (!request.auto_approve && key in APPROVERS)
        await APPROVERS[key](request);
    else
        await request.approve();
    
    logger.info(`approve: Set service access request ${request.id} status to "${request.status}"`);
}

// Map service approval keys to Argo workflow templates
const GRANTERS = {
    ATMOSPHERE: 'atmosphere-grant-access',
    //DATA_COMMONS: 'data-commmons-grant-access', // use AUTO_APPROVE 
    DISCOVERY_ENVIRONMENT: 'discovery-environment-grant-access',
    COGE: 'coge-grant-access',
    BISQUE: 'bisque-grant-access',
    SCI_APPS: 'sciapps-grant-access'
};

async function grantRequest(request) {
    logger.info(`grant: Service ${request.service.name} for user ${request.user.username} (approval_key="${request.service.approval_key}")`);
    if (!request.service || !request.user)
        throw('service:grantRequest: Missing required property')

    const key = request.service.approval_key;
    if (key in GRANTERS) {
        if (config.argo) {
            const workflow = GRANTERS[key];
            logger.info('grantRequest:', key, workflow);

            // Submit Argo workflow
            await Argo.submit(
                'services.yaml',
                workflow,
                {
                    // User params
                    request_id: request.id,
                    user_id: request.user.username,
                    email: request.user.email,

                    // Other params
                    portal_api_base_url: config.apiBaseUrl,
                    ldap_host: config.ldap.host,
                    ldap_admin: config.ldap.admin,
                    ldap_password: config.ldap.password,
                    bisque_url: config.bisque.url,
                    bisque_username: config.bisque.username,
                    bisque_password: config.bisque.password
                }
            );

            // Status is set to "granted" in Argo workflow via POST to /api/services/requests/[id]
        }
        else { // Argo disabled, fall back to native workflow
            await serviceRegistrationWorkflow(request);
            await request.grant();
            await emailServiceAccessGranted(request);
        }
    }
    else { // AUTO_APPROVE
        logger.info('grantRequest: AUTO_APPROVE');
        await request.grant();
        await emailServiceAccessGranted(request);
    }

    logger.info(`grant: Set service access request ${request.id} status to "${request.status}"`);
}


/*
 * Service-specific approvers
 */

// Based on v1 portal:/warden/approvers/atmosphere.py
// Approval policy and messages updated 12/3/2020 per https://cyverse.atlassian.net/browse/UP-47
async function approveAtmosphere(request) {
    const user = request.user;
    if (!user)
        throw('service:approveAtmosphere: Missing required property');

    const intro = `Hi ${user.first_name}! Thanks for requesting access to Atmosphere.`;
    const faqUrl = 'https://learning.cyverse.org/projects/faq/en/latest/atmosphere-faq.html';

    // Check if user is a student
    if (user.occupation.name && user.occupation.name.toLowerCase().indexOf('student') >= 0) {
        logger.info(`approveAtmosphere: Pend student user "${user.username}" for request ${request.id}`);
        await request.pend();
        await sendAtmosphereSignupMessage(request,
`${intro}

We are no longer approving student access for Atmosphere unless you are part of a workshop. Please ask your instructor for details on enrolling into the workshop.

For more information please see the FAQ: ${faqUrl}`
        );
        return;
    }

    // Deny all other requests
    logger.info(`approveAtmosphere: Deny user "${user.username}" for request ${request.id}`);
    await request.deny();
    await sendAtmosphereSignupMessage(request, 
`${intro}

We are no longer accepting new accounts as Atmosphere is being changed from a general purpose cloud computing environment to one that supports cloud-native development projects.

For more information please see the FAQ: ${faqUrl}`
    );
    return;
}

function getAtmosphereConversationBody(questions, answers) {
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

async function sendAtmosphereSignupMessage(request, responseMessage) {
    const service = request.service;
    const user = request.user;
    if (!service || !user)
        throw('service:sendAtmosphereSignupMessage: Missing required property')

    const body = getAtmosphereConversationBody(service.questions, request.answers);
    const [conversation, message] = await intercom.startConversation(user, body);

    await AccessRequestConversation.create({
        access_request_id: request.id,
        intercom_message_id: message.id,
        intercom_conversation_id: conversation.id
    });

    await intercom.addNoteToConversation(conversation.id, `This request can be viewed at ${UI_ADMIN_SERVICE_ACCESS_REQUEST_URL}/${request.id}`);
    await intercom.replyToConversation(conversation.id, responseMessage);
    await intercom.assignConversationToAtmosphereTeam(conversation.id);
}

module.exports = { approveRequest, grantRequest };