// Add global constants here
const config = require('./config');

module.exports = {
  UI_REQUESTS_URL: `${config.uiBaseUrl}/requests`,
  UI_PASSWORD_SET_URL: `${config.uiBaseUrl}/password`,
  UI_PASSWORD_RESET_URL: `${config.uiBaseUrl}/password?reset`
}

