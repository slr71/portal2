const { describe, test } = require('node:test')
const assert = require('node:assert/strict')
const crypto = require('node:crypto')

const { intercomUserHash } = require('../../../src/api/lib/intercomHash')

// Independent oracle: how Intercom itself computes the verification hash.
const oracle = (id, secret) =>
    crypto.createHmac('sha256', secret).update(String(id)).digest('hex')

describe('intercomUserHash', () => {
    test('matches an HMAC-SHA256 hex digest of the user id', () => {
        assert.equal(intercomUserHash('bob', 's3cret'), oracle('bob', 's3cret'))
    })

    test('is a 64-char lowercase hex string', () => {
        assert.match(intercomUserHash('bob', 's3cret'), /^[0-9a-f]{64}$/)
    })

    test('is deterministic for the same id+secret', () => {
        assert.equal(
            intercomUserHash('bob', 's3cret'),
            intercomUserHash('bob', 's3cret')
        )
    })

    test('differs by user id', () => {
        assert.notEqual(
            intercomUserHash('bob', 's3cret'),
            intercomUserHash('alice', 's3cret')
        )
    })

    test('differs by secret', () => {
        assert.notEqual(
            intercomUserHash('bob', 'secret-a'),
            intercomUserHash('bob', 'secret-b')
        )
    })

    test('coerces a non-string id', () => {
        assert.equal(intercomUserHash(42, 's3cret'), oracle('42', 's3cret'))
    })

    const missing = [
        { name: 'no secret', id: 'bob', secret: undefined },
        { name: 'empty secret', id: 'bob', secret: '' },
        { name: 'no id', id: undefined, secret: 's3cret' },
        { name: 'empty id', id: '', secret: 's3cret' },
    ]
    for (const { name, id, secret } of missing) {
        test(`returns null with ${name}`, () => {
            assert.equal(intercomUserHash(id, secret), null)
        })
    }
})
