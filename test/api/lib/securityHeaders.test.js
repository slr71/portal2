const { describe, test } = require('node:test')
const assert = require('node:assert/strict')

const { securityHeaders } = require('../../../src/api/lib/securityHeaders')

function run(req) {
    const headers = {}
    const res = { setHeader: (k, v) => (headers[k] = v) }
    let nexted = false
    securityHeaders(req, res, () => (nexted = true))
    return { headers, nexted }
}

describe('securityHeaders', () => {
    test('sets the clickjacking and hygiene headers and calls next', () => {
        const { headers, nexted } = run({ headers: {} })
        assert.equal(nexted, true)
        assert.equal(headers['X-Frame-Options'], 'DENY')
        assert.equal(headers['X-Content-Type-Options'], 'nosniff')
        assert.equal(
            headers['Referrer-Policy'],
            'strict-origin-when-cross-origin'
        )
        assert.match(
            headers['Content-Security-Policy'],
            /frame-ancestors 'none'/
        )
        assert.match(headers['Content-Security-Policy'], /object-src 'none'/)
        assert.match(headers['Content-Security-Policy'], /base-uri 'self'/)
    })

    test('the CSP does not restrict script-src/style-src (non-breaking)', () => {
        const { headers } = run({ headers: {} })
        assert.doesNotMatch(headers['Content-Security-Policy'], /script-src/)
        assert.doesNotMatch(headers['Content-Security-Policy'], /style-src/)
    })

    test('omits HSTS on a plain-HTTP request', () => {
        const { headers } = run({ headers: {} })
        assert.equal(headers['Strict-Transport-Security'], undefined)
    })

    test('sets HSTS when the request is secure', () => {
        const { headers } = run({ secure: true, headers: {} })
        assert.match(headers['Strict-Transport-Security'], /max-age=31536000/)
    })

    test('sets HSTS behind a TLS-terminating proxy (x-forwarded-proto)', () => {
        const { headers } = run({ headers: { 'x-forwarded-proto': 'https' } })
        assert.match(headers['Strict-Transport-Security'], /includeSubDomains/)
    })
})
