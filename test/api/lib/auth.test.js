const { describe, test, beforeEach } = require('node:test')
const assert = require('node:assert/strict')

const { stubModels, makeRes, makeReq } = require('../../helpers/models')
const { stubLogging } = require('../../helpers/logging')

let findOne = async () => null
let findOneCalls = []

// Must be stubbed before lib/auth is required: the real models module builds a
// Sequelize instance at import time.
stubModels({
    account_user: {
        findOne: async options => {
            findOneCalls.push(options)
            return findOne(options)
        },
    },
})

const { calls: logCalls } = stubLogging()

const {
    getUserToken,
    getUserID,
    getUser,
    isAdmin,
    requireAdmin,
    requireAuth,
    asyncHandler,
} = require('../../../src/api/lib/auth')

/** A Sequelize instance double: getUser calls user.get({ plain: true }). */
const fakeUser = attributes => ({ get: () => ({ ...attributes }) })

const STAFF = { id: 1, username: 'admin', is_staff: true }
const MEMBER = { id: 2, username: 'member', is_staff: false }

beforeEach(() => {
    findOne = async () => null
    findOneCalls = []
    for (const level of Object.keys(logCalls)) logCalls[level].length = 0
})

describe('getUserToken', () => {
    const cases = [
        { name: 'no request', req: undefined, expected: null },
        { name: 'an empty request', req: {}, expected: null },
        { name: 'a request with no grant', req: { kauth: {} }, expected: null },
        {
            name: 'a grant with no access token',
            req: { kauth: { grant: {} } },
            expected: null,
        },
    ]

    for (const { name, req, expected } of cases) {
        test(`returns null for ${name}`, () => {
            assert.equal(getUserToken(req), expected)
        })
    }

    test('returns the access token when present', () => {
        const req = makeReq('bob')
        assert.equal(getUserToken(req), req.kauth.grant.access_token)
    })
})

describe('getUserID', () => {
    test('returns the preferred username', () => {
        assert.equal(getUserID(makeReq('bob')), 'bob')
    })

    test('returns null without a token', () => {
        assert.equal(getUserID({}), null)
    })

    test('returns null when the token has no content', () => {
        assert.equal(
            getUserID({ kauth: { grant: { access_token: {} } } }),
            null
        )
    })
})

describe('getUser', () => {
    test('attaches a plain object and calls next', async () => {
        findOne = async () => fakeUser(STAFF)
        const req = makeReq('admin')
        let nexted = false

        await getUser(req, null, () => (nexted = true))

        assert.deepEqual(req.user, STAFF)
        assert.equal(Object.getPrototypeOf(req.user), Object.prototype)
        assert.equal(nexted, true)
    })

    test('looks the user up by username', async () => {
        findOne = async () => fakeUser(STAFF)
        await getUser(makeReq('admin'), null, () => {})

        assert.equal(findOneCalls.length, 1)
        assert.deepEqual(findOneCalls[0], { where: { username: 'admin' } })
    })

    test('calls next without a user when there is no token', async () => {
        const req = {}
        let nexted = false

        await getUser(req, null, () => (nexted = true))

        assert.equal(req.user, undefined)
        assert.equal(nexted, true)
        assert.equal(findOneCalls.length, 0)
    })

    test('calls next without a user when the token has no matching user', async () => {
        findOne = async () => null
        const req = makeReq('ghost')
        let nexted = false

        await getUser(req, null, () => (nexted = true))

        assert.equal(nexted, true)
        assert.equal(req.user, undefined)
    })

    test('warns with a probable cause when the token has no matching user', async () => {
        findOne = async () => null

        await getUser(makeReq('ghost'), null, () => {})

        assert.equal(logCalls.warn.length, 1)
        const message = logCalls.warn[0][0]
        assert.match(message, /ghost/)
        assert.match(message, /Keycloak/)
    })

    test('does not warn when the user is found', async () => {
        findOne = async () => fakeUser(STAFF)

        await getUser(makeReq('admin'), null, () => {})

        assert.equal(logCalls.warn.length, 0)
    })

    test('tolerates a missing next callback', async () => {
        findOne = async () => fakeUser(STAFF)
        const req = makeReq('admin')

        await assert.doesNotReject(() => getUser(req))
        assert.deepEqual(req.user, STAFF)
    })
})

