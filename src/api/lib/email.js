const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sendmail = require('sendmail')();
const { hmacKey } = require('../../config');

const ALGO = 'aes-256-cbc';

function renderEmail({ to, bcc, subject, templateName, fields }) {
    // Load and populate template
    const templatePath = path.join(__dirname, '..', 'templates', templateName + '.txt'); //TODO support htlm templates
    let body = fs.readFileSync(templatePath, 'utf8').toString(); 
    for (f in fields) {
        const regex = new RegExp('\\$\\{' + f + '\\}', 'gi');
        body = body.replace(regex, fields[f]);
    }

    if (Array.isArray(bcc))
        bcc = bcc.join(',')
    
    // console.log(body);
    return sendmail({
        from: 'support@cyverse.org', //FIXME hardcoded
        to,
        bcc,
        subject,
        text: body
        //html: message
    });
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
