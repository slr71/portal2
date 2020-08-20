const config = require('../../config.json');
const Argo = require('../../argo');
const { intercom_atmosphere } = require('../../intercom');
const logger = require('../../logging');

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
    
    logger.info(`approve: Set access request status to "${request.status}"`);
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
    let workflow = GRANTERS.AUTO_APPROVE;
    const key = request.service.approval_key;
    if (key in GRANTERS)
        workflow = GRANTERS[key];

    console.log('grantRequest:', key);

    // Submit Argo workflow
    await Argo.submit(
        `../${workflowDefinitionPath}/services.yaml`,
        'bisque-grant-access',
        {
            user_id: request.user.username,
            password: "FIXME",
            email: request.user.email,
            ldap_host: "ldap://pollit.iplantcollaborative.org",
            ldap_admin: "cn=MANAGER,dc=iplantcollaborative,dc=org",
            ldap_password: "QA-iplantLDAP",
            portal_api_base_url: "http://10.0.2.15:3022",
            mailchimp_username: "FIXME",
            mailchimp_api_key: "FIXME",
            mailchimp_list_id: "FIXME",
            user_id_number: "FIXME",
            first_name: request.user.first_name,
            last_name: request.user.last_name,
            department: request.user.department,
            organization: request.user.institution,
            title: 'FIXME'
        }
    );
}


/*
 * Service-specific approvers
 */

// See portal:/warden/approvers/atmosphere.py
async function approveAtmosphere(request) {
    const user = request.user;
    const intro = `Hi ${user.first_name}! Thanks for requesting access to Atmosphere.`;

    // Check if user is a student
    if (user.occupation.name && user.occupation.name.toLowerCase().indexOf('student') >= 0) {
        await intercom_atmosphere(request,
            `${intro}
             Before we can approve your request, we need some additional information. 
             Could you please fill out the form below?\n\n${config.atmosphereStudentRequestFormUrl}`
        );
        await request.pend();
        return;
    }

    // Check if user is international
    if (user.region.country.name != 'United States') {
        await intercom_atmosphere(request,
            `${intro}
             Before we can approve your request, we need some additional information. 
             Could you please fill out the form below?\n\n${atmosphereInternationalRequestFormUrl}`
        );
        await request.pend();
        return;
    }

    // Check if user has an auto-approvable email address
    const validEmail = user.emails.some(email => 
        email.email.endsWith('.edu') || email.email.endsWith('@cyverse.org') || email.email.endsWith('.gov')
    );
    if (!validEmail) {
        await intercom_atmosphere(request, 
            `${intro}
             In order to use the service, you must have a *.edu or *.gov email address associated with your account. 
             If you have one, and can add it, we can approve your request.`
        );
        await request.deny();
        return;
    }

    // All requirements met
    await request.approve();
}

module.exports.approveRequest = approveRequest;
module.exports.grantRequest = grantRequest;