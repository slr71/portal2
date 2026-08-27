const { describe, test } = require('node:test')
const assert = require('node:assert/strict')

const {
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
