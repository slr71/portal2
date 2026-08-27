const { describe, test, beforeEach } = require('node:test')
const assert = require('node:assert/strict')

const { loadRoute, invokeRoute } = require('../helpers/routes')

const R = spec => require.resolve('../../src/api/' + spec)

const noop = () => {}
const silentLogger = { debug: noop, info: noop, warn: noop, error: noop }

// Controlled per test.
let emailAddress = null
let owner = null
let userFindByPkArg = undefined
let ldapCalls = []

function loadMailingListsRouter() {
    return loadRoute(R('mailing_lists.js'), {
        [R('lib/logging.js')]: { logger: silentLogger },
        [R('lib/email.js')]: { emailNewEmailConfirmation: async () => {} },
        [R('lib/hmac.js')]: { generateHMAC: () => 'HMAC' },
        [R('workflows/native/lib.js')]: {
            ldapModify: async (...args) => {
                ldapCalls.push(args)
            },
        },
        [R('models/index.js')]: {
            account_user: {
                findByPk: async id => {
                    userFindByPkArg = id
                    return owner
                },
            },
            account_emailaddress: {
                unscoped: () => ({ findByPk: async () => emailAddress }),
            },
            api_mailinglist: {},
            api_emailaddressmailinglist: {},
        },
    })
}

const STAFF = { id: 1, username: 'staff', is_staff: true }
const SELF = { id: 7, username: 'targetuser', is_staff: false }
const OTHER = { id: 3, username: 'other', is_staff: false }

function makeEmail(id, primary) {
    return {
        id,
        primary,
        save: async function () {
            this.saved = true
        },
    }
}

// An email owned by user 7, plus that owner with two addresses.
function seedOwnedEmail() {
    emailAddress = {
        id: 55,
        user_id: 7,
        email: 'target-new@x.test',
        reload: async function () {
            this.reloaded = true
        },
    }
    owner = {
        id: 7,
        username: 'targetuser',
        email: 'target-old@x.test',
        emails: [makeEmail(55, false), makeEmail(99, true)],
        save: async function () {
            this.saved = true
        },
    }
}

const post = (user, body) =>
    invokeRoute(
        loadMailingListsRouter(),
        'POST',
        '/email_addresses/:id(\\d+)',
        {
            user,
            params: { id: '55' },
            body: body || {},
            query: {},
        }
    )

beforeEach(() => {
    emailAddress = null
    owner = null
    userFindByPkArg = undefined
    ldapCalls = []
})

describe('L10: set-primary mutates the email owner, not the caller', () => {
    test('staff setting another user primary mutates the owner (id 7), not staff', async () => {
        seedOwnedEmail()
        const res = await post(STAFF, { setPrimary: true })

        assert.equal(res.code, 200)
        // The core bug: the handler used to load req.user.id (the staff, 1).
        assert.equal(userFindByPkArg, 7)
        assert.equal(owner.email, 'target-new@x.test')
        assert.equal(owner.saved, true)
        // Only the target email becomes primary.
        assert.equal(owner.emails.find(e => e.id === 55).primary, true)
        assert.equal(owner.emails.find(e => e.id === 99).primary, false)
        // LDAP is updated for the owner's username, not the staff's.
        assert.deepEqual(ldapCalls, [
            ['targetuser', 'mail', 'target-new@x.test'],
        ])
    })

    test('a user setting their own email primary still works', async () => {
        seedOwnedEmail()
        const res = await post(SELF, { setPrimary: true })
        assert.equal(res.code, 200)
        assert.equal(userFindByPkArg, 7)
        assert.equal(ldapCalls[0][0], 'targetuser')
    })

    test('a non-staff user cannot touch another user’s email (403)', async () => {
        seedOwnedEmail()
        const res = await post(OTHER, { setPrimary: true })
        assert.equal(res.code, 403)
        assert.equal(userFindByPkArg, undefined) // never reached the mutation
        assert.deepEqual(ldapCalls, [])
    })

    test('setPrimary falsy: no user load, no LDAP, still 200', async () => {
        seedOwnedEmail()
        const res = await post(STAFF, {})
        assert.equal(res.code, 200)
        assert.equal(userFindByPkArg, undefined)
        assert.deepEqual(ldapCalls, [])
        assert.equal(emailAddress.reloaded, true)
    })

    test('404 for an unknown email address', async () => {
        emailAddress = null
        const res = await post(STAFF, { setPrimary: true })
        assert.equal(res.code, 404)
    })
})
