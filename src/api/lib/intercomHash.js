const crypto = require('crypto')

// Intercom Identity Verification hash: HMAC-SHA256 of the user identifier keyed
// by the Intercom identity-verification secret. It is sent to the client and
// passed to Intercom's boot as `user_hash` so Intercom can confirm the visitor
// is who the page claims; the secret itself never leaves the server. Returns
// null when the secret or id is missing, in which case verification simply
// stays off (Intercom boots unverified, as before).
function intercomUserHash(userId, secret) {
    if (!secret || !userId) return null
    return crypto
        .createHmac('sha256', String(secret))
        .update(String(userId))
        .digest('hex')
}

module.exports = { intercomUserHash }
