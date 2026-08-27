const { describe, test } = require('node:test')
const assert = require('node:assert/strict')

const { honeypotFieldId } = require('../../../src/api/lib/honeypot')
const config = require('../../../src/api/lib/config')

// The test fixture sets honeypot.divisor; the encoding must be consistent with
// it so public.js's decode (key % divisor) recovers the modulus.
const DIVISOR = config.getHoneypotConfig().divisor

describe('honeypotFieldId', () => {
    test('fixture divisor is present and numeric', () => {
        assert.equal(typeof DIVISOR, 'number')
        assert.ok(DIVISOR > 1)
    })

    for (const modulus of [0, 1, 2]) {
        test(`encodes modulus ${modulus} so id % divisor === ${modulus}`, () => {
            // Random draw inside the helper -- assert the invariant many times.
            for (let i = 0; i < 200; i++) {
                const id = honeypotFieldId(modulus)
                assert.equal(typeof id, 'string')
                assert.equal(Number(id) % DIVISOR, modulus)
            }
        })
    }

    test('real fields (1,2) never collide with the honeypot slot (0)', () => {
        // A real-field id must never decode to the honeypot modulus.
        for (let i = 0; i < 200; i++) {
            assert.notEqual(Number(honeypotFieldId(1)) % DIVISOR, 0)
            assert.notEqual(Number(honeypotFieldId(2)) % DIVISOR, 0)
        }
    })
})
