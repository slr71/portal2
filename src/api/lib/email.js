const fs = require('fs');
const sendmail = require('sendmail')();

function renderEmail({ to, bcc, subject, templatePath, fields }) {
  let template = fs.readFileSync(templatePath, 'utf8');
  for (f in fields) {
      template = template.replaceAll('${' + f + '}', fields[f]);
  }
  
  return sendmail({
      from: 'support@cyverse.org', //FIXME hardcoded
      to,
      bcc,
      subject,
      text: template
      //html: message
  });
}

module.exports.renderEmail = renderEmail;
