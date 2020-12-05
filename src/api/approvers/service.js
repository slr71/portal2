const config = require('../../config.json');
const Argo = require('../lib/argo');
const { intercom_atmosphere } = require('../lib/intercom');
const { emailServiceAccessGranted } = require('../lib/email')
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
// Approval policy and messages updated 12/3/2020 per https://cyverse.atlassian.net/browse/UP-47
async function approveAtmosphere(request) {
    const user = request.user;
    if (!user)
        throw('Missing required property');

    const intro = `Hi ${user.first_name}! Thanks for requesting access to Atmosphere.`;
    const faqUrl = 'https://learning.cyverse.org/projects/faq/en/latest/atmosphere-faq.html';

    // Check if user is a student
    if (user.occupation.name && user.occupation.name.toLowerCase().indexOf('student') >= 0) {
        logger.info(`approveAtmosphere: Pend student user "${user.username}" for request ${request.id}`);
        await intercom_atmosphere(request,
            `${intro}

             We are no longer approving student access for Atmosphere unless you are part of a workshop. Please ask your instructor for details on enrolling into the workshop.

             For more information on the changes happening to Atmosphere, check out this FAQ:
             ${faqUrl}`
        );
        await request.pend();
        return;
    }

    // Deny all other requests
    logger.info(`approveAtmosphere: Deny user "${user.username}" for request ${request.id}`);
    await intercom_atmosphere(request, 
        `${intro}

        We are no longer accepting new accounts as Atmosphere is being changed from a general purpose cloud computing environment to one that supports cloud-native development projects.

        What can I use instead of Atmosphere?
        
        The CyVerse Discovery Environment (https://de.cyverse.org/) is a simple web interface for managing data, running analyses, and visualizing results. See Getting Started with the Discovery Environment: https://learning.cyverse.org/projects/discovery-environment-guide/en/latest/
        
        In addition, the NSF recently extended CyVerse’s long-term partnership with Jetstream (https://jetstream-cloud.org/) through 2025 to provide similar capabilities and interfaces of Atmosphere yet with significantly larger CPU, GPU, and storage infrastructure. This presents an exciting option for our U.S. users. 
        https://cyverse.org/national-science-foundation-10M-award-to-jetstream-2-brings-new-opportunities-for-cyverse
        
        What if I already had images on Atmosphere?
        
        CyVerse staff will provide assistance for U.S.-based researchers to migrate their cloud images to Jetstream, which uses CyVerse Atmosphere as its primary interface. The CyVerse Atmosphere image must be owned by the user and must meet Jetstream’s requirements for importing images. CyVerse cannot guarantee 100% success when exporting a virtual disk image from CyVerse Atmosphere to Jetstream Atmosphere. Jetstream staff will not provide support for imported images, and instead recommends images be recreated in their cloud. For more information about Jetstream, see Getting Started with Jetstream: https://iujetstream.atlassian.net/wiki/spaces/JWT/pages/29720582/Quick+Start+Guide
        
        For more information please see the FAQ: ${faqUrl}
        
        Thank you, please let us know if there anything else we can help you with.`
    );
    await request.deny();
    return;
}

module.exports = { approveRequest, grantRequest };