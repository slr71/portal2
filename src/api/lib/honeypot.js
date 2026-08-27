const config = require('./config')

// Encodes a signup field's role (modulus) into a numeric field id such that
// (id % divisor) === modulus, using the server-only honeypot divisor. The
// signup page renders real fields under these ids and public.js decodes them
// the same way. Keeping the divisor server-side (out of publicRuntimeConfig)
// means a client script can't derive which ids are real vs. honeypot, or forge
// correctly-encoded ids, from a shipped config value.
//
// modulus 1 => first_name, 2 => last_name, 0 => a honeypot (fake) field.
function honeypotFieldId(modulus) {
    const divisor = config.getHoneypotConfig().divisor
    return (divisor * Math.floor(Math.random() * 1000) + modulus).toString()
}

module.exports = { honeypotFieldId }
