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

module.exports = { isValidUsername, USERNAME_RE }
