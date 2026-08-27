// Server-side constants that use configuration
// NOTE: this module can only be used server-side due to use of configuration manager
const config = require('../api/lib/config')
const { joinUrl } = require('../api/lib/url')

const uiConfig = config.getUiConfig()
const terrainConfig = config.getTerrainConfig()
const externalConfig = config.getExternalConfig()

module.exports = {
    // Front-end URLs
    UI_REQUESTS_URL: `${uiConfig.baseUrl}/requests`,
    UI_PASSWORD_URL: `${uiConfig.baseUrl}/password`,
    UI_CONFIRM_EMAIL_URL: `${uiConfig.baseUrl}/confirm_email`,
    UI_WORKSHOPS_URL: `${uiConfig.baseUrl}/workshops`,
    UI_SERVICES_URL: `${uiConfig.baseUrl}/services`,
    UI_ADMIN_SERVICE_ACCESS_REQUEST_URL: `${uiConfig.baseUrl}/administrative/requests`,
    UI_ADMIN_FORM_SUBMISSION_URL: `${uiConfig.baseUrl}/administrative/submissions`,
    UI_ACCOUNT_REVIEW_URL: `${uiConfig.baseUrl}/account?reviewMode=1`,

    // External URLs
    // joinUrl, not interpolation: terrain.url is commonly configured with a
    // trailing slash, and terrain answers a doubled slash with Jetty's HTML
    // error page rather than JSON.
    EXT_ADMIN_VICE_ACCESS_REQUEST_API_URL: joinUrl(
        terrainConfig.url,
        'admin/settings/concurrent-job-limits'
    ),
    // The DE this portal fronts, which is not derivable from terrain.url --
    // that is the internal service address. Null when unconfigured, so callers
    // omit the link rather than pointing staff at another deployment's DE.
    EXT_ADMIN_VICE_ACCESS_REQUEST_URL: externalConfig.deBaseUrl
        ? joinUrl(externalConfig.deBaseUrl, 'admin/vice')
        : null,
}
