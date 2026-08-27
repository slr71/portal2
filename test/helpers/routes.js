// Harness for exercising an Express route handler in isolation.
//
// Route modules under src/api pull in the Sequelize models, conductor client,
// email, and workflow modules at import time. Seed the require cache with stubs
// for those (keyed by absolute path via require.resolve) BEFORE loading the
// route module, then invoke a single route's middleware chain against a fake
// req/res.

/** Seeds require.cache so a later require(absPath) returns `exports`. */
function stubModule(absPath, exports) {
    require.cache[absPath] = {
        id: absPath,
        filename: absPath,
        loaded: true,
        exports,
    }
}

/** Loads a route module fresh after installing the given path->exports stubs. */
function loadRoute(routeAbsPath, stubs = {}) {
    for (const [absPath, exports] of Object.entries(stubs))
        stubModule(absPath, exports)
    delete require.cache[routeAbsPath]
    return require(routeAbsPath)
}

/** A response double that records status/body and whether the handler replied. */
function makeRes() {
    return {
        code: undefined,
        body: undefined,
        headers: {},
        ended: false,
        status(c) {
            this.code = c
            return this
        },
        send(b) {
            this.body = b
            this.ended = true
            return this
        },
        json(b) {
            this.body = b
            this.ended = true
            return this
        },
        set(k, v) {
            this.headers[k] = v
            return this
        },
    }
}

/**
 * Runs the full middleware chain of one route (method + exact router path
 * string, e.g. '/:id(\\d+)/reset_password') against `req`, returning the res
 * double once the chain responds, calls next() to the end, or errors.
 */
async function invokeRoute(router, method, routePath, req) {
    const layer = router.stack.find(
        l =>
            l.route &&
            l.route.path === routePath &&
            l.route.methods[method.toLowerCase()]
    )
    if (!layer) throw new Error(`route not found: ${method} ${routePath}`)

    const res = makeRes()
    const handlers = layer.route.stack.map(l => l.handle)

    await new Promise(resolve => {
        let i = 0
        const next = err => {
            if (err) {
                if (res.code === undefined) res.code = 500
                res.body = res.body ?? String(err && err.message)
                res.ended = true
                return resolve()
            }
            if (res.ended) return resolve()
            const handler = handlers[i++]
            if (!handler) return resolve()
            try {
                Promise.resolve(handler(req, res, next))
                    .then(() => {
                        if (res.ended) resolve()
                    })
                    .catch(next)
            } catch (e) {
                next(e)
            }
        }
        next()
    })

    return res
}

module.exports = { stubModule, loadRoute, makeRes, invokeRoute }
