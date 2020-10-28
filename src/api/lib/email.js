const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sendmail = require('sendmail')();
const { hmacKey } = require('../../config');

const ALGO = 'aes-256-cbc';

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

function key() {
    if (!hmacKey)
        throw('Missing "hmacKey" in config');

    const hash = crypto.createHash("sha256");
    hash.update(hmacKey);
    return hash.digest().slice(0, 32);
}

function generateHMAC(data) {
    const cipher = crypto.createCipheriv(ALGO, key(), key().slice(0, 16)) //FIXME use a better IV
    let crypted = cipher.update(data.toString(), 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decodeHMAC(hmac) {
    const encryptedText = Buffer.from(hmac, 'hex');
    const decipher = crypto.createDecipheriv(ALGO, key(), key().slice(0, 16)); //FIXME use a better IV
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = { renderEmail, generateHMAC, decodeHMAC };
