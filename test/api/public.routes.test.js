const { describe, test } = require('node:test')
const assert = require('node:assert/strict')

const { loadRoute, invokeRoute } = require('../helpers/routes')

const R = spec => require.resolve('../../src/api/' + spec)
const noop = () => {}
const silentLogger = { debug: noop, info: noop, warn: noop, error: noop }

function loadPublicRouter(existingUser) {
    return loadRoute(R('public.js'), {
        [R('lib/logging.js')]: { logger: silentLogger },
        [R('lib/email.js')]: {
            emailNewAccountConfirmation: noop,
            emailNewEmailConfirmation: noop,
            emailPasswordReset: noop,
        },
        [R('lib/hmac.js')]: {
            decodeHMAC: noop,
            generateHMAC: noop,
            generateToken: noop,
            decodeToken: noop,
        },
        [R('lib/password.js')]: { encodePassword: noop },
        [R('approvers/service.js')]: {
            approveRequest: noop,
            grantRequest: noop,
        },
        [R('workflows/native/user.js')]: {
            userCreationWorkflow: noop,
            userPasswordUpdateWorkflow: noop,
        },
        [R('models/index.js')]: {
            account_user: { findOne: async () => existingUser },
            account_restrictedusername: { findOne: async () => null },
        },
    })
}

const putUsers = (router, body) =>
    invokeRoute(router, 'PUT', '/users', { body, query: {}, params: {} })

describe('C3: signup rejects invalid usernames', () => {
    const bad = ['../../ldap/users/admin', 'a/b', 'bob smith', '..', '.bob']
    for (const username of bad) {
        test(`rejects ${JSON.stringify(
            username
        )} with 400 Invalid username`, async () => {
            const router = loadPublicRouter(null)
            const res = await putUsers(router, { username })
            assert.equal(res.code, 400)
            assert.equal(res.body, 'Invalid username')
        })
    }

    test('a valid username passes the format check (stops later, not "Invalid username")', async () => {
        // User.findOne returns an existing user, so a valid username reaches the
        // duplicate check -> proves it passed isValidUsername.
        const router = loadPublicRouter({ id: 1, username: 'bob' })
        const res = await putUsers(router, { username: 'bob' })
        assert.equal(res.code, 400)
        assert.equal(res.body, 'Username already taken')
    })

    test('a missing username is still the generic missing-field error', async () => {
        const router = loadPublicRouter(null)
        const res = await putUsers(router, {})
        assert.equal(res.code, 400)
        assert.equal(res.body, 'Missing required field')
    })
})
