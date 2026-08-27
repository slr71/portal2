const { describe, test } = require('node:test')
const assert = require('node:assert/strict')

const { stubLogging } = require('../../../../helpers/logging')
const { startServer } = require('../../../../helpers/httpServer')
const {
    baseConfig,
    writeConfig,
    loadModule,
} = require('../../../../helpers/config')

// The real logging module pulls in lib/auth and the Sequelize models.
stubLogging()

const UTILS_MODULE = require.resolve(
    '../../../../../src/api/workflows/native/services/utils'
)

/** Loads utils.js bound to a config built from the base fixture. */
function loadUtils(mutate) {
    const config = baseConfig()
    if (mutate) mutate(config)
    return loadModule(UTILS_MODULE, writeConfig(config))
}

/** Starts a local conductor stand-in and loads utils pointed at it. */
async function withConductor(t, responses, mutate) {
    const server = await startServer(responses)
    t.after(() => server.close())

    const utils = loadUtils(config => {
        config.portalConductor.url = server.url
        if (mutate) mutate(config)
    })

    return { server, utils }
}

describe('isRetryableError', () => {
    const { isRetryableError } = loadUtils()

    test('retries a network error with no response', () => {
        assert.equal(isRetryableError(new Error('ECONNREFUSED')), true)
    })

    const statuses = [
        { status: 408, expected: true },
        { status: 429, expected: true },
        { status: 500, expected: true },
        { status: 502, expected: true },
        { status: 503, expected: true },
        { status: 504, expected: true },
        { status: 400, expected: false },
        { status: 401, expected: false },
        { status: 403, expected: false },
        { status: 404, expected: false },
        { status: 409, expected: false },
        { status: 422, expected: false },
    ]

    for (const { status, expected } of statuses) {
        test(`returns ${expected} for ${status}`, () => {
            assert.equal(isRetryableError({ response: { status } }), expected)
        })
    }
})

describe('getBackoffDelay', () => {
    const { getBackoffDelay } = loadUtils()

    const attempts = [0, 1, 2, 3, 4]

    for (const attempt of attempts) {
        test(`stays within jitter bounds for attempt ${attempt}`, () => {
            const expected = 1000 * Math.pow(2, attempt)
            for (let i = 0; i < 50; i++) {
                const delay = getBackoffDelay(attempt)
                assert.ok(
                    delay >= expected * 0.75 && delay <= expected * 1.25,
                    `attempt ${attempt} produced ${delay}, expected ~${expected}`
                )
            }
        })
    }

    test('caps the base delay at 30 seconds', () => {
        for (let i = 0; i < 50; i++) {
            assert.ok(getBackoffDelay(20) <= 30000 * 1.25)
        }
    })

    test('returns an integer', () => {
        assert.equal(Number.isInteger(getBackoffDelay(2)), true)
    })
})

