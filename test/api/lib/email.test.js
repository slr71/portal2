const { describe, test } = require('node:test')
const assert = require('node:assert/strict')

// Stub the conductor client before loading email.js so a queued send's timer
// (unref'd) never reaches the network if it fires during the run.
const utilsPath = require.resolve(
    '../../../src/api/workflows/native/services/utils'
)
require.cache[utilsPath] = {
    id: utilsPath,
    filename: utilsPath,
    loaded: true,
    exports: { makeRequest: async () => ({ message: 'stubbed' }) },
}

const {
    queueEmail,
    withinRecipientEmailCap,
    RECIPIENT_EMAIL_MAX,
} = require('../../../src/api/lib/email')

describe('withinRecipientEmailCap (M10 per-recipient email cap)', () => {
    // The counter is module-level, so each test uses a distinct address to stay
    // isolated from the others.
    test('allows up to the cap, then blocks the same recipient', () => {
        const to = 'cap-victim@example.test'
        for (let i = 0; i < RECIPIENT_EMAIL_MAX; i++)
            assert.equal(withinRecipientEmailCap(to), true, `send ${i + 1}`)
        assert.equal(withinRecipientEmailCap(to), false) // over the cap
        assert.equal(withinRecipientEmailCap(to), false) // stays blocked
    })

    test('caps are independent per recipient', () => {
        const a = 'cap-a@example.test'
        const b = 'cap-b@example.test'
        for (let i = 0; i < RECIPIENT_EMAIL_MAX + 1; i++)
            withinRecipientEmailCap(a)
        assert.equal(withinRecipientEmailCap(a), false) // a exhausted
        assert.equal(withinRecipientEmailCap(b), true) // b unaffected
    })

    test('a non-string recipient does not throw', () => {
        assert.equal(withinRecipientEmailCap(undefined), true)
    })
})

describe('queueEmail cap gating (only the abuse-prone flows are capped)', () => {
    const cfg = to => ({ to, subject: 'Subject', text: 'body' })

    test('rateLimited: true drops a recipient once over the cap', async () => {
        const to = 'gate-victim@example.test'
        for (let i = 0; i < RECIPIENT_EMAIL_MAX; i++)
            assert.equal(
                await queueEmail(cfg(to), { rateLimited: true }),
                true,
                `send ${i + 1}`
            )
        // The next one exceeds the cap and is dropped.
        assert.equal(await queueEmail(cfg(to), { rateLimited: true }), false)
    })

    test('default (notifications) is never capped, even past the max', async () => {
        // e.g. a shared workshop-organizer address receiving many enrollment
        // requests in a burst -- none may be silently dropped.
        const to = 'gate-organizer@example.test'
        for (let i = 0; i < RECIPIENT_EMAIL_MAX + 3; i++)
            assert.equal(await queueEmail(cfg(to)), true, `notify ${i + 1}`)
    })
})
