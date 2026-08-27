const { describe, test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const {
    resolveLogLevel,
    resolveLogLabel,
} = require('../../../src/api/lib/logging')

describe('resolveLogLevel', () => {
    // LOG_LEVEL wins; otherwise only explicit development is verbose.
    const cases = [
        { env: { NODE_ENV: 'development' }, level: 'debug' },
        { env: { NODE_ENV: 'production' }, level: 'info' },
        { env: {}, level: 'info' },
        { env: { NODE_ENV: 'staging' }, level: 'info' },
        { env: { LOG_LEVEL: 'warn', NODE_ENV: 'development' }, level: 'warn' },
        { env: { LOG_LEVEL: 'error', NODE_ENV: 'production' }, level: 'error' },
    ]
    for (const { env, level } of cases) {
        test(`${JSON.stringify(env)} -> ${level}`, () => {
            assert.equal(resolveLogLevel(env), level)
        })
    }
})

describe('resolveLogLabel', () => {
    const cases = [
        { env: { NODE_ENV: 'development' }, label: 'DEV' },
        { env: { NODE_ENV: 'production' }, label: 'PROD' },
        { env: {}, label: 'PROD' },
        { env: { NODE_ENV: 'staging' }, label: 'PROD' },
    ]
    for (const { env, label } of cases) {
        test(`${JSON.stringify(env)} -> ${label}`, () => {
            assert.equal(resolveLogLabel(env), label)
        })
    }
})

describe('no console.* logging bypasses in src/api (L8)', () => {
    const apiDir = path.join(__dirname, '..', '..', '..', 'src', 'api')

    function jsFiles(dir) {
        const out = []
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name)
            if (entry.isDirectory()) out.push(...jsFiles(full))
            else if (entry.name.endsWith('.js')) out.push(full)
        }
        return out
    }

    // Route/handler code must log through the redacting winston logger, not
    // console.*, which bypasses redaction and the configured level.
    const CONSOLE_RE = /console\.(log|error|warn|info)\s*\(/
    // models/index.js is the one justified exception: the logger module depends
    // on it (logging -> auth -> models), so it cannot require the logger.
    const EXEMPT = new Set(['models/index.js'])

    // Strip line comments so commented-out console.* lines don't trip the guard.
    const stripComments = src =>
        src
            .split('\n')
            .map(line => line.replace(/\/\/.*$/, ''))
            .join('\n')

    for (const file of jsFiles(apiDir)) {
        const rel = path.relative(apiDir, file)
        if (EXEMPT.has(rel)) continue
        test(`${rel} has no console.* call`, () => {
            const src = stripComments(fs.readFileSync(file, 'utf8'))
            const match = src.match(CONSOLE_RE)
            assert.equal(match, null, match && `found ${match[0]}`)
        })
    }
})
