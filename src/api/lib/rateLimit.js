// Minimal in-memory fixed-window rate limiter, keyed by client IP.
//
// Sufficient to blunt high-volume attacks on the public endpoints (the token
// padding-oracle, account enumeration, email-trigger abuse). NOTE: the counter
// is per-process, so a multi-replica deployment gets max*replicas effectively;
// a shared store (e.g. Postgres/Redis) would be needed for a global limit.

function createRateLimiter({
    windowMs,
    max,
    now = Date.now,
    cleanupIntervalMs,
} = {}) {
    const hits = new Map() // key -> { count, resetAt }

    function limiter(req, res, next) {
        const key =
            req.ip || (req.socket && req.socket.remoteAddress) || 'unknown'
        const t = now()
        let entry = hits.get(key)
        if (!entry || t >= entry.resetAt) {
            entry = { count: 0, resetAt: t + windowMs }
            hits.set(key, entry)
        }
        entry.count++
        if (entry.count > max) {
            res.setHeader('Retry-After', Math.ceil((entry.resetAt - t) / 1000))
            return res.status(429).send('Too many requests')
        }
        return next()
    }

    limiter.cleanup = () => {
        const t = now()
        for (const [key, entry] of hits)
            if (t >= entry.resetAt) hits.delete(key)
    }
    limiter.size = () => hits.size

    if (cleanupIntervalMs) {
        const timer = setInterval(limiter.cleanup, cleanupIntervalMs)
        if (timer.unref) timer.unref() // don't keep the process alive
        limiter.stop = () => clearInterval(timer)
    }

    return limiter
}

module.exports = { createRateLimiter }
