const { describe, test } = require('node:test')
const assert = require('node:assert/strict')
const crypto = require('node:crypto')

const { encodePassword, ITERATIONS } = require('../../../src/api/lib/password')

/** Re-derive the hash from the encoded parts, as a Django verifier would. */
function verify(secret, encoded) {
    const [algo, iterations, salt, hash] = encoded.split('$')
    if (algo !== 'pbkdf2_sha256') return false
    const expected = crypto
        .pbkdf2Sync(secret, Buffer.from(salt), Number(iterations), 32, 'sha256')
        .toString('base64')
    return expected === hash
}

describe('encodePassword', () => {
    test('produces a four-part Django pbkdf2_sha256 hash', () => {
        const parts = encodePassword('hunter2').split('$')
        assert.equal(parts.length, 4)
        assert.equal(parts[0], 'pbkdf2_sha256')
        assert.equal(parts[1], String(ITERATIONS))
        assert.match(parts[2], /^[A-Za-z0-9]{12}$/) // 12-char alphanumeric salt
        assert.match(parts[3], /^[A-Za-z0-9+/]+=*$/)
    })

    test('uses at least the OWASP-guided iteration count', () => {
        assert.ok(ITERATIONS >= 600000, `iterations ${ITERATIONS} too low`)
        assert.equal(encodePassword('x').split('$')[1], String(ITERATIONS))
    })

    test('uses a random per-user salt (not the old shared salt)', () => {
        const salts = new Set(
            Array.from(
                { length: 20 },
                () => encodePassword('same').split('$')[2]
            )
        )
        // 20 encodings of the same password should yield 20 distinct salts.
        assert.equal(salts.size, 20)
        assert.ok(!salts.has('Bf3IBq3m4YXf')) // the removed hardcoded salt
    })

    test('is non-deterministic: same password -> different hashes', () => {
        assert.notEqual(encodePassword('hunter2'), encodePassword('hunter2'))
    })

    test('produces a self-describing, verifiable hash', () => {
        const encoded = encodePassword('correct horse battery staple')
        assert.ok(verify('correct horse battery staple', encoded))
        assert.ok(!verify('wrong password', encoded))
    })

    const inputs = [
        { name: 'an empty password', secret: '' },
        { name: 'a unicode password', secret: 'pâssw☃rd' },
        { name: 'a long password', secret: 'x'.repeat(4096) },
        { name: 'a password containing a dollar sign', secret: 'a$b$c' },
    ]
    for (const { name, secret } of inputs) {
        test(`encodes and verifies ${name}`, () => {
            const encoded = encodePassword(secret)
            assert.match(encoded, /^pbkdf2_sha256\$600000\$/)
            assert.ok(verify(secret, encoded))
        })
    }
})
