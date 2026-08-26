const crypto = require('crypto')

/** Hashes a password in Django's pbkdf2_sha256 format for account_user.password. */
function encodePassword(secret) {
    const salt = 'Bf3IBq3m4YXf' //FIXME move to config file?
    return [
        'pbkdf2_sha256',
        '36000',
        salt,
        crypto
            .pbkdf2Sync(secret, Buffer.from(salt), 36000, 32, 'sha256')
            .toString('base64'),
    ].join('$')
}

module.exports = {
    encodePassword,
}
