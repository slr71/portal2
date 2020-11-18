const fs = require('fs');
const path = require('path');

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

    const config = {
        from: 'support@cyverse.org', //FIXME move into config file
        to,
        subject
    };

    if (bcc) {
        if (Array.isArray(bcc))
            bcc = bcc.join(',');
        config['bcc'] = bcc;
    }

    if (body['html'])
        config.html = body['html']
    else
        config.text = body['txt']

    return sendmail(config);
}



module.exports = { renderEmail };