describe('configuration accessors', () => {
    test('getPortalConductorUrl returns the configured URL', () => {
        const { getPortalConductorUrl } = loadUtils()
        assert.equal(getPortalConductorUrl(), baseConfig().portalConductor.url)
    })

    test('getPortalConductorUrl names the missing key when unset', () => {
        const { getPortalConductorUrl } = loadUtils(
            c => delete c.portalConductor.url
        )
        assert.throws(getPortalConductorUrl, /portalConductor\.url/)
    })

    test('getRetryCount returns the configured value', () => {
        const { getRetryCount } = loadUtils(
            c => (c.portalConductor.retries = 3)
        )
        assert.equal(getRetryCount(), 3)
    })

    test('getRetryCount defaults to 5', () => {
        const { getRetryCount } = loadUtils(
            c => delete c.portalConductor.retries
        )
        assert.equal(getRetryCount(), 5)
    })

    test('getRetryCount preserves an explicit zero', () => {
        const { getRetryCount } = loadUtils(
            c => (c.portalConductor.retries = 0)
        )
        assert.equal(getRetryCount(), 0)
    })

    test('getPortalConductorAuth returns the configured credentials', () => {
        const { getPortalConductorAuth } = loadUtils()
        assert.deepEqual(
            getPortalConductorAuth(),
            baseConfig().portalConductor.auth
        )
    })

    test('getPortalConductorAuth returns null when unset', () => {
        // Only reachable with no conductor URL: config.js requires
        // portalConductor.auth.password whenever a URL is configured.
        const { getPortalConductorAuth } = loadUtils(c => {
            delete c.portalConductor.url
            delete c.portalConductor.auth
        })
        assert.equal(getPortalConductorAuth(), null)
    })

    const sslCases = [
        {
            name: 'defaults to true when the ssl section is absent',
            mutate: c => delete c.portalConductor.ssl,
            expected: true,
        },
        {
            name: 'defaults to true when rejectUnauthorized is absent',
            mutate: c => (c.portalConductor.ssl = {}),
            expected: true,
        },
        {
            name: 'preserves an explicit true',
            mutate: c => (c.portalConductor.ssl.rejectUnauthorized = true),
            expected: true,
        },
        {
            name: 'preserves an explicit false',
            mutate: c => (c.portalConductor.ssl.rejectUnauthorized = false),
            expected: false,
        },
    ]

    for (const { name, mutate, expected } of sslCases) {
        test(`getPortalConductorSslConfig ${name}`, () => {
            const { getPortalConductorSslConfig } = loadUtils(mutate)
            assert.equal(
                getPortalConductorSslConfig().rejectUnauthorized,
                expected
            )
        })
    }

    test('getPortalConductorSslConfig passes other ssl options through', () => {
        const { getPortalConductorSslConfig } = loadUtils(
            c => (c.portalConductor.ssl.ca = 'test-ca')
        )
        assert.equal(getPortalConductorSslConfig().ca, 'test-ca')
    })

    test('getPortalConductorHttpsAgent verifies by default', () => {
        const { getPortalConductorHttpsAgent } = loadUtils(
            c => delete c.portalConductor.ssl
        )
        assert.equal(
            getPortalConductorHttpsAgent().options.rejectUnauthorized,
            true
        )
    })

    test('getPortalConductorHttpsAgent honors an explicit opt-out', () => {
        const { getPortalConductorHttpsAgent } = loadUtils(
            c => (c.portalConductor.ssl = { rejectUnauthorized: false })
        )
        assert.equal(
            getPortalConductorHttpsAgent().options.rejectUnauthorized,
            false
        )
    })

    test('getPortalConductorHttpsAgent passes a custom CA to the agent', () => {
        const { getPortalConductorHttpsAgent } = loadUtils(
            c => (c.portalConductor.ssl = { ca: 'test-ca-pem' })
        )
        const agent = getPortalConductorHttpsAgent()
        assert.equal(agent.options.ca, 'test-ca-pem')
        assert.equal(agent.options.rejectUnauthorized, true)
    })
})

describe('validateRegistrationRequest', () => {
    const { validateRegistrationRequest } = loadUtils()

    const service = { approval_key: 'VICE' }
    const user = { username: 'bob', email: 'bob@example.test' }

    const invalid = [
        { name: 'no user', user: null, service, message: /User information/ },
        {
            name: 'a user with no username',
            user: { email: 'bob@example.test' },
            service,
            message: /User information/,
        },
        {
            name: 'a user with no email',
            user: { username: 'bob' },
            service,
            message: /User information/,
        },
        {
            name: 'no service',
            user,
            service: null,
            message: /Service information/,
        },
        {
            name: 'a service with no approval_key',
            user,
            service: {},
            message: /Service information/,
        },
    ]

    for (const { name, user: u, service: s, message } of invalid) {
        test(`throws for ${name}`, () => {
            assert.throws(() => validateRegistrationRequest(u, s), message)
        })
    }

    test('accepts a complete request', () => {
        assert.doesNotThrow(() => validateRegistrationRequest(user, service))
    })
})

