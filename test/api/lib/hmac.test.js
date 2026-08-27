const { describe, test } = require('node:test')
const assert = require('node:assert/strict')

const { baseConfig, writeConfig, loadModule } = require('../../helpers/config')

const HMAC_MODULE = require.resolve('../../../src/api/lib/hmac')
const THREE_DAYS = 3 * 24 * 60 * 60 * 1000

/** Loads hmac.js bound to a config built from the base fixture. */
function loadHmac(mutate) {
    const config = baseConfig()
    if (mutate) mutate(config)
    return loadModule(HMAC_MODULE, writeConfig(config))
}

describe('generateHMAC / decodeHMAC', () => {
    const payloads = [
        { name: 'an ASCII string', value: 'hello world' },
        { name: 'a number', value: '12345' },
        { name: 'a JSON document', value: JSON.stringify({ a: 1, b: [2, 3] }) },
        { name: 'a unicode string', value: 'héllo ☃' },
        { name: 'an empty string', value: '' },
    ]

    for (const { name, value } of payloads) {
        test(`round-trips ${name}`, () => {
            const { generateHMAC, decodeHMAC } = loadHmac()
            assert.equal(decodeHMAC(generateHMAC(value)), value)
        })
    }

    test('coerces non-string input to a string', () => {
        const { generateHMAC, decodeHMAC } = loadHmac()
        assert.equal(decodeHMAC(generateHMAC(42)), '42')
    })

    test('produces iv:tag:ciphertext hex output', () => {
        const { generateHMAC } = loadHmac()
        assert.match(generateHMAC('hello'), /^[0-9a-f]+:[0-9a-f]+:[0-9a-f]*$/)
    })

    test('is non-deterministic (random IV per message)', () => {
        // The whole point of the fix: identical plaintext must not produce
        // identical ciphertext, and both must still decode.
        const { generateHMAC, decodeHMAC } = loadHmac()
        const a = generateHMAC('hello')
        const b = generateHMAC('hello')
        assert.notEqual(a, b)
        assert.equal(decodeHMAC(a), 'hello')
        assert.equal(decodeHMAC(b), 'hello')
    })

    test('rejects a value encrypted under a different key', () => {
        const a = loadHmac(c => (c.security.hmacKey = 'key-one'))
        const encrypted = a.generateHMAC('hello')
        const b = loadHmac(c => (c.security.hmacKey = 'key-two'))
        assert.throws(() => b.decodeHMAC(encrypted), /Invalid token/)
    })

    const tampered = [
        {
            name: 'a flipped ciphertext byte',
            mangle: h => {
                const p = h.split(':')
                p[2] = flipHexChar(p[2])
                return p.join(':')
            },
        },
        {
            name: 'a flipped auth-tag byte',
            mangle: h => {
                const p = h.split(':')
                p[1] = flipHexChar(p[1])
                return p.join(':')
            },
        },
        {
            name: 'a flipped IV byte',
            mangle: h => {
                const p = h.split(':')
                p[0] = flipHexChar(p[0])
                return p.join(':')
            },
        },
        { name: 'wrong number of parts', mangle: () => 'aa:bb' },
        { name: 'a short IV', mangle: () => 'aa:' + 'bb'.repeat(16) + ':cc' },
        { name: 'non-hex input', mangle: () => 'zz:zz:zz' },
        { name: 'an empty string', mangle: () => '' },
    ]

    for (const { name, mangle } of tampered) {
        test(`rejects ${name}`, () => {
            const { generateHMAC, decodeHMAC } = loadHmac()
            const encrypted = generateHMAC('a message here')
            assert.throws(() => decodeHMAC(mangle(encrypted)), /Invalid token/)
        })
    }
})

describe('generateToken / decodeToken', () => {
    test('round-trips a numeric key', () => {
        const { generateToken, decodeToken } = loadHmac()
        assert.equal(decodeToken(generateToken(42)), 42)
    })

    test('round-trips a string key', () => {
        const { generateToken, decodeToken } = loadHmac()
        assert.equal(decodeToken(generateToken('abc')), 'abc')
    })

    test('accepts a token just inside its window', t => {
        let now = 1700000000000
        t.mock.method(Date, 'now', () => now)

        const { generateToken, decodeToken } = loadHmac()
        const token = generateToken(7)

        now += THREE_DAYS - 1
        assert.equal(decodeToken(token), 7)
    })

    test('rejects a token past its window', t => {
        let now = 1700000000000
        t.mock.method(Date, 'now', () => now)

        const { generateToken, decodeToken } = loadHmac()
        const token = generateToken(7)

        now += THREE_DAYS + 1
        assert.throws(() => decodeToken(token), /Expired token/)
    })

    // Every malformed/tampered/incomplete payload must collapse to the same
    // 'Invalid token' error — no distinguishable classes (no padding oracle).
    test('rejects a tampered token uniformly', () => {
        const { generateToken, decodeToken } = loadHmac()
        const token = generateToken(7)
        const parts = token.split(':')
        parts[2] = flipHexChar(parts[2])
        assert.throws(() => decodeToken(parts.join(':')), /Invalid token/)
    })

    test('rejects a payload with no key', () => {
        const { generateHMAC, decodeToken } = loadHmac()
        const token = generateHMAC(JSON.stringify({ expires: 4102444800000 }))
        assert.throws(() => decodeToken(token), /Invalid token/)
    })

    test('rejects a payload with no expires', () => {
        const { generateHMAC, decodeToken } = loadHmac()
        const token = generateHMAC(JSON.stringify({ key: 1 }))
        assert.throws(() => decodeToken(token), /Invalid token/)
    })

    test('rejects a non-numeric expiry', () => {
        const { generateHMAC, decodeToken } = loadHmac()
        const token = generateHMAC(JSON.stringify({ key: 1, expires: 'soon' }))
        assert.throws(() => decodeToken(token), /Invalid token/)
    })

    test('rejects a valid-auth payload that is not JSON', () => {
        const { generateHMAC, decodeToken } = loadHmac()
        const token = generateHMAC('not json')
        assert.throws(() => decodeToken(token), /Invalid token/)
    })
})

describe('key derivation', () => {
    const missing = [
        {
            name: 'security.hmacKey is absent',
            mutate: c => delete c.security.hmacKey,
        },
        {
            name: 'security.hmacKey is empty',
            mutate: c => (c.security.hmacKey = ''),
        },
        {
            name: 'the security section is absent',
            mutate: c => delete c.security,
        },
    ]

    for (const { name, mutate } of missing) {
        test(`throws when ${name}`, () => {
            const { generateHMAC } = loadHmac(mutate)
            assert.throws(
                () => generateHMAC('hello'),
                /Missing HMAC_KEY in config/
            )
        })
    }
})

function flipHexChar(hex) {
    const index = Math.floor(hex.length / 2)
    const flipped = hex[index] === 'a' ? 'b' : 'a'
    return hex.slice(0, index) + flipped + hex.slice(index + 1)
}
