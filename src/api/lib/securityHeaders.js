// Response security headers applied to every response.
//
// The CSP intentionally sets only directives that cannot break rendering:
// frame-ancestors (clickjacking), object-src, and base-uri. A script-src/
// style-src policy (XSS defense-in-depth) needs browser-tested tuning against
// the app's inline GA/Sentry/emotion/Next hydration scripts and is deferred.
const CSP = [
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
].join('; ')

function securityHeaders(req, res, next) {
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.setHeader('Content-Security-Policy', CSP)

    // HSTS only over TLS; harmless (ignored) over plain HTTP, and this avoids
    // asserting HSTS on the internal http hop behind the TLS-terminating proxy.
    if (req.secure || req.headers['x-forwarded-proto'] === 'https')
        res.setHeader(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains'
        )

    next()
}

module.exports = { securityHeaders, CSP }
