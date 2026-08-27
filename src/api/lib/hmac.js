const crypto = require('crypto')
const config = require('./config')

// Authenticated encryption for short-lived, self-contained tokens (account
// confirmation, password set/reset, signup page-load timestamp). AES-256-GCM
// with a random per-message IV: tampering is detected by the auth tag, so a
// decoded token cannot be forged or malleably altered without the key.
const ALGO = 'aes-256-gcm'
const IV_LENGTH = 12
const TAG_LENGTH = 16

function key() {
    config.init()
    const securityConfig = config.getAll().security || {}
    if (!securityConfig.hmacKey) throw new Error('Missing HMAC_KEY in config')

    return crypto.createHash('sha256').update(securityConfig.hmacKey).digest()
}

// Encrypts data into a "iv:tag:ciphertext" hex string.
function generateHMAC(data) {
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(ALGO, key(), iv)
    const ciphertext = Buffer.concat([
        cipher.update(String(data), 'utf8'),
        cipher.final(),
    ])
    const tag = cipher.getAuthTag()
    return [
        iv.toString('hex'),
        tag.toString('hex'),
        ciphertext.toString('hex'),
    ].join(':')
}

// Decrypts a token produced by generateHMAC. Throws on any tampering or
// malformed input; callers must map every failure to a single generic response.
function decodeHMAC(token) {
    // Derive the key outside the try so a genuine config error (missing key)
    // propagates rather than being masked as an invalid token.
    const derivedKey = key()

    // Every malformed/tampered input collapses to the same generic error so
    // there is no distinguishable failure class for an attacker to probe.
    try {
        const parts = String(token).split(':')
        if (parts.length !== 3) throw new Error('Invalid token')

        const iv = Buffer.from(parts[0], 'hex')
        const tag = Buffer.from(parts[1], 'hex')
        const ciphertext = Buffer.from(parts[2], 'hex')
        if (iv.length !== IV_LENGTH || tag.length !== TAG_LENGTH)
            throw new Error('Invalid token')

        const decipher = crypto.createDecipheriv(ALGO, derivedKey, iv)
        decipher.setAuthTag(tag)
        return Buffer.concat([
            decipher.update(ciphertext),
            decipher.final(), // throws if the auth tag does not verify
        ]).toString('utf8')
    } catch (error) {
        throw new Error('Invalid token')
    }
}

function generateToken(tokenKey) {
    const MAX_AGE = 3 * 24 * 60 * 60 * 1000 // 3 days in milliseconds
    const expires = Date.now() + MAX_AGE
    return generateHMAC(JSON.stringify({ key: tokenKey, expires }))
}

function decodeToken(hmac) {
    // decodeHMAC emits a generic 'Invalid token' on tampering and lets a real
    // config error (missing key) propagate; only the JSON parse is guarded here.
    const json = decodeHMAC(hmac)
    let obj
    try {
        obj = JSON.parse(json)
    } catch (error) {
        throw new Error('Invalid token')
    }
    if (
        typeof obj !== 'object' ||
        obj === null ||
        !('key' in obj) ||
        !('expires' in obj) ||
        isNaN(obj.expires)
    )
        throw new Error('Invalid token')
    if (Date.now() > obj.expires) throw new Error('Expired token')

    return obj.key
}

module.exports = {
    generateHMAC,
    decodeHMAC,
    generateToken,
    decodeToken,
}
