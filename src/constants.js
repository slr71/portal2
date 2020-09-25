// Add global constants here
const config = require('./config');

module.exports = {
  UI_REQUESTS_URL: `${config.uiBaseUrl}/requests`,
  UI_PASSWORD_URL: `${config.uiBaseUrl}/password`,
}

