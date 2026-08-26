const LOGGING_MODULE = require.resolve('../../src/api/lib/logging')

const noop = () => {}

/**
 * Replaces src/api/lib/logging with a silent logger.
 * The real module pulls in lib/auth and therefore the Sequelize models, so
 * stubbing it keeps modules under test isolated as well as quiet.
 */
function stubLogging() {
    const logger = { debug: noop, info: noop, warn: noop, error: noop }
    require.cache[LOGGING_MODULE] = {
        id: LOGGING_MODULE,
        filename: LOGGING_MODULE,
        loaded: true,
        exports: { logger, requestLogger: noop, errorLogger: noop },
    }
    return logger
}

module.exports = { stubLogging, LOGGING_MODULE }
