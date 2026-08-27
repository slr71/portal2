const { createLogger, format, transports, addColors } = require('winston')
const { combine, timestamp, label, printf, colorize } = format
const expressWinston = require('express-winston')
const { getUserID } = require('./auth')

// Log level is opt-in verbose: LOG_LEVEL wins if set, otherwise only an
// explicit NODE_ENV=development gets 'debug'; everything else (production, or
// an unset/unexpected value) defaults to 'info' so production isn't verbose.
function resolveLogLevel(env = process.env) {
    return env.LOG_LEVEL || (env.NODE_ENV === 'development' ? 'debug' : 'info')
}

function resolveLogLabel(env = process.env) {
    return env.NODE_ENV === 'development' ? 'DEV' : 'PROD'
}

const logLevel = resolveLogLevel()
const logLabel = resolveLogLabel()

const formatMeta = meta => {
    const splat = meta[Symbol.for('splat')]
    if (splat && splat.length) return splat.join(' ')
    return ''
}

const logFormat = printf(
    ({ level, message, label, timestamp, ...meta }) =>
        `${timestamp} [${label}] ${level}: ${message} ${formatMeta(meta)}`
)

const logger = createLogger({
    level: logLevel,
    format: combine(
        label({ label: logLabel }),
        timestamp(),
        logFormat,
        colorize({ all: true })
    ),
    transports: [new transports.Console()],
})

addColors({
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    debug: 'green',
})

const getLoggableUserID = req => getUserID(req) || 'logged-out-user'

const requestLogger = expressWinston.logger({
    transports: [new transports.Console()],
    msg: (req, res) => {
        // Never log request bodies as they may contain passwords, tokens, and other sensitive data
        return `HTTP ${req.ip} ${getLoggableUserID(req)} ${req.method} ${
            req.url
        } ${res.statusCode} ${res.responseTime}ms`
    },
    format: combine(
        label({ label: logLabel }),
        timestamp(),
        logFormat,
        colorize({ all: true })
    ),
})

const errorLogger = expressWinston.errorLogger({
    transports: [new transports.Console()],
    msg: (req, res, err) =>
        `HTTP Error ${req.ip} ${getLoggableUserID(req)} ${req.method} ${
            req.url
        } ${err.message} ${res.statusCode} ${res.responseTime}ms`,
    format: combine(
        label({ label: logLabel }),
        timestamp(),
        logFormat,
        colorize({ all: true })
    ),
})

module.exports = {
    logger,
    requestLogger,
    errorLogger,
    resolveLogLevel,
    resolveLogLabel,
}
