const config = require('../../config.json');
const Argo = require('../lib/argo');
const { intercom_atmosphere } = require('../lib/intercom');
const { emailServiceAccessGranted } = require('../lib/email')
const { logger } = require('../lib/logging');
const { UI_SERVICES_URL } = require('../../constants');

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
    DATA_COMMONS: 'data-commmons-grant-access',
    DISCOVERY_ENVIRONMENT: 'discovery-environment-grant-access',
    COGE: 'coge-grant-access',
    BISQUE: 'bisque-grant-access',
    SCI_APPS: 'sciapps-grant-access'
};

async function grantRequest(request) {
    if (!request.service || !request.user)
        throw('Missing required property')

    const key = request.service.approval_key;
    if (key in GRANTERS) {
        const workflow = GRANTERS[key];

        logger.info('grantRequest:', key, workflow);

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

        // Status is set to "granted" in Argo workflow via POST to /api/services/[name]/requests
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
async function approveAtmosphere(request) {
    const user = request.user;
    const intro = `Hi ${user.first_name}! Thanks for requesting access to Atmosphere.`;
    const faqUrl = 'https://learning.cyverse.org/projects/faq/en/latest/atmosphere-faq.html';

    // Check if user is a student
    if (user.occupation.name && user.occupation.name.toLowerCase().indexOf('student') >= 0) {
        await intercom_atmosphere(request,
            `${intro}

             We are no longer approving student access for Atmosphere unless you are part of a workshop. Please ask your instructor for details on enrolling into the workshop.

             For more information on the changes happening to Atmosphere, check out this FAQ:
             ${faqUrl}`
        );
        await request.pend();
        return;
    }

    // Check if user is international
    if (user.region.country.name != 'United States') {
        logger.info(`approveAtmosphere: Deny user from country ${user.region.country.name} for request ${request.id}`);
        await intercom_atmosphere(request, 
            `${intro}

             At this time, CyVerse Atmosphere is no longer accepting new requests from non-US users. Here is information about alternative services within CyVerse or platforms outside of CyVerse:
             ${faqUrl}
             
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