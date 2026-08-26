# Findings

Defects the test suite surfaced. Unless marked resolved, **the defect is still
present**: it has a test that pins the current behavior so the suite is green on
a clean checkout, plus a `test.skip` stub asserting the correct behavior that
can be enabled once the defect is addressed.

Numbering is stable — test comments reference these by number, so a resolved
entry stays in place rather than being removed and renumbered.

---

## 1. `checkLDAPPassword` can never return true — RESOLVED

**Resolution:** `checkLDAPPassword`, `checkDjangoPassword`, and `checkPassword`
were deleted. `src/api/lib/password.js` now exports only `encodePassword`.

The comparison was `digest == sha.digest()` — a `string` against a `Buffer`,
which is never equal. A `{SSHA}` hash built the way OpenLDAP builds it, checked
against the correct password, returned `false`. The same function also assigned
four implicit globals and decoded a binary SHA-1 digest through a UTF-8
`.toString()`, corrupting it before slicing.

Deleting rather than fixing was the right call: the three functions had no
callers. `d6cbe26` ("Use LDAP as the source of truth for the user password reset
form", 2025-09-22) replaced the one `checkPassword` call site with
`validateLdapPassword`, which checks credentials against portal-conductor, and
left the functions behind. Password verification has gone through
portal-conductor ever since; `encodePassword` remains the only part still in
use, writing the Django-format hash to `account_user.password`.

---

## 2. `ConfigManager.init()` marks itself initialized before validating

**`src/api/lib/config.js:26-29`**

```js
this._config = this._loadFromJsonFile()
this._initialized = true
this._validateConfig()
```

If `_validateConfig()` throws, `_initialized` is already `true`. Every later
`init()` call — including the implicit one inside every getter — returns
immediately, and the process runs on a configuration that failed validation.
Verified: after a failed `init()` on a config missing `db.host`, a second
`init()` succeeds silently and `getDbConfig().host` is `undefined`.

Anything that catches the startup error and continues, or that reaches a getter
before the failure propagates, gets a half-validated config instead of a hard
stop. `validateStartupConfiguration()` (`src/api/lib/startup.js`) logs and
rethrows, so today the process does exit — but the guard is one `try/catch` away
from being defeated.

**Suggested fix:** swap the two lines so `_initialized` is set only after
validation passes.

- Pinned by: `test/api/lib/config.test.js` → `succeeds silently and leaves the invalid config loaded`
- Stub: `keeps rejecting an invalid config`

---

## 3. `getUser` hangs the request when the token has no matching user

**`src/api/lib/auth.js:24-26`**

```js
const user = await User.findOne({ where: { username: userId } })
if (!user)
    // should never happen
    return
```

The early `return` skips `next()`. Used directly as express middleware — for
example `router.get('/mine', getUser, ...)` at `src/api/users.js:110`, and
`router.get('/', getUser, ...)` at `src/api/users.js:38` — a valid Keycloak
token for a username absent from `account_user` produces a request that never
responds. No status, no error, no log line: the client waits until it times out.

The `// should never happen` comment assumes Keycloak and `account_user` cannot
drift apart. They can: a user deleted from the portal database whose Keycloak
account survives hits this path with a valid token.

**Suggested fix:** log the mismatch with its probable cause and call `next()`,
leaving `req.user` unset so the downstream authorization check produces a 401 or
403.

- Pinned by: `test/api/lib/auth.test.js` → `does not call next when the token has no matching user`
- Stub: `calls next when the token has no matching user`

---

## 4. `validateLdapPassword` detects rejected credentials by substring-matching an error message

**`src/api/workflows/native/services/utils.js:97-104`**

```js
if (
    error.message &&
    (error.message.includes('404') ||
        error.message.includes('400') ||
        error.message.includes('Invalid credentials'))
) {
    return false
}
throw error
```

The message it inspects is built by `makeRequest`, which prefers
`error.response.data.detail` over the axios message. When portal-conductor
returns a `400` with no `detail`, the fallback message is axios's
`Request failed with status code 400`, the substring matches, and the function
correctly returns `false`. When the same `400` carries a descriptive detail —
`{"detail": "password does not match"}` — the status code is no longer anywhere
in the message, the match fails, and the function **throws**. A wrong password
then surfaces as a 500 instead of a clean rejection.

The classification is coupled to prose that portal-conductor is free to change,
in a repo that does not control it. It also cuts the other way: a `500` whose
detail happened to contain "400" would be read as a rejected password.

**Suggested fix:** classify on `error.response.status` rather than the message.
That requires `makeRequest` to preserve the status — either by rethrowing an
error that carries it, or by exposing a variant that returns the response.

- Pinned by: `test/api/workflows/native/services/utils.test.js` → `throws for a 400 whose detail does not mention the status`
- Stub: `returns false for a 400 whose detail does not mention the status`
- Related coverage: `rethrows a server error rather than reporting a bad password`
  asserts the behavior that must be preserved by any fix — a conductor outage
  must never read as a wrong password.
