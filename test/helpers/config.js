const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const CONFIG_MODULE = require.resolve('../../src/api/lib/config')
const BASE_CONFIG_PATH = path.join(
    __dirname,
    '..',
    'fixtures',
    'portal2.test.json'
)

const tempDirs = []
process.on('exit', () => {
    for (const dir of tempDirs) fs.rmSync(dir, { recursive: true, force: true })
})

/** Returns a fresh mutable copy of the base test configuration. */
function baseConfig() {
    return JSON.parse(fs.readFileSync(BASE_CONFIG_PATH, 'utf8'))
}

/**
 * Writes a configuration to a temporary file and returns its path.
 * Accepts an object, or a raw string for malformed-JSON cases.
 */
function writeConfig(config) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'portal2-test-'))
    tempDirs.push(dir)
    const configPath = path.join(dir, 'portal2.json')
    fs.writeFileSync(
        configPath,
        typeof config === 'string' ? config : JSON.stringify(config, null, 2)
    )
    return configPath
}

/**
 * Loads a fresh copy of the config singleton bound to the given file.
 * ConfigManager reads CONFIG_PATH in its constructor and caches its state, so
 * both the environment variable and the module cache have to be reset.
 */
function loadConfig(configPath) {
    process.env.CONFIG_PATH = configPath || BASE_CONFIG_PATH
    delete require.cache[CONFIG_MODULE]
    return require(CONFIG_MODULE)
}

/**
 * Loads a fresh copy of a module along with a fresh config it will bind to.
 * Pass an absolute path, e.g. require.resolve('../../../src/api/lib/hmac').
 */
function loadModule(resolvedPath, configPath) {
    loadConfig(configPath)
    delete require.cache[resolvedPath]
    return require(resolvedPath)
}

module.exports = {
    BASE_CONFIG_PATH,
    baseConfig,
    writeConfig,
    loadConfig,
    loadModule,
}
