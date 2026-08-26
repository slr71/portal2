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

## 4. `validateLdapPassword` detects rejected credentials by substring-matching an error message — RESOLVED

**Resolution:** the catch block is gone. `validateLdapPassword` now decides
solely on the documented `{valid: bool}` response body, and every error
propagates. `makeRequest` additionally attaches `status` and `cause` to the error
it throws, so callers can classify by code rather than by message text.

The old code inspected the message `makeRequest` had built:

```js
if (
    error.message &&
    (error.message.includes('404') ||
        error.message.includes('400') ||
        error.message.includes('Invalid credentials'))
) {
    return false
}
```

That message prefers `error.response.data.detail` over the axios message, so a
`400` carrying a descriptive detail lost the status code from the string
entirely and the function threw instead of returning `false`.

**The original diagnosis here was incomplete.** It proposed classifying on
`error.response.status` while keeping `400`/`404` mapped to `false`. Checking
portal-conductor shows that no error status has ever meant "rejected
credentials":

- Go (`api/users.go`, since the 2026-06-09 rewrite): `ValidateCredentials`
  returns `(false, nil)` for `LDAPResultInvalidCredentials`, for an empty
  password, and for an unknown user, and the handler writes
  `200 {"valid": false}`.
- Python (`handlers/user_management.py`, before that): returns
  `{"valid": False}` for `ldap.INVALID_CREDENTIALS` and for a missing user DN;
  its docstring says it raises "if validation fails due to system errors".

So in both generations the branch could only ever fire on a genuine fault —
conductor unreachable, LDAP down, portal2's own basic-auth credentials to the
conductor wrong (`401 "Incorrect username or password"`, which is about
portal2's credentials, not the end user's), a malformed body (`422`), or a
missing route (`404`, i.e. version skew). Every one of those was being reported
to the user as an incorrect password.

The single caller, `src/api/users.js:500`, is inside `asyncHandler`, so a fault
now surfaces as a `500` rather than a misleading `400 "Incorrect password"`.
A wrong password still returns `false` and still yields `400 "Incorrect
password"`, because that path never involved an error at all.

Covered by `test/api/workflows/native/services/utils.test.js`: a table of error
responses (`400`, `404`, `401`, `422`, with and without `detail`) all throw, the
`{valid: ...}` cases are unchanged, and `makeRequest` carries `status`/`cause`
(`undefined` status for a network error, which has no response).

---

## 5. Handlers downstream of `getUser` assume `req.user` is set — RESOLVED

**Resolution:** added a `requireUser` middleware to `src/api/lib/auth.js` and
switched the 28 routes that read `req.user` without another gate over to it.

`getUser` populates `req.user` when it can and calls `next()` either way; it is
not an authorization gate. Routes that used it and then assumed the field was
present produced a `TypeError` (an `asyncHandler` `500`) for any request without
a matching portal user, or, for `/mine`, a `200` with an empty body.

`requireAuth` is **not** a sufficient fix. It checks only that a token was
presented:

```js
const requireAuth = async (req, res, next) => {
    if (!getUserID(req)) res.status(401).send('Unauthorized')
    else if (next) next()
}
```

A token whose username has no `account_user` row passes it and still leaves
`req.user` unset — the same case #3 addressed. `requireUser` mirrors the
existing `requireAdmin`, which already loaded the user and rejected when it was
absent:

```js
const requireUser = async (req, res, next) => {
    if (!req.user) await getUser(req)
    if (!req.user) res.status(401).send('Unauthorized')
    else if (next) next()
}
```

**Behavior change:** these routes now answer `401` instead of `500` (or, for
`/mine`, instead of an empty `200`). No legitimate traffic is affected — every
one of the 28 dereferenced `req.user`, directly or through
`hasHostAccess`/`hasOrganizerAccess`, which read `user.id`. None could serve an
anonymous caller before; they crashed.

Routes still on `getUser` are either gated by `requireAdmin` (which loads the
user itself) or never read `req.user`.

Covered by `test/api/lib/auth.test.js` → `requireUser`, including a case that
runs the same ghost-token request through both middlewares and asserts
`requireAuth` admits it while `requireUser` rejects it.

---

## 6. Permission checks call `findOne` without `await`, so they never deny

**Not fixed — this changes who can reach several endpoints and wants a
deliberate decision.** Found while resolving #5.

`src/api/workshops.js:31`:

```js
function hasOrganizerAccess(workshop, user) {
    return (
        hasHostAccess(workshop, user) ||
        WorkshopOrganizer.findOne({
            where: { workshop_id: workshop.id, organizer_id: user.id },
        })
    )
}
```

`findOne` is not awaited, so when `hasHostAccess` is false the function returns
a **Promise**, which is always truthy. Every caller is shaped
`if (!hasOrganizerAccess(...)) return res.status(403)`, so the `403` is never
sent. Verified with a stub that returns `null` for a user who is neither host,
staff, nor organizer: the helper returns `[object Promise]` and `!verdict` is
`false`.

There are **13 call sites** in `workshops.js`, covering participants, emails,
organizers, contacts, services, and enrollment requests. In effect any
authenticated user can act on any workshop.

The same pattern is in `src/api/users.js:49`, inside the
staff/host/organizer check on `GET /users`:

```js
if (!req.user || !req.user.is_staff) {
    if (!Workshop.findOne({ where: { creator_id: req.user.id } })) {
```

`Workshop.findOne` is likewise unawaited, so the nested `403` is unreachable and
any authenticated non-staff user can list and search all users. (Before #5 this
block had a second problem: it dereferenced `req.user.id` inside the branch that
tests for `!req.user`. `requireUser` makes `req.user` guaranteed, so that
particular crash is gone, but the missing `await` remains.)

Fixing it means making both helpers `async` and awaiting them at every call
site. That is mechanical, but it starts denying users who currently get through,
so it should land as its own reviewable, separately-revertable change.
