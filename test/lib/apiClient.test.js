const { describe, test, beforeEach } = require('node:test')
const assert = require('node:assert/strict')

// Stub axios before requiring the client, capturing the options it's called with.
const AXIOS = require.resolve('axios')
let captured = null
require.cache[AXIOS] = {
    id: AXIOS,
    filename: AXIOS,
    loaded: true,
    exports: {
        request: async options => {
            captured = options
            return { data: { ok: true } }
        },
    },
}

const PortalAPI = require('../../src/lib/apiClient')

beforeEach(() => {
    captured = null
})

describe('PortalAPI auth', () => {
    test('a browser client (no token) sends no bearer header and enables cookies', async () => {
        const api = new PortalAPI({ baseUrl: '/api' })
        await api.user('mine')

        assert.equal(captured.headers.Authorization, undefined)
        assert.equal(captured.withCredentials, true)
        assert.match(captured.url, /\/api\/users\/mine$/)
    })

    test('a server-side client (with token) still sends the bearer header', async () => {
        const api = new PortalAPI({ baseUrl: 'http://host/api', token: 'TKN' })
        await api.user('mine')

        assert.equal(captured.headers.Authorization, 'Bearer TKN')
        // withCredentials is only for the tokenless browser path.
        assert.notEqual(captured.withCredentials, true)
    })

    test('a POST from a browser client also enables cookies, no bearer', async () => {
        const api = new PortalAPI({ baseUrl: '/api' })
        await api.checkUsername('bob')

        assert.equal(captured.headers.Authorization, undefined)
        assert.equal(captured.withCredentials, true)
        assert.equal(captured.method, 'post')
    })
})
