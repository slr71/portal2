const { describe, test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')

const { baseConfig, writeConfig, loadConfig } = require('../../helpers/config')

/** Loads a fresh config singleton from the base fixture with mutations applied. */
function load(mutate) {
    const config = baseConfig()
    if (mutate) mutate(config)
    return loadConfig(writeConfig(config))
}

describe('a valid configuration', () => {
    test('initializes without error', () => {
        assert.doesNotThrow(() => load().init())
    })

    const getters = [
        { name: 'getDbConfig', key: 'db', probe: c => c.name },
        { name: 'getServerConfig', key: 'server', probe: c => c.port },
        { name: 'getSessionConfig', key: 'session', probe: c => c.secret },
        { name: 'getKeycloakConfig', key: 'keycloak', probe: c => c.realm },
        { name: 'getUiConfig', key: 'ui', probe: c => c.baseUrl },
        { name: 'getTerrainConfig', key: 'terrain', probe: c => c.url },
        {
            name: 'getProfileConfig',
            key: 'profile',
            probe: c => c.updatePeriod,
        },
        { name: 'getFeatures', key: 'features', probe: c => c.intercomEnabled },
        { name: 'getSentryConfig', key: 'sentry', probe: c => c.dsn },
        { name: 'getIntercomConfig', key: 'intercom', probe: c => c.appId },
        {
            name: 'getBccConfig',
            key: 'bcc',
            probe: c => c.newAccountConfirmation,
        },
        { name: 'getHoneypotConfig', key: 'honeypot', probe: c => c.divisor },
        { name: 'getSecurityConfig', key: 'security', probe: c => c.hmacKey },
        {
            name: 'getPortalConductorConfig',
            key: 'portalConductor',
            probe: c => c.url,
        },
    ]

    for (const { name, key, probe } of getters) {
        test(`${name} returns the ${key} section`, () => {
            const source = baseConfig()
            assert.equal(probe(load()[name]()), probe(source[key]))
        })
    }

    test('getAll returns the whole document', () => {
        const all = load().getAll()
        assert.equal(all.db.name, baseConfig().db.name)
        assert.equal(all.support.email, baseConfig().support.email)
    })

    test('a getter initializes the config on first use', () => {
        // No explicit init() call.
        assert.equal(load().getDbConfig().name, baseConfig().db.name)
    })

    test('getCorsConfig defaults to {} when the section is absent', () => {
        // The base config has no `cors` key; the getter must not return
        // undefined so callers can read allowedOrigins safely.
        assert.deepEqual(load().getCorsConfig(), {})
    })

    test('getCorsConfig returns the cors section when present', () => {
        const cfg = baseConfig()
        cfg.cors = { allowedOrigins: ['https://cyverse.org'] }
        assert.deepEqual(loadConfig(writeConfig(cfg)).getCorsConfig(), cfg.cors)
    })
})

describe('isDevelopment', () => {
    // Development mode is opt-in: only an explicit 'development' enables it, so
    // an unset or unexpected NODE_ENV fails safe to production.
    const cases = [
        { nodeEnv: 'development', expected: true },
        { nodeEnv: 'production', expected: false },
        { nodeEnv: undefined, expected: false },
        { nodeEnv: 'staging', expected: false },
        { nodeEnv: 'test', expected: false },
    ]

    for (const { nodeEnv, expected } of cases) {
        test(`is ${expected} when NODE_ENV is ${nodeEnv}`, () => {
            const original = process.env.NODE_ENV
            try {
                if (nodeEnv === undefined) delete process.env.NODE_ENV
                else process.env.NODE_ENV = nodeEnv
                assert.equal(load().getServerConfig().isDevelopment, expected)
            } finally {
                if (original === undefined) delete process.env.NODE_ENV
                else process.env.NODE_ENV = original
            }
        })
    }
})

describe('file loading failures', () => {
    test('reports a missing file', () => {
        assert.throws(() => loadConfig('/nonexistent/portal2.json').init(), {
            message:
                /Configuration file not found: \/nonexistent\/portal2\.json/,
        })
    })

    test('reports malformed JSON', () => {
        assert.throws(() => loadConfig(writeConfig('{ not json')).init(), {
            message: /Failed to parse configuration file/,
        })
    })

    test('reports a document with no server section', () => {
        // _loadFromJsonFile writes config.server.isDevelopment unguarded, so a
        // missing section surfaces as a parse failure rather than a missing-key
        // error.
        assert.throws(() => load(c => delete c.server).init(), {
            message:
                /Cannot set properties of undefined \(setting 'isDevelopment'\)/,
        })
    })
})

describe('required keys', () => {
    const required = [
        'db.host',
        'db.port',
        'db.name',
        'db.user',
        'db.password',
        'session.secret',
        'keycloak.realm',
        'keycloak.authUrl',
        'keycloak.client',
        'keycloak.secret',
        'ui.baseUrl',
        'security.hmacKey',
    ]

    for (const key of required) {
        test(`reports a missing ${key}`, () => {
            const [section, field] = key.split('.')
            assert.throws(() => load(c => delete c[section][field]).init(), {
                message: new RegExp(`Missing required configuration: ${key}`),
            })
        })
    }

    test('lists every missing key at once', () => {
        assert.throws(
            () =>
                load(c => {
                    delete c.db.host
                    delete c.ui.baseUrl
                }).init(),
            {
                message:
                    /Missing required configuration: db\.host, ui\.baseUrl/,
            }
        )
    })

    test('requires portalConductor.auth.password when a URL is configured', () => {
        assert.throws(
            () => load(c => delete c.portalConductor.auth.password).init(),
            {
                message:
                    /Missing required configuration: portalConductor\.auth\.password/,
            }
        )
    })

    test('does not require the conductor password without a URL', () => {
        assert.doesNotThrow(() =>
            load(c => {
                delete c.portalConductor.url
                delete c.portalConductor.auth.password
            }).init()
        )
    })
})

describe('type and format validation', () => {
    const invalid = [
        {
            name: 'a non-numeric db.port',
            mutate: c => (c.db.port = 'abc'),
            message: /db\.port must be a number/,
        },
        {
            name: 'a non-numeric server.port',
            mutate: c => (c.server.port = 'abc'),
            message: /server\.port must be a number/,
        },
        {
            name: 'a malformed ui.baseUrl',
            mutate: c => (c.ui.baseUrl = 'not-a-url'),
            message: /ui\.baseUrl must be a valid URL/,
        },
        {
            name: 'a malformed ui.wsBaseUrl',
            mutate: c => (c.ui.wsBaseUrl = 'not-a-url'),
            message: /ui\.wsBaseUrl must be a valid URL/,
        },
        {
            name: 'a malformed keycloak.authUrl',
            mutate: c => (c.keycloak.authUrl = 'not-a-url'),
            message: /keycloak\.authUrl must be a valid URL/,
        },
        {
            name: 'a malformed terrain.url',
            mutate: c => (c.terrain.url = 'not-a-url'),
            message: /terrain\.url must be a valid URL if provided/,
        },
        {
            name: 'a malformed portalConductor.url',
            mutate: c => (c.portalConductor.url = 'not-a-url'),
            message: /portalConductor\.url must be a valid URL if provided/,
        },
        {
            name: 'a malformed sentry.dsn',
            mutate: c => (c.sentry.dsn = 'not-a-url'),
            message: /sentry\.dsn must be a valid URL if provided/,
        },
    ]

    for (const { name, mutate, message } of invalid) {
        test(`reports ${name}`, () => {
            assert.throws(() => load(mutate).init(), { message })
        })
    }

    const optional = [
        { name: 'ui.wsBaseUrl', mutate: c => delete c.ui.wsBaseUrl },
        { name: 'terrain.url', mutate: c => delete c.terrain.url },
        { name: 'sentry.dsn', mutate: c => delete c.sentry },
    ]

    for (const { name, mutate } of optional) {
        test(`accepts an absent ${name}`, () => {
            assert.doesNotThrow(() => load(mutate).init())
        })
    }

    test('reports every validation error at once', () => {
        assert.throws(
            () =>
                load(c => {
                    c.db.port = 'abc'
                    c.ui.baseUrl = 'not-a-url'
                }).init(),
            {
                message:
                    /db\.port must be a number, ui\.baseUrl must be a valid URL/,
            }
        )
    })
})

describe('init() after a validation failure', () => {
    test('keeps rejecting an invalid config', () => {
        const config = load(c => delete c.db.host)
        const expected = { message: /Missing required configuration: db\.host/ }

        assert.throws(() => config.init(), expected)
        assert.throws(() => config.init(), expected)
    })

    test('does not expose the invalid config through a getter', () => {
        const config = load(c => delete c.db.host)

        assert.throws(() => config.init(), {
            message: /Missing required configuration: db\.host/,
        })
        assert.throws(() => config.getDbConfig(), {
            message: /Missing required configuration: db\.host/,
        })
    })

    test('succeeds once the underlying file is corrected', () => {
        const invalid = baseConfig()
        delete invalid.db.host
        const configPath = writeConfig(invalid)
        const config = loadConfig(configPath)

        assert.throws(() => config.init())

        fs.writeFileSync(configPath, JSON.stringify(baseConfig()))

        assert.doesNotThrow(() => config.init())
        assert.equal(config.getDbConfig().host, baseConfig().db.host)
    })
})
