const LOGGING_MODULE = require.resolve('../../src/api/lib/logging')

const noop = () => {}

/**
 * Replaces src/api/lib/logging with a silent logger that records its calls.
 * The real module pulls in lib/auth and therefore the Sequelize models, so
 * stubbing it keeps modules under test isolated as well as quiet.
 *
 * Returns { logger, calls }, where calls is keyed by level and holds the
 * argument list of each call.
 */
function stubLogging() {
    const calls = { debug: [], info: [], warn: [], error: [] }
    const record =
        level =>
        (...args) =>
            calls[level].push(args)
    const logger = {
        debug: record('debug'),
        info: record('info'),
        warn: record('warn'),
        error: record('error'),
    }

    require.cache[LOGGING_MODULE] = {
        id: LOGGING_MODULE,
        filename: LOGGING_MODULE,
        loaded: true,
        exports: { logger, requestLogger: noop, errorLogger: noop },
    }

    return { logger, calls }
}

module.exports = { stubLogging, LOGGING_MODULE }
