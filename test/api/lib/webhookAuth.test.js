const { describe, test } = require('node:test')
const assert = require('node:assert/strict')

const {
    safeEqual,
    verifyWebhookKey,
} = require('../../../src/api/lib/webhookAuth')

describe('safeEqual', () => {
    test('true for equal strings', () => {
        assert.equal(safeEqual('secret', 'secret'), true)
    })
    test('false for different strings of equal length', () => {
        assert.equal(safeEqual('secret', 'sxcret'), false)
    })
    test('false (no throw) for different lengths', () => {
        assert.equal(safeEqual('short', 'longersecret'), false)
    })
})

describe('verifyWebhookKey (fails closed)', () => {
    const cases = [
        {
            name: 'both present and matching',
            cfg: 'K',
            got: 'K',
            expected: true,
        },
        { name: 'mismatch', cfg: 'K', got: 'X', expected: false },
        {
            name: 'no configured key',
            cfg: undefined,
            got: 'K',
            expected: false,
        },
        { name: 'empty configured key', cfg: '', got: 'K', expected: false },
        { name: 'no provided key', cfg: 'K', got: undefined, expected: false },
        { name: 'empty provided key', cfg: 'K', got: '', expected: false },
        { name: 'neither', cfg: undefined, got: undefined, expected: false },
    ]
    for (const { name, cfg, got, expected } of cases) {
        test(`${name} -> ${expected}`, () => {
            assert.equal(verifyWebhookKey(cfg, got), expected)
        })
    }
})
