// Add global constants here
module.exports = {
  // Front-end URLs
  UI_REQUESTS_URL: `${process.env.UI_BASE_URL}/requests`,
  UI_PASSWORD_URL: `${process.env.UI_BASE_URL}/password`,
  UI_CONFIRM_EMAIL_URL: `${process.env.UI_BASE_URL}/confirm_email`,
  UI_WORKSHOPS_URL: `${process.env.UI_BASE_URL}/workshops`,
  UI_SERVICES_URL: `${process.env.UI_BASE_URL}/services`,
  UI_ADMIN_SERVICE_ACCESS_REQUEST_URL: `${process.env.UI_BASE_URL}/administrative/requests`,
  UI_ADMIN_FORM_SUBMISSION_URL: `${process.env.UI_BASE_URL}/administrative/submissions`,
  UI_ACCOUNT_REVIEW_URL: `${process.env.UI_BASE_URL}/account?reviewMode=1`,

  // External URLs
  EXT_ADMIN_VICE_ACCESS_REQUEST_URL: 'https://de.cyverse.org/admin/vice',

  // Cookie Names
  ACCOUNT_UPDATE_REMINDER_COOKIE: 'account_update_reminder',
  WELCOME_BANNER_COOKIE: 'welcome_banner',

  // Websocket Events
  WS_CONNECTED: 'WS_CONNECTED',
  WS_SERVICE_ACCESS_REQUEST_STATUS_UPDATE: 'WS_SERVICE_ACCESS_REQUEST_STATUS_UPDATE',
  WS_WORKSHOP_ENROLLMENT_REQUEST_STATUS_UPDATE: 'WS_WORKSHOP_ENROLLMENT_REQUEST_STATUS_UPDATE'
}
