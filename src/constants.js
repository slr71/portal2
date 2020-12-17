// Add global constants here
const config = require('./config');

module.exports = {
  // Front-end URLs
  UI_REQUESTS_URL: `${config.uiBaseUrl}/requests`,
  UI_PASSWORD_URL: `${config.uiBaseUrl}/password`,
  UI_CONFIRM_EMAIL_URL: `${config.uiBaseUrl}/confirm_email`,
  UI_WORKSHOPS_URL: `${config.uiBaseUrl}/workshops`,
  UI_SERVICES_URL: `${config.uiBaseUrl}/services`,
  UI_ADMIN_SERVICE_ACCESS_REQUEST_URL: `${config.uiBaseUrl}/administrative/requests`,
  UI_ADMIN_FORM_SUBMISSION_URL: `${config.uiBaseUrl}/administrative/submissions`,

  // Cookie Names
  ACCOUNT_UPDATE_REMINDER_COOKIE: 'account_update_reminder',

  // Websocket Events
  WS_CONNECTED: 'WS_CONNECTED',
  WS_SERVICE_ACCESS_REQUEST_STATUS_UPDATE: 'WS_SERVICE_ACCESS_REQUEST_STATUS_UPDATE',
  WS_WORKSHOP_ENROLLMENT_REQUEST_STATUS_UPDATE: 'WS_WORKSHOP_ENROLLMENT_REQUEST_STATUS_UPDATE'
}

