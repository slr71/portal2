#!/usr/bin/env node

/**
 * Password hashing utility for Portal Conductor authentication
 *
 * This utility generates bcrypt hashes for passwords to be used in
 * the portalConductor.auth.password configuration field.
 *
 * Usage:
 *   node src/scripts/hash_password.js <password>
 *
 * Example:
 *   node src/scripts/hash_password.js mypassword123
 */

const bcrypt = require('bcrypt')
const { readSecret } = require('./readSecret')

/**
 * Generate a bcrypt hash for the given password
 * @param {string} password - The plaintext password to hash
 * @returns {string} The bcrypt hash
 */
function generatePasswordHash(password) {
    const saltRounds = 12 // Same as portal-conductor default
    return bcrypt.hashSync(password, saltRounds)
}

/**
 * Main function. Reads the password from the PASSWORD env var or stdin (never
 * argv, so it isn't exposed in `ps`/shell history) and never echoes it back.
 */
async function main() {
    const password = await readSecret({
        envVar: 'PASSWORD',
        prompt: 'Password: ',
    })

    if (!password) {
        console.error(
            'Error: no password provided (set PASSWORD or pipe via stdin)'
        )
        process.exit(1)
    }

    try {
        const hash = generatePasswordHash(password)
        console.log(hash)
        console.error('')
        console.error('Copy this hash to portalConductor.auth.password in your')
        console.error('portal2.json, and set PORTAL_CONDUCTOR_PASSWORD to the')
        console.error('original password.')
    } catch (error) {
        console.error(`Error generating hash: ${error.message}`)
        process.exit(1)
    }
}

// Run the script if called directly
if (require.main === module) {
    main()
}

module.exports = {
    generatePasswordHash,
}
