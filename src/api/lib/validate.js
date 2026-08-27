// Server-side identifier validation.
//
// A username becomes an LDAP/POSIX account and is interpolated into
// portal-conductor API paths, so it must match a strict, path-safe allowlist:
// starts alphanumeric, then letters/digits/dot/underscore/hyphen, <= 64 chars.
// This rejects path separators, traversal (leading dot), spaces, and percent
// escapes at the point of entry.
const USERNAME_RE = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$/

function isValidUsername(username) {
    return typeof username === 'string' && USERNAME_RE.test(username)
}

// The permission levels the admin UI can assign. 'regular' clears both flags;
// requiring an explicit value keeps a missing/misspelled permission from
// silently demoting a user instead of being rejected.
const PERMISSIONS = ['regular', 'staff', 'superuser']

function isValidPermission(permission) {
    return PERMISSIONS.includes(permission)
}

// The Sequelize scopes the admin user-lookup route may apply. Both currently
// exclude the password column; allowlisting the name (rather than passing the
// query param straight to User.scope()) keeps a client from selecting an
// unintended -- or future, inadvertently unsafe -- scope.
const USER_SCOPES = ['defaultScope', 'profile']

function isValidUserScope(scope) {
    return USER_SCOPES.includes(scope)
}

module.exports = {
    isValidUsername,
    USERNAME_RE,
    isValidPermission,
    PERMISSIONS,
    isValidUserScope,
    USER_SCOPES,
}
