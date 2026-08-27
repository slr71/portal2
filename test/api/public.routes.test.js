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

describe('H7: Mailchimp webhook requires the shared key', () => {
    const post = (router, query, body) =>
        invokeRoute(router, 'POST', '/mailchimp/unsubscribe', {
            query,
            body,
            params: {},
        })

    const unsubBody = { type: 'unsubscribe', data: { email: 'u@example.test' } }

    test('rejects a request with no key (401)', async () => {
        const router = loadPublicRouter(null)
        const res = await post(router, {}, unsubBody)
        assert.equal(res.code, 401)
    })

    test('rejects a request with a wrong key (401)', async () => {
        const router = loadPublicRouter(null)
        const res = await post(router, { key: 'wrong' }, unsubBody)
        assert.equal(res.code, 401)
    })

    test('accepts the configured key and processes the unsubscribe', async () => {
        // fixture mailchimp.webhookKey = 'test-webhook-key'
        const saved = []
        const user = {
            subscribe_to_newsletter: true,
            save: async function () {
                saved.push(this.subscribe_to_newsletter)
            },
        }
        const router = loadPublicRouter(user)
        const res = await post(router, { key: 'test-webhook-key' }, unsubBody)
        assert.equal(res.code, 200)
        assert.deepEqual(saved, [false]) // unsubscribed
    })
})

describe('M5: reset_password does not reveal whether an account exists', () => {
    let emailSent
    function loadForReset(matches) {
        emailSent = false
        return loadRoute(R('public.js'), {
            [R('lib/logging.js')]: { logger: silentLogger },
            [R('lib/email.js')]: {
                emailNewAccountConfirmation: noop,
                emailNewEmailConfirmation: noop,
                emailPasswordReset: async () => {
                    emailSent = true
                },
            },
            [R('lib/hmac.js')]: {
                decodeHMAC: () => Date.now() - 10000, // valid, within window
                generateHMAC: noop,
                generateToken: () => 'RESET-TOKEN',
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
                account_emailaddress: { findAll: async () => matches },
                account_passwordresetrequest: { create: async () => ({}) },
            },
        })
    }

    const post = router =>
        invokeRoute(router, 'POST', '/users/reset_password', {
            body: { email: 'user@example.test', hmac: 'plt' },
            query: {},
            params: {},
        })

    test('an unknown email returns 200 success and sends no email', async () => {
        const res = await post(loadForReset([]))
        assert.equal(res.code, 200)
        assert.equal(res.body, 'success')
        assert.equal(emailSent, false)
    })

    test('a known email returns the same 200 success and sends the email', async () => {
        const match = {
            email: 'user@example.test',
            user: { id: 1, username: 'bob' },
        }
        const res = await post(loadForReset([match]))
        assert.equal(res.code, 200)
        assert.equal(res.body, 'success')
        assert.equal(emailSent, true)
    })

    test('the response is byte-identical for known vs unknown (no enumeration)', async () => {
        const unknown = await post(loadForReset([]))
        const known = await post(
            loadForReset([
                { email: 'user@example.test', user: { id: 1, username: 'b' } },
            ])
        )
        assert.equal(unknown.code, known.code)
        assert.equal(unknown.body, known.body)
    })
})
