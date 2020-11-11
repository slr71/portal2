const config = require('../../config.json');
const models = require('../../models');
const AccessRequest = models.api_accessrequest;
const { renderEmail } = require('../../lib/email')
const { logger } = require('../../logging');
const { UI_WORKSHOPS_URL } = require('../../constants');
const serviceApprovers = require('./service');

async function approveRequest(request) {
    if (request.auto_approve)
        await request.approve();
    else
        await approveConditional(request);
    
    logger.info(`approve: Set workshop enrollment request ${request.id} status to "${request.status}"`);
}

async function approveConditional(request) {
    const user = request.user;
    const workshop = request.workshop;

    // Check if user has a pre-approved email address
    const emails = user.emails.map(e => e.email);
    const workshopEmail = workshop.emails.some(email => emails.includes(email));
    if (workshopEmail) 
        await request.approve();
    else {
        // User is not pre-approved, send an email to the instructor
        await email_workshop_enrollment_request(request);
        await request.pend();
    }
}

// Expects a request object with a user and workshop incl. services
async function grantRequest(request) {
    if (!request.user || !request.workshop || !request.workshop.services)
        throw('Missing required property')

    // Grant access to all services used in workshop
    for (let service of request.workshop.services) {
        logger.info(`grant: Grant access to service ${service.name} for workshop enrollment request ${request.id}`);
        let serviceRequest = await AccessRequest.findOne({
            where: { 
                service_id: service.id,
                user_id: request.user.id
            }
        });
        if (!serviceRequest) {
            serviceRequest = await AccessRequest.create({
                service_id: service.id,
                user_id: request.user.id,
                auto_approve: true,
                status: AccessRequest.constants.STATUS_REQUESTED,
                message: AccessRequest.constants.MESSAGE_REQUESTED
            });
        }

        if (!serviceRequest.isGranted()) { 
            serviceRequest.service = service;
            serviceRequest.user = request.user;
            serviceApprovers.grantRequest(serviceRequest)
        }
    }

    await email_workshop_enrollment_confirmation(request);
    await request.grant();
    logger.info(`grant: Set workshop enrollment request ${request.id} status to "${request.status}"`);
}

async function email_workshop_enrollment_request(request) {
    const workshop = request.workshop;
    const user = request.user;
    const workshopEnrollmentRequestUrl = `${UI_WORKSHOPS_URL}/${workshop.id}?t=requests`;

    await renderEmail({
        to: user.email, 
        bcc: config.email.bccWorkshopEnrollmentRequest,
        subject: 'Workshop Enrollment Request',
        templateName: 'review_workshop_enrollment_request',
        fields: {
            "WORKSHOP_NAME": workshop.title,
            "FULL_NAME": `${user.first_name} ${user.last_name}`,
            "USERNAME": user.username,
            "EMAIL": user.email,
            "INSTITUTION": user.institution,
            "COUNTRY": user.region.country.name,
            "WORKSHOP_ENROLLMENT_REQUEST_URL": workshopEnrollmentRequestUrl
        }
    });
}

async function email_workshop_enrollment_confirmation(request) {
    const workshop = request.workshop;
    const user = request.user;
    const workshopUrl = `${UI_WORKSHOPS_URL}/${workshop.id}`;

    await renderEmail({
        to: user.email, 
        bcc: config.email.bccWorkshopEnrollmentRequest,
        subject: 'Workshop Enrollment Approved',
        templateName: 'workshop_enrollment',
        fields: {
            "WORKSHOP_NAME": workshop.title,
            "WORKSHOP_URL": workshopUrl
        }
    });
}

module.exports = { approveRequest, grantRequest };