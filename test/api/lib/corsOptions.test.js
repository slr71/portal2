const { describe, test } = require('node:test')
const assert = require('node:assert/strict')

const {
    toOrigin,
    buildAllowedOrigins,
    corsOptionsFromConfig,
} = require('../../../src/api/lib/corsOptions')

describe('toOrigin', () => {
    const cases = [
        { in: 'https://user.cyverse.org', out: 'https://user.cyverse.org' },
        {
            in: 'https://user.cyverse.org/path?q=1',
            out: 'https://user.cyverse.org',
        },
        { in: 'http://localhost:3000', out: 'http://localhost:3000' },
        { in: 'not a url', out: null },
        { in: '', out: null },
        { in: undefined, out: null },
    ]
    for (const c of cases) {
        test(`${JSON.stringify(c.in)} -> ${JSON.stringify(c.out)}`, () => {
            assert.equal(toOrigin(c.in), c.out)
        })
    }
})

describe('buildAllowedOrigins', () => {
    test('includes the UI origin', () => {
        const set = buildAllowedOrigins({
            uiBaseUrl: 'https://user.cyverse.org/app',
        })
        assert.ok(set.has('https://user.cyverse.org'))
    })

    test('includes configured extras and dedups with the UI origin', () => {
        const set = buildAllowedOrigins({
            uiBaseUrl: 'https://user.cyverse.org',
            allowedOrigins: [
                'https://cyverse.org',
                'https://user.cyverse.org', // duplicate of the UI origin
            ],
        })
        assert.deepEqual(
            [...set].sort(),
            ['https://cyverse.org', 'https://user.cyverse.org'].sort()
        )
    })

    test('skips unparseable origins', () => {
        const set = buildAllowedOrigins({
            uiBaseUrl: 'https://user.cyverse.org',
            allowedOrigins: ['', 'garbage', null],
        })
        assert.equal(set.size, 1)
    })

    test('empty when nothing is configured', () => {
        assert.equal(buildAllowedOrigins().size, 0)
        assert.equal(buildAllowedOrigins({}).size, 0)
    })
})

describe('corsOptionsFromConfig', () => {
    const opts = corsOptionsFromConfig({
        uiBaseUrl: 'https://user.cyverse.org',
        allowedOrigins: ['https://cyverse.org'],
    })

    const decide = origin =>
        new Promise(resolve =>
            opts.origin(origin, (err, allow) => resolve({ err, allow }))
        )

    test('never reflects credentials', () => {
        assert.equal(opts.credentials, false)
    })

    test('allows a request with no Origin (same-origin, <img>, curl)', async () => {
        assert.deepEqual(await decide(undefined), { err: null, allow: true })
    })

    test('allows the UI origin', async () => {
        assert.deepEqual(await decide('https://user.cyverse.org'), {
            err: null,
            allow: true,
        })
    })

    test('allows a configured extra origin', async () => {
        assert.deepEqual(await decide('https://cyverse.org'), {
            err: null,
            allow: true,
        })
    })

    test('denies (no CORS headers, no error) an unknown origin', async () => {
        assert.deepEqual(await decide('https://evil.example'), {
            err: null,
            allow: false,
        })
    })
})
