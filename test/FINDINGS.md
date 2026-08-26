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

## 2. `ConfigManager.init()` marks itself initialized before validating — RESOLVED

**Resolution:** `_initialized` is now set after `_validateConfig()` succeeds
rather than before it runs.

The old order was:

```js
this._config = this._loadFromJsonFile()
this._initialized = true
this._validateConfig()
```

If `_validateConfig()` threw, `_initialized` was already `true`, so every later
`init()` — including the implicit one inside every getter — returned
immediately and the process could run on a configuration that had failed
validation. Verified before the fix: after a failed `init()` on a config missing
`db.host`, a second `init()` succeeded silently and `getDbConfig().host` was
`undefined`.

No caller was relying on the old behavior. Every `config.init()` call site
(`server.js`, `startup.js`, `lib/email.js`, `lib/intercom.js`, `lib/hmac.js`)
lets the error propagate, so a failed validation still stops startup — it is now
merely consistent about it.

Covered by `test/api/lib/config.test.js` → `init() after a validation failure`:
the error repeats on a second `init()`, getters throw rather than returning a
partial config, and a corrected file initializes cleanly on retry.

---

## 3. `getUser` hangs the request when the token has no matching user — RESOLVED

**Resolution:** `getUser` now logs the mismatch and calls `next()`, leaving
`req.user` unset, instead of returning early.

The old code was:

```js
const user = await User.findOne({ where: { username: userId } })
if (!user)
    // should never happen
    return
```

The early `return` skipped `next()`. A valid Keycloak token for a username with
no `account_user` row produced a request that never responded — no status, no
error, no log line — until the client timed out. `getUser` guards roughly 45
endpoints across `users.js`, `services.js`, `workshops.js`, `forms.js`, and
`mailing_lists.js`, so the reach was wide. The `// should never happen` comment
assumed Keycloak and `account_user` cannot drift apart; a portal user deleted
while its Keycloak account survives does exactly that.

The logger is required at call time rather than at the top of the module.
`logging.js` imports `getUserID` from `lib/auth`, so a top-level import creates a
cycle that leaves that binding undefined — verified: it produces
`Warning: Accessing non-existent property 'getUserID' of module exports inside
circular dependency`, which would break `getLoggableUserID` on every logged
request. `lib/startup.js` requires `logging` lazily for the same reason.

**Scope note:** this makes a request with an unmatched token behave exactly like
a request with no token at all, which already reached handlers with `req.user`
unset. It does not make those handlers robust — see #5.

Covered by `test/api/lib/auth.test.js` → `getUser`: `next()` is called with
`req.user` unset, a warning naming the username and its probable cause is
emitted, and no warning is emitted on the normal path.

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

---

## 5. Handlers downstream of `getUser` assume `req.user` is set

**No test coverage.** Unlike the findings above, this one is not pinned by a
test — reproducing it means exercising express routes end to end, which the unit
suite does not do. Recorded here because it was observed while resolving #3.

`getUser` populates `req.user` when it can and calls `next()` either way; it is
not an authorization gate. Several routes use it without a following
`requireAuth`/`requireAdmin` and then assume the field is present:

- `src/api/users.js:110` — `router.get('/mine', getUser, ...)` calls
  `res.status(200).json(req.user)`. With no user this sends `200` with an empty
  body rather than `401`.
- `src/api/users.js:154` — the `/:usernameOrId/status` handler dereferences
  `req.user.is_staff` directly, throwing a `TypeError` that `asyncHandler`
  converts into a `500`.

This predates #3 and is reachable today by any request with no token at all, not
only by the unmatched-token case that #3 fixed. A fix would either add
`requireAuth` to the routes that need a user, or have the handlers check
`req.user` before dereferencing it.
