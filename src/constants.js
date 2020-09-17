// Add global constants here
const config = require('./config');

module.exports = {
  UI_FORMS_URL: `${config.uiBaseUrl}/requests`,
  UI_PASSWORD_SET_URL: `${config.uiBaseUrl}/password/set`
}