describe('makeRequest', () => {
    test('returns the response body', async t => {
        const { server, utils } = await withConductor(t, {
            status: 200,
            body: { ok: true },
        })

        assert.deepEqual(await utils.makeRequest('GET', 'ping'), { ok: true })
        assert.equal(server.requests.length, 1)
        assert.equal(server.requests[0].method, 'GET')
        assert.equal(server.requests[0].url, '/ping')
    })

    test('sends basic auth credentials', async t => {
        const { server, utils } = await withConductor(t, { status: 200 })
        await utils.makeRequest('GET', 'ping')

        const expected =
            'Basic ' +
            Buffer.from('test-conductor-user:test-conductor-password').toString(
                'base64'
            )
        assert.equal(server.requests[0].headers.authorization, expected)
    })

    test('omits basic auth when the username is not configured', async t => {
        const { server, utils } = await withConductor(
            t,
            { status: 200 },
            c => delete c.portalConductor.auth.username
        )
        await utils.makeRequest('GET', 'ping')

        assert.equal(server.requests[0].headers.authorization, undefined)
    })

    test('sends a JSON body', async t => {
        const { server, utils } = await withConductor(t, { status: 200 })
        await utils.makeRequest('POST', 'users/bob/validate', {
            password: 'hunter2',
        })

        assert.equal(server.requests[0].method, 'POST')
        assert.match(
            server.requests[0].headers['content-type'],
            /application\/json/
        )
        assert.deepEqual(server.requests[0].body, { password: 'hunter2' })
    })

    test('merges caller-supplied headers', async t => {
        const { server, utils } = await withConductor(t, { status: 200 })
        await utils.makeRequest('GET', 'ping', null, {
            headers: { 'X-Test': 'yes' },
        })

        assert.equal(server.requests[0].headers['x-test'], 'yes')
    })

    test('does not double the slash on a trailing-slash base URL', async t => {
        const server = await startServer({ status: 200 })
        t.after(() => server.close())

        const utils = loadUtils(c => (c.portalConductor.url = server.url + '/'))
        await utils.makeRequest('GET', 'ldap/users/bob')

        assert.equal(server.requests[0].url, '/ldap/users/bob')
    })

    test('does not retry a non-retryable status', async t => {
        const { server, utils } = await withConductor(
            t,
            { status: 400, body: {} },
            c => (c.portalConductor.retries = 2)
        )

        await assert.rejects(() => utils.makeRequest('GET', 'ping'))
        assert.equal(server.requests.length, 1)
    })

    test('retries a 500 and returns the eventual success', async t => {
        const { server, utils } = await withConductor(
            t,
            [
                { status: 500, body: {} },
                { status: 200, body: { ok: true } },
            ],
            c => (c.portalConductor.retries = 1)
        )

        assert.deepEqual(await utils.makeRequest('GET', 'ping'), { ok: true })
        assert.equal(server.requests.length, 2)
    })

    test('gives up after exhausting its retries', async t => {
        const { server, utils } = await withConductor(
            t,
            { status: 503, body: {} },
            c => (c.portalConductor.retries = 2)
        )

        await assert.rejects(() => utils.makeRequest('GET', 'ping'), {
            message: /Portal-conductor API error/,
        })
        assert.equal(server.requests.length, 3)
    })

    test('surfaces the detail field from an error body', async t => {
        const { utils } = await withConductor(t, {
            status: 500,
            body: { detail: 'conductor exploded' },
        })

        await assert.rejects(() => utils.makeRequest('GET', 'ping'), {
            message: 'Portal-conductor API error: conductor exploded',
        })
    })

    test('falls back to the HTTP status when the body has no detail', async t => {
        const { utils } = await withConductor(t, { status: 502, body: {} })

        await assert.rejects(() => utils.makeRequest('GET', 'ping'), {
            message: /502/,
        })
    })

    test('attaches the HTTP status to the thrown error', async t => {
        const { utils } = await withConductor(t, { status: 503, body: {} })

        await assert.rejects(
            () => utils.makeRequest('GET', 'ping'),
            err => err.status === 503
        )
    })

    test('attaches the original error as the cause', async t => {
        const { utils } = await withConductor(t, { status: 503, body: {} })

        await assert.rejects(
            () => utils.makeRequest('GET', 'ping'),
            err => err.cause && err.cause.response.status === 503
        )
    })

    test('rejects when the conductor is unreachable', async t => {
        const server = await startServer({ status: 200 })
        const url = server.url
        await server.close()

        const utils = loadUtils(c => (c.portalConductor.url = url))
        await assert.rejects(
            () => utils.makeRequest('GET', 'ping'),
            err =>
                /Portal-conductor API error/.test(err.message) &&
                err.status === undefined
        )
    })
})