describe('isAdmin', () => {
    const cases = [
        { name: 'a staff user', req: { user: STAFF }, expected: true },
        { name: 'a non-staff user', req: { user: MEMBER }, expected: false },
        { name: 'no user', req: {}, expected: false },
        { name: 'no request', req: undefined, expected: false },
    ]

    for (const { name, req, expected } of cases) {
        test(`returns ${expected} for ${name}`, () => {
            assert.equal(!!isAdmin(req), expected)
        })
    }
})

describe('requireAdmin', () => {
    test('calls next for a staff user already on the request', async () => {
        const req = { user: STAFF }
        const res = makeRes()
        let nexted = false

        await requireAdmin(req, res, () => (nexted = true))

        assert.equal(nexted, true)
        assert.equal(res.code, undefined)
        assert.equal(findOneCalls.length, 0)
    })

    test('loads the user when the request has none', async () => {
        findOne = async () => fakeUser(STAFF)
        const req = makeReq('admin')
        const res = makeRes()
        let nexted = false

        await requireAdmin(req, res, () => (nexted = true))

        assert.equal(nexted, true)
        assert.equal(findOneCalls.length, 1)
    })

    const denied = [
        { name: 'a non-staff user', req: () => ({ user: MEMBER }) },
        { name: 'an anonymous request', req: () => ({}) },
    ]

    for (const { name, req } of denied) {
        test(`rejects ${name} with 403`, async () => {
            const res = makeRes()
            let nexted = false

            await requireAdmin(req(), res, () => (nexted = true))

            assert.equal(res.code, 403)
            assert.equal(res.body, 'User not authorized')
            assert.equal(nexted, false)
        })
    }
})

describe('requireAuth', () => {
    test('calls next for an authenticated request', async () => {
        const res = makeRes()
        let nexted = false

        await requireAuth(makeReq('bob'), res, () => (nexted = true))

        assert.equal(nexted, true)
        assert.equal(res.code, undefined)
    })

    test('rejects an anonymous request with 401', async () => {
        const res = makeRes()
        let nexted = false

        await requireAuth({}, res, () => (nexted = true))

        assert.equal(res.code, 401)
        assert.equal(res.body, 'Unauthorized')
        assert.equal(nexted, false)
    })
})

describe('asyncHandler', () => {
    test('does not call next when the handler resolves', async () => {
        let nextArg = 'untouched'
        const handler = asyncHandler(async (req, res) => res.status(200))
        const res = makeRes()

        await handler({}, res, err => (nextArg = err))

        assert.equal(nextArg, 'untouched')
        assert.equal(res.code, 200)
    })

    test('forwards a rejection to next', async () => {
        const boom = new Error('boom')
        const handler = asyncHandler(async () => {
            throw boom
        })
        let nextArg

        await handler({}, makeRes(), err => (nextArg = err))

        assert.equal(nextArg, boom)
    })

    test('passes req, res, and next through to the handler', async () => {
        const req = { marker: 'req' }
        const res = makeRes()
        const next = () => {}
        let seen

        await asyncHandler((...args) => (seen = args))(req, res, next)

        assert.deepEqual(seen, [req, res, next])
    })

    test('lets a synchronous throw escape instead of reaching next', () => {
        // Promise.resolve(fn(...)) evaluates fn eagerly, so a handler that
        // throws before returning a promise bypasses the catch entirely.
        const handler = asyncHandler(() => {
            throw new Error('sync boom')
        })

        assert.throws(() => handler({}, makeRes(), () => {}), /sync boom/)
    })
})
