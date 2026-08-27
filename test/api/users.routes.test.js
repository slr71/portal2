const { describe, test, beforeEach } = require('node:test')
const assert = require('node:assert/strict')

const { loadRoute, invokeRoute } = require('../helpers/routes')

const R = spec => require.resolve('../../src/api/' + spec)

const noop = () => {}
const silentLogger = { debug: noop, info: noop, warn: noop, error: noop }

// Controlled by each test.
let targetUser = null

function loadUsersRouter() {
    return loadRoute(R('users.js'), {
        [R('lib/logging.js')]: { logger: silentLogger },
        [R('models/index.js')]: {
            account_user: {
                findByPk: async () => targetUser,
                unscoped: () => ({ findByPk: async () => targetUser }),
            },
            account_emailaddress: {
                findOne: async () => ({ id: 9, email: 'm@example.test' }),
            },
            account_passwordresetrequest: { create: () => ({ id: 1 }) },
        },
        [R('lib/hmac.js')]: { generateToken: () => 'RESET-TOKEN' },
        [R('lib/email.js')]: { emailPasswordReset: async () => {} },
        [R('lib/password.js')]: { encodePassword: s => 'enc:' + s },
        [R('workflows/native/lib.js')]: { ldapModify: async () => {} },
        [R('workflows/native/user.js')]: {
            userPasswordUpdateWorkflow: async () => {},
            userDeletionWorkflow: async () => {},
            userCreationWorkflow: async () => {},
        },
        [R('workflows/native/services/utils.js')]: {
            validateLdapPassword: async () => true,
            getUserLdapInfo: async () => ({}),
            makeRequest: async () => ({}),
        },
    })
}

const STAFF = { id: 1, username: 'staff', is_staff: true, is_superuser: false }
const SUPERUSER = {
    id: 5,
    username: 'root',
    is_staff: true,
    is_superuser: true,
}
const MEMBER = { id: 7, username: 'bob', is_staff: false, is_superuser: false }

const reqAs = (user, params, body) => ({
    user,
    params,
    body: body || {},
    query: {},
})

beforeEach(() => {
    targetUser = null
})

describe('C2: staff cannot reset a superuser', () => {
    test('reset_password denies staff -> superuser with 403', async () => {
        targetUser = SUPERUSER
        const router = loadUsersRouter()
        const res = await invokeRoute(
            router,
            'POST',
            '/:id(\\d+)/reset_password',
            reqAs(STAFF, { id: '5' })
        )
        assert.equal(res.code, 403)
        assert.equal(res.body, 'Permission denied')
    })

    test('admin_password_reset denies staff -> superuser with 403', async () => {
        targetUser = SUPERUSER
        const router = loadUsersRouter()
        const res = await invokeRoute(
            router,
            'POST',
            '/:id(\\d+)/admin_password_reset',
            reqAs(STAFF, { id: '5' }, { password: 'newpass' })
        )
        assert.equal(res.code, 403)
        assert.equal(res.body, 'Permission denied')
    })

    test('reset_password still allows staff -> member (returns a token)', async () => {
        targetUser = MEMBER
        const router = loadUsersRouter()
        const res = await invokeRoute(
            router,
            'POST',
            '/:id(\\d+)/reset_password',
            reqAs(STAFF, { id: '7' })
        )
        assert.equal(res.code, 200)
        assert.equal(res.body, 'RESET-TOKEN')
    })

    test('reset_password returns 404 for an unknown target', async () => {
        targetUser = null
        const router = loadUsersRouter()
        const res = await invokeRoute(
            router,
            'POST',
            '/:id(\\d+)/reset_password',
            reqAs(STAFF, { id: '999' })
        )
        assert.equal(res.code, 404)
    })
})

describe('M6: permission enum validation', () => {
    // A mutable member with save/reload spies, so a test can see whether the
    // handler wrote the flags or rejected before touching the record.
    function member() {
        const u = {
            id: 7,
            username: 'bob',
            is_staff: false,
            is_superuser: false,
            saved: false,
        }
        u.save = async () => {
            u.saved = true
        }
        u.reload = async () => {}
        return u
    }

    const permit = (body, actor) =>
        invokeRoute(
            loadUsersRouter(),
            'POST',
            '/:id(\\d+)/permission',
            reqAs(actor || SUPERUSER, { id: '7' }, body)
        )

    const invalid = [
        { name: 'missing permission', body: {} },
        { name: 'empty string', body: { permission: '' } },
        { name: 'unknown value', body: { permission: 'admin' } },
        { name: 'misspelled staff', body: { permission: 'staf' } },
        { name: 'null', body: { permission: null } },
        { name: 'non-string', body: { permission: 1 } },
    ]
    for (const { name, body } of invalid) {
        test(`rejects ${name} with 400 and does not mutate`, async () => {
            targetUser = member()
            const res = await permit(body)
            assert.equal(res.code, 400)
            assert.equal(res.body, 'Invalid permission')
            // No lookup/save should have run: an invalid value must not demote.
            assert.equal(targetUser.saved, false)
            assert.equal(targetUser.is_staff, false)
            assert.equal(targetUser.is_superuser, false)
        })
    }

    test("'regular' clears both flags", async () => {
        targetUser = member()
        targetUser.is_staff = true
        const res = await permit({ permission: 'regular' })
        assert.equal(res.code, 200)
        assert.equal(targetUser.is_staff, false)
        assert.equal(targetUser.is_superuser, false)
        assert.equal(targetUser.saved, true)
    })

    test("'staff' sets only is_staff", async () => {
        targetUser = member()
        const res = await permit({ permission: 'staff' })
        assert.equal(res.code, 200)
        assert.equal(targetUser.is_staff, true)
        assert.equal(targetUser.is_superuser, false)
    })

    test("'superuser' sets is_superuser (granted by a superuser)", async () => {
        targetUser = member()
        const res = await permit({ permission: 'superuser' }, SUPERUSER)
        assert.equal(res.code, 200)
        assert.equal(targetUser.is_superuser, true)
    })
})
