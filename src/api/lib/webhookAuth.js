const crypto = require('crypto')

/** Constant-time string comparison; false (not throw) on length mismatch. */
function safeEqual(a, b) {
    const ab = Buffer.from(String(a))
    const bb = Buffer.from(String(b))
    return ab.length === bb.length && crypto.timingSafeEqual(ab, bb)
}

/**
 * Validates a shared-secret webhook key. Fails closed: a request is authorized
 * only when a key is configured AND the caller supplied a matching value.
 */
function verifyWebhookKey(configuredKey, providedKey) {
    if (!configuredKey || !providedKey) return false
    return safeEqual(providedKey, configuredKey)
}

module.exports = { safeEqual, verifyWebhookKey }
