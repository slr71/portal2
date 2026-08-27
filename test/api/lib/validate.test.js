const { describe, test } = require('node:test')
const assert = require('node:assert/strict')

const { isValidUsername } = require('../../../src/api/lib/validate')

describe('isValidUsername', () => {
    const valid = [
        'bob',
        'Bob',
        'bob.smith',
        'bob_smith',
        'bob-smith',
        'a',
        'user1',
        '1user',
        'a'.repeat(64),
    ]
    for (const u of valid) {
        test(`accepts ${JSON.stringify(u)}`, () => {
            assert.equal(isValidUsername(u), true)
        })
    }

    const invalid = [
        { name: 'empty', v: '' },
        { name: 'dot-dot (traversal)', v: '..' },
        { name: 'path traversal', v: '../../ldap/users/admin' },
        { name: 'a slash', v: 'a/b' },
        { name: 'a leading dot', v: '.bob' },
        { name: 'a leading hyphen', v: '-bob' },
        { name: 'a space', v: 'bob smith' },
        { name: 'a percent escape', v: 'a%2fb' },
        { name: 'over 64 chars', v: 'a'.repeat(65) },
        { name: 'a null byte', v: 'bob\u0000' },
        { name: 'a tab', v: 'bob\tsmith' },
        { name: 'a newline', v: 'bob\nsmith' },
        { name: 'non-string (number)', v: 12345 },
        { name: 'non-string (null)', v: null },
        { name: 'non-string (object)', v: { username: 'bob' } },
    ]
    for (const { name, v } of invalid) {
        test(`rejects ${name}`, () => {
            assert.equal(isValidUsername(v), false)
        })
    }
})
