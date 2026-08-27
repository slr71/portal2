// Session-fixation defenses for the keycloak-connect + express-session flow.
//
// keycloak-connect stores the grant into the EXISTING session at login, so a
// pre-auth session ID (which an attacker may have fixed in the victim's browser)
// would otherwise carry into the authenticated session. keycloak-connect offers
// no async hook at the login redirect, so instead we rotate the ID on the first
// request that carries a grant, preserving the grant across the new session.

const GRANT_KEY = 'keycloak-token'
const ROTATED_FLAG = 'regeneratedAfterLogin'

function regenerateSessionOnLogin(req, res, next) {
    const session = req.session
    if (!session || !session[GRANT_KEY] || session[ROTATED_FLAG]) return next()

    const grant = session[GRANT_KEY]
    session.regenerate(err => {
        if (err) return next(err)
        req.session[GRANT_KEY] = grant
        req.session[ROTATED_FLAG] = true
        req.session.save(saveErr => next(saveErr))
    })
}

// Invalidate the whole session on logout rather than only clearing the grant.
function installLogoutSessionDestroy(keycloakClient) {
    keycloakClient.deauthenticated = function (request) {
        // Defer: keycloak-connect's logout runs unstore (which touches
        // request.session) synchronously right after this, and
        // express-session's destroy() nulls request.session synchronously.
        // Destroying now would make that unstore throw and abort the SLO
        // redirect. Destroy on the next tick instead.
        const session = request.session
        if (session) setImmediate(() => session.destroy(() => {}))
    }
}

module.exports = {
    regenerateSessionOnLogin,
    installLogoutSessionDestroy,
    GRANT_KEY,
    ROTATED_FLAG,
}
