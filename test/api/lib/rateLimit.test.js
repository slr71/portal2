const { describe, test } = require('node:test')
const assert = require('node:assert/strict')

const {
    createRateLimiter,
    createFixedWindowCounter,
} = require('../../../src/api/lib/rateLimit')

function makeRes() {
    return {
        code: undefined,
        headers: {},
        setHeader(k, v) {
            this.headers[k] = v
        },
        status(c) {
            this.code = c
            return this
        },
        send() {
            this.ended = true
            return this
        },
    }
}

function run(limiter, ip) {
    const res = makeRes()
    let nexted = false
    limiter({ ip }, res, () => (nexted = true))
    return { res, nexted }
}

describe('createRateLimiter', () => {
    test('allows requests up to the max, then 429s', () => {
        const limiter = createRateLimiter({
            windowMs: 1000,
            max: 3,
            now: () => 0,
        })
        for (let i = 0; i < 3; i++) assert.equal(run(limiter, 'a').nexted, true)
        const over = run(limiter, 'a')
        assert.equal(over.nexted, false)
        assert.equal(over.res.code, 429)
        assert.ok(over.res.headers['Retry-After'] >= 1)
    })

    test('resets after the window elapses', () => {
        let t = 0
        const limiter = createRateLimiter({
            windowMs: 1000,
            max: 1,
            now: () => t,
        })
        assert.equal(run(limiter, 'a').nexted, true)
        assert.equal(run(limiter, 'a').res.code, 429)
        t = 1000 // window elapsed
        assert.equal(run(limiter, 'a').nexted, true) // budget refreshed
    })

    test('budgets are per-key (per IP)', () => {
        const limiter = createRateLimiter({
            windowMs: 1000,
            max: 1,
            now: () => 0,
        })
        assert.equal(run(limiter, 'a').nexted, true)
        assert.equal(run(limiter, 'a').res.code, 429) // a exhausted
        assert.equal(run(limiter, 'b').nexted, true) // b independent
    })

    test('falls back to a key when ip is absent', () => {
        const limiter = createRateLimiter({
            windowMs: 1000,
            max: 1,
            now: () => 0,
        })
        const res = makeRes()
        let nexted = false
        limiter({}, res, () => (nexted = true))
        assert.equal(nexted, true)
    })

    test('cleanup removes expired entries to bound memory', () => {
        let t = 0
        const limiter = createRateLimiter({
            windowMs: 1000,
            max: 5,
            now: () => t,
        })
        run(limiter, 'a')
        run(limiter, 'b')
        assert.equal(limiter.size(), 2)
        t = 2000 // both windows expired
        limiter.cleanup()
        assert.equal(limiter.size(), 0)
    })
})

describe('createFixedWindowCounter', () => {
    test('allows up to max, then reports not allowed', () => {
        const c = createFixedWindowCounter({
            windowMs: 1000,
            max: 3,
            now: () => 0,
        })
        for (let i = 1; i <= 3; i++) {
            const r = c.check('k')
            assert.equal(r.allowed, true)
            assert.equal(r.count, i)
        }
        const over = c.check('k')
        assert.equal(over.allowed, false)
        assert.equal(over.count, 4)
    })

    test('refreshes the budget after the window elapses', () => {
        let t = 0
        const c = createFixedWindowCounter({
            windowMs: 1000,
            max: 1,
            now: () => t,
        })
        assert.equal(c.check('k').allowed, true)
        assert.equal(c.check('k').allowed, false)
        t = 1000
        assert.equal(c.check('k').allowed, true) // new window
    })

    test('counts are independent per key', () => {
        const c = createFixedWindowCounter({
            windowMs: 1000,
            max: 1,
            now: () => 0,
        })
        assert.equal(c.check('a').allowed, true)
        assert.equal(c.check('a').allowed, false)
        assert.equal(c.check('b').allowed, true) // b independent of a
    })

    test('cleanup drops expired keys', () => {
        let t = 0
        const c = createFixedWindowCounter({
            windowMs: 1000,
            max: 5,
            now: () => t,
        })
        c.check('a')
        c.check('b')
        assert.equal(c.size(), 2)
        t = 2000
        c.cleanup()
        assert.equal(c.size(), 0)
    })
})
