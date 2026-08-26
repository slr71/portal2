const http = require('node:http')

/**
 * Starts a local HTTP server that records requests and replays a queued list of
 * responses. Once the queue is exhausted the final entry repeats, so an
 * "always fails" case is a single-entry queue.
 *
 * Each response is { status, body, headers }; an object body is sent as JSON.
 */
async function startServer(responses) {
    const queue = Array.isArray(responses) ? responses.slice() : [responses]
    const requests = []

    const server = http.createServer((req, res) => {
        const chunks = []
        req.on('data', chunk => chunks.push(chunk))
        req.on('end', () => {
            const raw = Buffer.concat(chunks).toString()
            requests.push({
                method: req.method,
                url: req.url,
                headers: req.headers,
                raw,
                body: raw ? safeParse(raw) : undefined,
            })

            const next = queue.length > 1 ? queue.shift() : queue[0]
            const status = next.status || 200
            const body =
                typeof next.body === 'string'
                    ? next.body
                    : JSON.stringify(next.body === undefined ? {} : next.body)

            res.writeHead(status, {
                'Content-Type': 'application/json',
                ...next.headers,
            })
            res.end(body)
        })
    })

    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))

    return {
        url: `http://127.0.0.1:${server.address().port}`,
        requests,
        close: () => new Promise(resolve => server.close(resolve)),
    }
}

function safeParse(raw) {
    try {
        return JSON.parse(raw)
    } catch {
        return raw
    }
}

module.exports = { startServer }
