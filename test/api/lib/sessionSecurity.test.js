const { describe, test } = require('node:test')
const assert = require('node:assert/strict')

const {
    regenerateSessionOnLogin,
    installLogoutSessionDestroy,
    GRANT_KEY,
    ROTATED_FLAG,
} = require('../../../src/api/lib/sessionSecurity')

// A session double whose regenerate() swaps in a fresh (empty) session object,
// mirroring express-session's behavior, and records what happened.
function makeSession(initial = {}) {
    const s = { ...initial, _events: [] }
    s.regenerate = cb => {
        const err = s._regenerateErr || null
        const saveErr = s._saveErr || null
        // wipe all data (new session), keep the methods
        for (const k of Object.keys(s))
            if (!['regenerate', 'save', 'destroy', '_events'].includes(k))
                delete s[k]
        s._saveErr = saveErr // survive the wipe so save() can still fail
        s._events.push('regenerate')
        cb(err)
    }
    s.save = cb => {
        s._events.push('save')
        cb(s._saveErr || null)
    }
    s.destroy = cb => {
        s._events.push('destroy')
        cb && cb(null)
    }
    return s
}

describe('regenerateSessionOnLogin', () => {
    test('rotates the session and preserves the grant on the first post-login request', () => {
        const session = makeSession({ [GRANT_KEY]: 'GRANT' })
        const req = { session }
        let nexted = false
        regenerateSessionOnLogin(req, {}, () => (nexted = true))

        assert.deepEqual(session._events, ['regenerate', 'save'])
        assert.equal(session[GRANT_KEY], 'GRANT') // grant carried across
        assert.equal(session[ROTATED_FLAG], true)
        assert.equal(nexted, true)
    })

    test('does not rotate again once flagged (idempotent)', () => {
        const session = makeSession({
            [GRANT_KEY]: 'GRANT',
            [ROTATED_FLAG]: true,
        })
        const req = { session }
        let nexted = false
        regenerateSessionOnLogin(req, {}, () => (nexted = true))

        assert.deepEqual(session._events, []) // no regenerate
        assert.equal(nexted, true)
    })

    test('does nothing for an anonymous session (no grant)', () => {
        const session = makeSession({})
        const req = { session }
        let nexted = false
        regenerateSessionOnLogin(req, {}, () => (nexted = true))

        assert.deepEqual(session._events, [])
        assert.equal(nexted, true)
    })

    test('does nothing when there is no session', () => {
        let nexted = false
        regenerateSessionOnLogin({}, {}, () => (nexted = true))
        assert.equal(nexted, true)
    })

    test('forwards a regenerate error to next', () => {
        const session = makeSession({ [GRANT_KEY]: 'GRANT' })
        session._regenerateErr = new Error('store down')
        let err
        regenerateSessionOnLogin({ session }, {}, e => (err = e))
        assert.match(err.message, /store down/)
    })

    test('forwards a save error to next', () => {
        const session = makeSession({ [GRANT_KEY]: 'GRANT' })
        session._saveErr = new Error('save failed')
        let err
        regenerateSessionOnLogin({ session }, {}, e => (err = e))
        assert.match(err.message, /save failed/)
    })
})

describe('installLogoutSessionDestroy', () => {
    test('destroy is deferred so keycloak-connect unstore does not throw', async () => {
        // Mirrors keycloak-connect logout: deauthenticated(req) then a
        // synchronous unstore that deletes req.session['keycloak-token'].
        const client = {}
        installLogoutSessionDestroy(client)

        let destroyed = false
        const request = {
            session: {
                [GRANT_KEY]: 'GRANT',
                destroy(cb) {
                    delete request.session // express-session nulls it sync
                    destroyed = true
                    cb && cb()
                },
            },
        }

        client.deauthenticated(request)
        // The unstore runs synchronously right after, on the still-present session.
        assert.ok(request.session, 'session must survive until unstore runs')
        assert.doesNotThrow(() => delete request.session[GRANT_KEY])

        await new Promise(r => setImmediate(r))
        assert.equal(destroyed, true)
        assert.equal(request.session, undefined)
    })

    test('tolerates logout with no session', () => {
        const client = {}
        installLogoutSessionDestroy(client)
        assert.doesNotThrow(() => client.deauthenticated({}))
    })
})
