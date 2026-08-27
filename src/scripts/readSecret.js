// Reads a secret for the operator token/password scripts without putting it on
// the command line (where it would be visible in `ps` and shell history). Uses
// the named environment variable if set, otherwise reads it from stdin (piped
// or typed until EOF). The prompt goes to stderr so stdout stays clean for the
// result.
function readSecret({
    envVar,
    prompt,
    env = process.env,
    input = process.stdin,
    output = process.stderr,
} = {}) {
    if (envVar && env[envVar]) return Promise.resolve(env[envVar])

    return new Promise((resolve, reject) => {
        if (prompt && input.isTTY) output.write(prompt)
        let data = ''
        input.setEncoding('utf8')
        input.on('data', chunk => (data += chunk))
        // Strip only the trailing newline echo/Enter adds, so a value's own
        // leading/trailing spaces (e.g. in a password) are preserved.
        input.on('end', () => resolve(data.replace(/\r?\n$/, '')))
        input.on('error', reject)
    })
}

module.exports = { readSecret }
