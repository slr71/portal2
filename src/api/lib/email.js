const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sendmail = require('sendmail')();
const { hmacKey } = require('../../config');

function renderEmail({ to, bcc, subject, templateName, fields }) {
  // Load and populate template
  const templatePath = path.join(__dirname, '..', 'templates', templateName + '.txt'); //TODO support htlm templates
  let body = fs.readFileSync(templatePath, 'utf8').toString(); 
  for (f in fields) {
    const regex = new RegExp('${' + f + '}', 'gi');
    body = body.replace(regex, fields[f]);
  }

  if (Array.isArray(bcc))
    bcc = bcc.join(',')
  
  return sendmail({
      from: 'support@cyverse.org', //FIXME hardcoded
      to,
      bcc,
      subject,
      text: body
      //html: message
  });
}

function generateHMAC(data) {
  if (!hmacKey)
    throw('Missing "hmacKey" in config');

  const hmac = crypto.createHmac('sha256', hmacKey);
  hmac.update(data);
  return hmac.digest('hex');
}

module.exports = { renderEmail, generateHMAC };
