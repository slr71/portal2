const { describe, test } = require('node:test')
const assert = require('node:assert/strict')
const crypto = require('node:crypto')

const {
    checkDjangoPassword,
    checkLDAPPassword,
    checkPassword,
    encodePassword,
} = require('../../../src/api/lib/password')

/** Builds a {SSHA} hash the way OpenLDAP does: base64(sha1(pw + salt) + salt). */
function makeSshaHash(secret, salt) {
    const digest = crypto
        .createHash('sha1')
        .update(secret + salt)
        .digest()
    return (
        '{SSHA}' + Buffer.concat([digest, Buffer.from(salt)]).toString('base64')
    )
}

describe('encodePassword', () => {
    test('produces a four-part Django pbkdf2_sha256 hash', () => {
        const hash = encodePassword('hunter2')
        const parts = hash.split('$')

        assert.equal(parts.length, 4)
        assert.equal(parts[0], 'pbkdf2_sha256')
        assert.equal(parts[1], '36000')
        assert.match(parts[2], /^[A-Za-z0-9]+$/)
        assert.match(parts[3], /^[A-Za-z0-9+/]+=*$/)
    })

    test('matches a known-good vector', () => {
        // Pins the algorithm, iteration count, salt, and digest length. A
        // change to any of them invalidates every stored password.
        assert.equal(
            encodePassword('correct horse battery staple'),
            'pbkdf2_sha256$36000$Bf3IBq3m4YXf$dpAgXkqsEG0Xeg5KzTx0DFIw6icf5PHrqbO+YT9EjB0='
        )
    })

    test('is deterministic', () => {
        // The salt is hardcoded, so every user with the same password gets the
        // same hash. See the FIXME in src/api/lib/password.js.
        assert.equal(encodePassword('hunter2'), encodePassword('hunter2'))
    })

    test('distinguishes different passwords', () => {
        assert.notEqual(encodePassword('hunter2'), encodePassword('hunter3'))
    })

    const inputs = [
        { name: 'an empty password', secret: '' },
        { name: 'a unicode password', secret: 'pâssw☃rd' },
        { name: 'a long password', secret: 'x'.repeat(4096) },
        { name: 'a password containing a dollar sign', secret: 'a$b$c' },
    ]

    for (const { name, secret } of inputs) {
        test(`encodes ${name}`, () => {
            assert.match(encodePassword(secret), /^pbkdf2_sha256\$36000\$/)
        })
    }
})

describe('checkDjangoPassword', () => {
    test('accepts the password it encoded', () => {
        assert.equal(
            checkDjangoPassword(encodePassword('hunter2'), 'hunter2'),
            true
        )
    })

    test('rejects the wrong password', () => {
        assert.equal(
            checkDjangoPassword(encodePassword('hunter2'), 'hunter3'),
            false
        )
    })

    const malformed = [
        { name: 'an empty string', hash: '' },
        { name: 'a hash with no separators', hash: 'garbage' },
        { name: 'a hash with too few parts', hash: 'pbkdf2_sha256$36000$salt' },
    ]

    for (const { name, hash } of malformed) {
        test(`returns false for ${name}`, () => {
            assert.equal(checkDjangoPassword(hash, 'hunter2'), false)
        })
    }

    test('rejects a hash whose iteration count was altered', () => {
        const hash = encodePassword('hunter2').replace('36000', '1000')
        assert.equal(checkDjangoPassword(hash, 'hunter2'), false)
    })
})

describe('checkPassword', () => {
    test('dispatches non-SSHA hashes to the Django check', () => {
        assert.equal(checkPassword(encodePassword('hunter2'), 'hunter2'), true)
    })

    test('dispatches {SSHA} hashes to the LDAP check', () => {
        // The LDAP path is currently broken (see test/FINDINGS.md #1), so the
        // observable difference is that a valid Django password fails once the
        // hash carries the {SSHA} label.
        const hash = '{SSHA}' + encodePassword('hunter2')
        assert.equal(checkPassword(hash, 'hunter2'), false)
    })
})

describe('checkLDAPPassword', () => {
    test('rejects a valid {SSHA} hash', () => {
        // Documents current, incorrect behavior. See test/FINDINGS.md #1:
        // the comparison is between a string and a Buffer, so it is never true.
        const hash = makeSshaHash('hunter2', 'abcd1234')
        assert.equal(checkLDAPPassword(hash, 'hunter2'), false)
    })

    test('rejects an invalid password', () => {
        const hash = makeSshaHash('hunter2', 'abcd1234')
        assert.equal(checkLDAPPassword(hash, 'wrong'), false)
    })

    test.skip('accepts a valid {SSHA} hash', () => {
        // Enable once FINDINGS.md #1 is fixed.
        const hash = makeSshaHash('hunter2', 'abcd1234')
        assert.equal(checkLDAPPassword(hash, 'hunter2'), true)
    })
})
