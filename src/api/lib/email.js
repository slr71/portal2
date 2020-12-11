const fs = require('fs');
const path = require('path');
const config = require('../../config.json')
const { UI_WORKSHOPS_URL, UI_SERVICES_URL, UI_PASSWORD_URL, UI_CONFIRM_EMAIL_URL } = require('../../constants')

const sendmail = require('sendmail')({
    silent: true
});

function renderEmail({ to, bcc, subject, templateName, fields }) {
    let body = {};

    // Load and populate email template
    for (let ext of ['html', 'txt']) {
        const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.${ext}`);
        if (fs.existsSync(templatePath)) {
            body[ext] = fs.readFileSync(templatePath, 'utf8').toString(); 
            for (f in fields) {
                const regex = new RegExp('\\$\\{' + f + '\\}', 'gi');
                body[ext] = body[ext] .replace(regex, fields[f]);
            }
            if (!body[ext])
                throw('Empty email template');
            break; // only load txt template if html template doesn't exist
        }
    }

    if (Array.isArray(to))
        to = to.join(',');

    const cfg = {
        from: 'support@cyverse.org', //FIXME move into config file
        to,
        subject
    };

    if (bcc) {
        if (Array.isArray(bcc))
            bcc = bcc.join(',');
            cfg['bcc'] = bcc;
    }

    if (body['html'])
        cfg.html = body['html']
    else
        cfg.text = body['txt']

    return sendmail(cfg);
}

async function emailNewAccountConfirmation(email, hmac) {
    const confirmationUrl = `${UI_PASSWORD_URL}?code=${hmac}`;
    await renderEmail({
        to: email, 
        bcc: config.email.bccNewAccountConfirmation,
        subject: '[CyVerse] Please Confirm Your E-Mail Address',
        templateName: 'email_confirmation_signup',
        fields: {
            "ACTIVATE_URL": confirmationUrl,
            "FORMS_URL": UI_REQUESTS_URL
        }
    });
}

async function emailNewEmailConfirmation(email, hmac) {
    const confirmationUrl = `${UI_CONFIRM_EMAIL_URL}?code=${hmac}`;
    await renderEmail({
        to: email, 
        //bcc: null,
        subject: 'CyVerse Email Confirmation',
        templateName: 'add_email_confirmation',
        fields: {
            "ACTIVATE_URL": confirmationUrl,
        }
    })
}

async function emailPasswordReset(email, hmac) {
    const resetUrl = `${UI_PASSWORD_URL}?reset&code=${hmac}`;
    await renderEmail({
        to: email, 
        bcc: config.email.bccPasswordChangeRequest,
        subject: 'CyVerse Password Reset',
        templateName: 'password_reset',
        fields: {
            "PASSWORD_RESET_URL": resetUrl,
            "USERNAME": emailAddress.user.username
        }
    });
}

async function emailServiceAccessGranted(request) {
    const service = request.service;
    const user = request.user;
    const serviceUrl = `${UI_SERVICES_URL}/${service.id}`;

    await renderEmail({
        to: user.email, 
        bcc: config.email.bccServiceAccessGranted,
        subject: 'CyVerse Service Access Granted',
        templateName: 'access_granted',
        fields: {
            "SERVICE_NAME": service.name,
            "SERVICE_URL": serviceUrl
        }
    });
}

async function emailWorkshopEnrollmentRequest(request) {
    const workshop = request.workshop;
    const user = request.user;
    const workshopEnrollmentRequestUrl = `${UI_WORKSHOPS_URL}/${workshop.id}?t=requests`;

    await renderEmail({
        to: user.email, 
        bcc: config.email.bccWorkshopEnrollmentRequest,
        subject: 'CyVerse Workshop Enrollment Request',
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

async function emailWorkshopEnrollmentConfirmation(request) {
    const workshop = request.workshop;
    const user = request.user;
    const workshopUrl = `${UI_WORKSHOPS_URL}/${workshop.id}`;

    await renderEmail({
        to: user.email, 
        bcc: config.email.bccWorkshopEnrollmentRequest,
        subject: 'CyVerse Workshop Enrollment Approved',
        templateName: 'workshop_enrollment',
        fields: {
            "WORKSHOP_NAME": workshop.title,
            "WORKSHOP_URL": workshopUrl
        }
    });
}

module.exports = { 
    emailNewAccountConfirmation, 
    emailNewEmailConfirmation,
    emailPasswordReset,
    emailServiceAccessGranted, 
    emailWorkshopEnrollmentRequest, 
    emailWorkshopEnrollmentConfirmation 
};