describe('validateLdapPassword', () => {
    test('returns true only for an exact boolean true', async t => {
        const { utils } = await withConductor(t, {
            status: 200,
            body: { valid: true },
        })
        assert.equal(await utils.validateLdapPassword('bob', 'hunter2'), true)
    })

    test('returns false when valid is false', async t => {
        const { utils } = await withConductor(t, {
            status: 200,
            body: { valid: false },
        })
        assert.equal(await utils.validateLdapPassword('bob', 'hunter2'), false)
    })

    test('returns false for a truthy non-boolean', async t => {
        const { utils } = await withConductor(t, {
            status: 200,
            body: { valid: 'true' },
        })
        assert.equal(await utils.validateLdapPassword('bob', 'hunter2'), false)
    })

    test('posts the password to the validate endpoint', async t => {
        const { server, utils } = await withConductor(t, {
            status: 200,
            body: { valid: true },
        })
        await utils.validateLdapPassword('bob', 'hunter2')

        assert.equal(server.requests[0].method, 'POST')
        assert.equal(server.requests[0].url, '/users/bob/validate')
        assert.deepEqual(server.requests[0].body, { password: 'hunter2' })
    })

    // Portal-conductor reports rejected credentials as 200 {valid: false} --
    // in both the Go and the earlier Python implementation -- so a non-2xx from
    // this route always means the check itself failed.
    const faults = [
        { name: 'a 400 with no detail', status: 400, body: {} },
        { name: 'a 404 with no detail', status: 404, body: {} },
        {
            name: 'a 400 whose detail mentions credentials',
            status: 400,
            body: { detail: 'Invalid credentials' },
        },
        {
            name: 'a 400 with a descriptive detail',
            status: 400,
            body: { detail: 'password does not match' },
        },
        { name: 'a 401 from the conductor itself', status: 401, body: {} },
        { name: 'a 422 validation error', status: 422, body: {} },
    ]

    for (const { name, status, body } of faults) {
        test(`throws for ${name}`, async t => {
            const { utils } = await withConductor(t, { status, body })
            await assert.rejects(() =>
                utils.validateLdapPassword('bob', 'hunter2')
            )
        })
    }

    test('rethrows a server error rather than reporting a bad password', async t => {
        // A conductor outage must not be indistinguishable from a wrong
        // password.
        const { utils } = await withConductor(t, { status: 500, body: {} })
        await assert.rejects(() => utils.validateLdapPassword('bob', 'hunter2'))
    })
})

describe('conductor path encoding (C3)', () => {
    test('encodes a username so it cannot traverse the conductor path', async t => {
        const { server, utils } = await withConductor(t, {
            status: 200,
            body: {},
        })
        // A username containing slashes/dot-dot must not change the target path.
        await utils.getUserLdapInfo('../../ldap/admin')

        assert.equal(server.requests.length, 1)
        assert.equal(
            server.requests[0].url,
            '/ldap/users/..%2F..%2Fldap%2Fadmin'
        )
        // No segment of the resolved path is a bare traversal token.
        assert.ok(!server.requests[0].url.split('/').includes('..'))
    })

    test('encodes an email in a mailing-list member path', async t => {
        const { server, utils } = await withConductor(t, {
            status: 200,
            body: {},
        })
        await utils.removeFromMailingList('announce', 'a@b.example')

        assert.equal(
            server.requests[0].url,
            '/mailinglists/announce/members/a%40b.example'
        )
    })
})
