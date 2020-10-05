// Add global constants here
const config = require('./config');

module.exports = {
  UI_REQUESTS_URL: `${config.uiBaseUrl}/requests`,
  UI_PASSWORD_URL: `${config.uiBaseUrl}/password`,
  UI_CONFIRM_EMAIL_URL: `${config.uiBaseUrl}/confirm_email`,

  ACCOUNT_UPDATE_REMINDER_COOKIE: 'account_update_reminder'
}

