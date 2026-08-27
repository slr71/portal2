// Minimal in-memory fixed-window rate limiting.
//
// createFixedWindowCounter is the reusable core: a keyed counter that resets
// each window. createRateLimiter wraps it as Express middleware keyed by client
// IP; email.js reuses the counter directly to cap per-recipient volume.
//
// NOTE: counters are per-process, so a multi-replica deployment gets
// max*replicas effectively; a shared store (e.g. Postgres/Redis) would be
// needed for a truly global limit.

// A keyed fixed-window counter. check(key) increments the key's count for the
// current window and reports whether it is still within max.
function createFixedWindowCounter({
    windowMs,
    max,
    now = Date.now,
    cleanupIntervalMs,
} = {}) {
    const hits = new Map() // key -> { count, resetAt }

    const counter = {
        check(key) {
            const t = now()
            let entry = hits.get(key)
            if (!entry || t >= entry.resetAt) {
                entry = { count: 0, resetAt: t + windowMs }
                hits.set(key, entry)
            }
            entry.count++
            return {
                allowed: entry.count <= max,
                count: entry.count,
                resetAt: entry.resetAt,
            }
        },
        cleanup() {
            const t = now()
            for (const [key, entry] of hits)
                if (t >= entry.resetAt) hits.delete(key)
        },
        size: () => hits.size,
    }

    if (cleanupIntervalMs) {
        const timer = setInterval(counter.cleanup, cleanupIntervalMs)
        if (timer.unref) timer.unref() // don't keep the process alive
        counter.stop = () => clearInterval(timer)
    }

    return counter
}

// Express middleware that 429s a client IP once it exceeds max requests per
// window. Sufficient to blunt high-volume attacks on the public endpoints (the
// token padding-oracle, account enumeration, email-trigger abuse).
function createRateLimiter({
    windowMs,
    max,
    now = Date.now,
    cleanupIntervalMs,
} = {}) {
    const counter = createFixedWindowCounter({
        windowMs,
        max,
        now,
        cleanupIntervalMs,
    })

    function limiter(req, res, next) {
        const key =
            req.ip || (req.socket && req.socket.remoteAddress) || 'unknown'
        const { allowed, resetAt } = counter.check(key)
        if (!allowed) {
            res.setHeader('Retry-After', Math.ceil((resetAt - now()) / 1000))
            return res.status(429).send('Too many requests')
        }
        return next()
    }

    limiter.cleanup = counter.cleanup
    limiter.size = counter.size
    if (counter.stop) limiter.stop = counter.stop

    return limiter
}

module.exports = { createRateLimiter, createFixedWindowCounter }
