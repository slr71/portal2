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

/** assert.throws helper for the plain strings hmac.js throws. */
const throwsValue = expected => err => err === expected

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

    test('produces hex output', () => {
        const { generateHMAC } = loadHmac()
        assert.match(generateHMAC('hello'), /^[0-9a-f]+$/)
    })

    test('is deterministic for the same plaintext', () => {
        // The IV is derived from the key, so identical plaintext encrypts to
        // identical ciphertext. See the FIXME in src/api/lib/hmac.js.
        const { generateHMAC } = loadHmac()
        assert.equal(generateHMAC('hello'), generateHMAC('hello'))
    })

    test('produces different ciphertext under a different key', () => {
        const a = loadHmac(c => (c.security.hmacKey = 'key-one'))
        const first = a.generateHMAC('hello')
        const b = loadHmac(c => (c.security.hmacKey = 'key-two'))
        assert.notEqual(b.generateHMAC('hello'), first)
    })

    test('cannot decode a value encrypted under a different key', () => {
        const a = loadHmac(c => (c.security.hmacKey = 'key-one'))
        const encrypted = a.generateHMAC('hello')
        const b = loadHmac(c => (c.security.hmacKey = 'key-two'))
        assert.throws(() => b.decodeHMAC(encrypted))
    })

    const badInputs = [
        { name: 'tampered ciphertext', mangle: h => flipHexChar(h) },
        { name: 'truncated ciphertext', mangle: h => h.slice(0, h.length - 8) },
        { name: 'non-hex input', mangle: () => 'zzzz' },
        { name: 'an empty string', mangle: () => '' },
    ]

    for (const { name, mangle } of badInputs) {
        test(`throws on ${name}`, () => {
            const { generateHMAC, decodeHMAC } = loadHmac()
            const encrypted = generateHMAC(JSON.stringify({ key: 1 }))
            assert.throws(() => decodeHMAC(mangle(encrypted)))
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
        assert.throws(() => decodeToken(token), throwsValue('Expired HMAC'))
    })

    test('rejects a payload that is not an object', () => {
        const { generateHMAC, decodeToken } = loadHmac()
        const token = generateHMAC(JSON.stringify(42))
        assert.throws(() => decodeToken(token), throwsValue('Invalid HMAC (1)'))
    })

    const incomplete = [
        { name: 'no key', payload: { expires: 4102444800000 } },
        { name: 'no expires', payload: { key: 1 } },
        { name: 'neither field', payload: { other: true } },
    ]

    for (const { name, payload } of incomplete) {
        test(`rejects a payload with ${name}`, () => {
            const { generateHMAC, decodeToken } = loadHmac()
            const token = generateHMAC(JSON.stringify(payload))
            assert.throws(
                () => decodeToken(token),
                throwsValue('Invalid HMAC (2)')
            )
        })
    }

    test('rejects a non-numeric expiry', () => {
        const { generateHMAC, decodeToken } = loadHmac()
        const token = generateHMAC(JSON.stringify({ key: 1, expires: 'soon' }))
        assert.throws(() => decodeToken(token), throwsValue('Invalid HMAC (3)'))
    })

    test('rejects malformed JSON inside a valid ciphertext', () => {
        const { generateHMAC, decodeToken } = loadHmac()
        const token = generateHMAC('not json')
        assert.throws(() => decodeToken(token), SyntaxError)
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
                throwsValue('Missing HMAC_KEY in config')
            )
        })
    }
})

function flipHexChar(hex) {
    const index = Math.floor(hex.length / 2)
    const flipped = hex[index] === 'a' ? 'b' : 'a'
    return hex.slice(0, index) + flipped + hex.slice(index + 1)
}
