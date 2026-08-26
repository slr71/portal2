const { describe, test } = require('node:test')
const assert = require('node:assert/strict')

const { encodePassword } = require('../../../src/api/lib/password')

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
