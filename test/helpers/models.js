const MODELS_MODULE = require.resolve('../../src/api/models')

/**
 * Replaces src/api/models with the given stub models.
 * The real module builds a Sequelize instance at import time; seeding the
 * require cache means it is never loaded.
 */
function stubModels(models) {
    require.cache[MODELS_MODULE] = {
        id: MODELS_MODULE,
        filename: MODELS_MODULE,
        loaded: true,
        exports: models,
    }
    return models
}

/** A minimal express response double that records what a handler sent. */
function makeRes() {
    return {
        code: undefined,
        body: undefined,
        status(code) {
            this.code = code
            return this
        },
        send(body) {
            this.body = body
            return this
        },
        json(body) {
            this.body = body
            return this
        },
    }
}

/** Builds a request carrying a Keycloak grant for the given username. */
function makeReq(username) {
    if (!username) return {}
    return {
        kauth: {
            grant: {
                access_token: { content: { preferred_username: username } },
            },
        },
    }
}

module.exports = { stubModels, makeRes, makeReq, MODELS_MODULE }
