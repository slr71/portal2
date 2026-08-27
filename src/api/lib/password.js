const crypto = require('crypto')

// pbkdf2_sha256 work factor (OWASP-guided). Stored in each hash, so hashes
// written with different counts remain independently verifiable.
const ITERATIONS = 600000
const SALT_LENGTH = 12
const SALT_CHARS =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

// A random Django-style alphanumeric salt (used as UTF-8 bytes in pbkdf2, and
// safe to place between the '$' delimiters of the encoded hash).
function randomSalt() {
    const bytes = crypto.randomBytes(SALT_LENGTH)
    let salt = ''
    for (let i = 0; i < SALT_LENGTH; i++)
        salt += SALT_CHARS[bytes[i] % SALT_CHARS.length]
    return salt
}

/** Hashes a password in Django's pbkdf2_sha256 format with a random per-user salt. */
function encodePassword(secret) {
    const salt = randomSalt()
    const hash = crypto
        .pbkdf2Sync(secret, Buffer.from(salt), ITERATIONS, 32, 'sha256')
        .toString('base64')
    return ['pbkdf2_sha256', String(ITERATIONS), salt, hash].join('$')
}

module.exports = { encodePassword, ITERATIONS }
