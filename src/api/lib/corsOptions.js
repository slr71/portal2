// CORS options with a strict origin allowlist, extracted so the allowlist logic
// is testable without the server. The previous blanket cors() reflected any
// origin; here a browser cross-origin request is granted CORS headers only when
// its Origin is on the allowlist, and credentials are never reflected
// cross-origin so the session cookie cannot ride a cross-site XHR.

/** Normalizes a URL/origin string to its scheme://host[:port] origin, or null. */
function toOrigin(value) {
    try {
        return new URL(value).origin
    } catch (_) {
        return null
    }
}

// The portal's own UI origin plus any explicitly configured extras. Same-origin
// requests never consult CORS, so this set only governs which cross-origin
// sites may read API responses.
function buildAllowedOrigins({ uiBaseUrl, allowedOrigins = [] } = {}) {
    const origins = new Set()
    const own = toOrigin(uiBaseUrl)
    if (own) origins.add(own)
    for (const o of allowedOrigins) {
        const norm = toOrigin(o)
        if (norm) origins.add(norm)
    }
    return origins
}

// Builds the options object passed to cors(). Requests with no Origin header
// (same-origin navigations, <img>/<script> loads, server-to-server, curl) pass
// through; a browser cross-origin request is allowed only when its Origin is
// allowlisted. A disallowed origin yields no CORS headers rather than an error,
// so non-CORS uses (image embedding) are unaffected.
function corsOptionsFromConfig(cfg) {
    const allowed = buildAllowedOrigins(cfg)
    return {
        credentials: false,
        origin(origin, callback) {
            if (!origin || allowed.has(origin)) return callback(null, true)
            return callback(null, false)
        },
    }
}

module.exports = { toOrigin, buildAllowedOrigins, corsOptionsFromConfig }
