const { createLogger, format, transports, addColors } = require('winston')
const { combine, timestamp, label, printf, colorize } = format
const expressWinston = require("express-winston")
const { getUserID } = require("./auth")

//TODO move to config file
const logLevel = 'info'
const logLabel = 'dev'

const logFormat = printf(
    ({ level, message, label, timestamp }) =>
        `${timestamp} [${label}] ${level}: ${message}`
)

const logger = createLogger({
    level: logLevel,
    format: combine(label({ label: logLabel }), timestamp(), logFormat, colorize({ all: true })),
    transports: [new transports.Console()],
})

addColors({
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  debug: 'green'
})

const getLoggableUserID = (req) => getUserID(req) || "logged-out-user"

const requestLogger = expressWinston.logger({
  transports: [new transports.Console()],
  msg: (req, res) =>
      `HTTP ${req.ip} ${JSON.stringify(req.ips)} ${getLoggableUserID(req)} ${req.method} ${req.url} ${res.statusCode} ${res.responseTime}ms`,
  format: combine(label({ label: logLabel }), timestamp(), logFormat, colorize({ all: true })),
})

const errorLogger = expressWinston.errorLogger({
  transports: [new transports.Console()],
  msg: (req, res, err) =>
      `HTTP Error ${req.ip} ${JSON.stringify(req.ips)} ${getLoggableUserID(req)} ${req.method} ${req.url} ${err.message} ${res.statusCode} ${res.responseTime}ms`,
  format: combine(label({ label: logLabel }), timestamp(), logFormat, colorize({ all: true })),
})

module.exports = { logger, requestLogger, errorLogger }