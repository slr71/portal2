const { describe, test } = require('node:test')
const assert = require('node:assert/strict')

const {
    isValidUsername,
    isValidPermission,
    PERMISSIONS,
    isValidUserScope,
    USER_SCOPES,
} = require('../../../src/api/lib/validate')

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

describe('isValidPermission', () => {
    for (const p of PERMISSIONS) {
        test(`accepts ${JSON.stringify(p)}`, () => {
            assert.equal(isValidPermission(p), true)
        })
    }

    const invalid = [
        { name: 'empty', v: '' },
        { name: 'undefined', v: undefined },
        { name: 'null', v: null },
        { name: 'unknown value', v: 'admin' },
        { name: 'misspelled', v: 'staf' },
        { name: 'wrong case', v: 'Staff' },
        { name: 'non-string', v: 1 },
    ]
    for (const { name, v } of invalid) {
        test(`rejects ${name}`, () => {
            assert.equal(isValidPermission(v), false)
        })
    }
})

describe('isValidUserScope', () => {
    for (const s of USER_SCOPES) {
        test(`accepts ${JSON.stringify(s)}`, () => {
            assert.equal(isValidUserScope(s), true)
        })
    }

    const invalid = [
        { name: 'empty', v: '' },
        { name: 'undefined', v: undefined },
        { name: 'unknown scope', v: 'withPassword' },
        { name: 'an ORM method name', v: 'findAll' },
        { name: 'wrong case', v: 'DefaultScope' },
        { name: 'an array', v: ['defaultScope', 'evil'] },
    ]
    for (const { name, v } of invalid) {
        test(`rejects ${name}`, () => {
            assert.equal(isValidUserScope(v), false)
        })
    }
})

describe('conductor path encoding completeness', () => {
    const fs = require('node:fs')
    const path = require('node:path')
    // A '/${identifier}' path segment (slash immediately before the
    // interpolation) is an HTTP path sink and must be encoded; log messages and
    // JSON bodies interpolate the same names without a leading slash.
    const BARE_SEGMENT =
        /\/\$\{(?:user\.)?(username|groupname|listname|email|attribute|analysisId)\}/
    const files = [
        'users.js',
        'async.js',
        'workflows/native/user.js',
        'workflows/native/services/utils.js',
    ]

    for (const f of files) {
        test(`${f} encodes every identifier used as a path segment`, () => {
            const src = fs.readFileSync(
                path.join(__dirname, '..', '..', '..', 'src', 'api', f),
                'utf8'
            )
            const match = src.match(BARE_SEGMENT)
            assert.equal(
                match,
                null,
                match && `unencoded path segment: ${match[0]}`
            )
        })
    }
})
