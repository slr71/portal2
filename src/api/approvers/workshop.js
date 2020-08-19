const config = require('../../config.json');
const Argo = require('../../argo');
const logger = require('../../logging');

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

    // Submit Argo workflow
    await Argo.submit(
        `${config.argo.workflowDefinitionPath}/workshops.yaml`,
        'workshop-review-enrollment-request',
        {  
            workshop_name: workshop.title,
            username: user.username,
            email: user.email,
            full_name: `${user.first_name} ${user.last_name}`,
            institution: user.institution,
            country: user.region.country.name,
            workshop_enrollment_request_url: 'FIXME',
            portal_api_base_url: "http://10.0.2.15:3022" //FIXME
        }
    );
}

async function email_workshop_enrollment_confirmation(request) {
    const workshop = request.workshop;
    const user = request.user;

    // Submit Argo workflow
    await Argo.submit(
        `../${workflowDefinitionPath}/workshops.yaml`,
        'workshop-grant-enrollment-request',
        {   
            workshop_name: workshop.title,
            workshop_id: workshop.id,
            user_id: user.username,
            email: user.email,
            portal_api_base_url: "http://10.0.2.15:3022" //FIXME
        }
    );
}

module.exports.approveRequest = approveRequest;
module.exports.grantRequest = grantRequest;