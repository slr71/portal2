# Findings

Defects the test suite surfaced. **None of these are fixed.** Each has a test
that pins the current behavior so the suite is green on a clean checkout, plus a
`test.skip` stub asserting the correct behavior that can be enabled once the
defect is addressed.

---

## 1. `checkLDAPPassword` can never return true

**`src/api/lib/password.js:20`**

```js
return digest == sha.digest()
```

`digest` is a `string` (sliced out of a `Buffer.toString()`), `sha.digest()`
returns a `Buffer`. The loose comparison stringifies the Buffer as
comma-separated byte values, so it never matches. Verified: a `{SSHA}` hash
built the way OpenLDAP builds it, checked against the correct password, returns
`false`.

Two further problems in the same function:

- `digest_salt_b64`, `digest_salt`, `digest`, and `salt` are assigned without
  `const`/`let`, making them implicit globals. Under strict mode the function
  would throw instead of returning a wrong answer.
- The hash is decoded with `.toString()` (UTF-8), which corrupts the binary
  SHA-1 digest before it is sliced. Even with the comparison fixed, the byte
  handling needs `Buffer` slicing rather than string slicing.

**Reachability:** currently none. `grep` shows `checkPassword`,
`checkLDAPPassword`, and `checkDjangoPassword` have no callers — only
`encodePassword` is used (`src/api/public.js:350`, `src/api/users.js:507`,
`src/api/users.js:663`). LDAP credential checks now go through
`validateLdapPassword` against portal-conductor.

**Suggested action:** delete the three `check*` functions, or fix and cover them
if a local fallback path is still wanted. Deleting is the smaller change and
removes a function that would silently reject every valid password if it were
ever wired up.

- Pinned by: `test/api/lib/password.test.js` → `checkLDAPPassword rejects a valid {SSHA} hash`
- Stub: `accepts a valid {SSHA} hash`

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
