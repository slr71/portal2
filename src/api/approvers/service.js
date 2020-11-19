const config = require('../../config.json');
const Argo = require('../lib/argo');
const { intercom_atmosphere } = require('../lib/intercom');
const { logger } = require('../lib/logging');

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
    AUTO_APPROVE: 'auto-grant-access',
    ATMOSPHERE: 'atmosphere-grant-access',
    DATA_COMMONS: 'data-commmons-grant-access',
    DISCOVERY_ENVIRONMENT: 'discovery-environment-grant-access',
    COGE: 'coge-grant-access',
    BISQUE: 'bisque-grant-access',
    SCI_APPS: 'sciapps-grant-access'
};

async function grantRequest(request) {
    if (!request.service || !request.user)
        throw('Missing required property')

    let workflow = GRANTERS.AUTO_APPROVE;
    const key = request.service.approval_key;
    if (key in GRANTERS)
        workflow = GRANTERS[key];

    console.log('grantRequest:', key, workflow);

    // Submit Argo workflow
    await Argo.submit(
        'services.yaml',
        workflow,
        {
            // User params
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

    await request.grant();
    logger.info(`grant: Set service access request ${request.id} status to "${request.status}"`);
}


/*
 * Service-specific approvers
 */

// See portal:/warden/approvers/atmosphere.py
async function approveAtmosphere(request) {
    const user = request.user;
    const intro = `Hi ${user.first_name}! Thanks for requesting access to Atmosphere.`;

    // Check if user is a student //FIXME add student request form
    // if (user.occupation.name && user.occupation.name.toLowerCase().indexOf('student') >= 0) {
    //     await intercom_atmosphere(request,
    //         `${intro}
    //          Before we can approve your request, we need some additional information. 
    //          Could you please fill out the form below?\n\n${config.atmosphereStudentRequestFormUrl}`
    //     );
    //     await request.pend();
    //     return;
    // }

    // Check if user is international
    if (user.region.country.name != 'United States') {
        logger.info(`approveAtmosphere: Deny user from country ${user.region.country.name} for request ${request.id}`);
        // await intercom_atmosphere(request,
        //     `${intro}
        //      Before we can approve your request, we need some additional information. 
        //      Could you please fill out the form below?\n\n${atmosphereInternationalRequestFormUrl}`
        // );
        // await request.pend();
        await intercom_atmosphere(request, 
            `${intro}

             At this time, CyVerse Atmosphere is no longer accepting new requests from non-US users. Here is information about alternative services within CyVerse or platforms outside of CyVerse:
             https://learning.cyverse.org/projects/faq/en/latest/atmosphere-faq.html
             
             Please let us know if you have any questions.`
        );
        await request.deny();
        return;
    }

    // Check if user has an auto-approvable email address
    const validEmail = user.emails.some(email => 
        email.email.endsWith('.edu') || email.email.endsWith('@cyverse.org') || email.email.endsWith('.gov')
    );
    if (!validEmail) {
        logger.info(`approveAtmosphere: Deny user with emails ${user.emails.map(e => e.email).join(', ')} for request ${request.id}`);
        await intercom_atmosphere(request, 
            `${intro}

             In order to use CyVerse Atmosphere you must have a *.edu or *.gov email address associated with your account. 
             If you have one, and can add it, we can approve your request.
             
             Please let us know if you have any questions.`
        );
        await request.deny();
        return;
    }

    // All requirements met
    await request.approve();
}

module.exports = { approveRequest, grantRequest };