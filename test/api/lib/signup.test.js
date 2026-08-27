const { describe, test } = require('node:test')
const assert = require('node:assert/strict')

const {
    pickSignupFields,
    SIGNUP_USER_FIELDS,
} = require('../../../src/api/lib/signup')

describe('pickSignupFields (mass-assignment allowlist)', () => {
    test('keeps the allowlisted user fields', () => {
        const body = {
            username: 'bob',
            first_name: 'Bob',
            last_name: 'Smith',
            email: 'b@x.test',
            department: 'Bio',
            grid_institution_id: 5,
            occupation_id: 1,
            region_id: 2,
        }
        const out = pickSignupFields(body)
        for (const k of Object.keys(body)) assert.equal(out[k], body[k])
    })

    const dangerous = [
        'id',
        'last_login',
        'date_joined',
        'user_institution_id',
        'settings',
        'is_staff',
        'is_superuser',
        'is_active',
        'has_verified_email',
        'password',
    ]
    test('drops every privilege/internal column from the body', () => {
        const body = { username: 'bob' }
        for (const k of dangerous) body[k] = 'ATTACKER'
        const out = pickSignupFields(body)
        assert.equal(out.username, 'bob')
        for (const k of dangerous)
            assert.ok(!(k in out), `${k} must not survive the allowlist`)
    })

    test('drops arbitrary unknown keys', () => {
        const out = pickSignupFields({ username: 'bob', totally_unknown: 1 })
        assert.deepEqual(Object.keys(out), ['username'])
    })

    test('the allowlist contains no privilege or internal columns', () => {
        const forbidden = [
            'id',
            'password',
            'is_staff',
            'is_superuser',
            'is_active',
            'has_verified_email',
            'last_login',
            'date_joined',
            'user_institution_id',
            'settings',
            'institution',
        ]
        for (const k of forbidden)
            assert.ok(
                !SIGNUP_USER_FIELDS.includes(k),
                `${k} must not be in the signup allowlist`
            )
    })

    test('tolerates a null/undefined body', () => {
        assert.deepEqual(pickSignupFields(null), {})
        assert.deepEqual(pickSignupFields(undefined), {})
    })
})
