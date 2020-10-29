const config = require('../../config.json');
const { renderEmail } = require('../lib/email')
const { logger } = require('../../logging');
const { UI_WORKSHOPS_URL } = require('../../constants')

async function approveRequest(request) {
    if (request.auto_approve)
        await request.approve();
    else
        await approveConditional(request);
    
    logger.info(`approve: Set enrollment request status to "${request.status}"`);
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

async function grantRequest(request) {
    await email_workshop_enrollment_confirmation(request);
    await request.grant();
}

async function email_workshop_enrollment_request(request) {
    const workshop = request.workshop;
    const user = request.user;
    const workshopEnrollmentRequestUrl = `${UI_WORKSHOPS_URL}/${workshop.id}?t=requests`;

    await renderEmail({
        to: user.email, 
        bcc: config.email.bccWorkshopEnrollmentRequest,
        subject: 'Workshop Enrollment Request', //FIXME hardcoded
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
        subject: 'Workshop Enrollment Approved', //FIXME hardcoded
        templateName: 'review_workshop_enrollment_request',
        fields: {
            "WORKSHOP_NAME": workshop.title,
            "WORKSHOP_URL": workshopUrl
        }
    });
}

module.exports = { approveRequest, grantRequest };