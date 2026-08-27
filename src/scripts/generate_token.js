#!/usr/bin/env node
const { generateToken } = require('../api/lib/hmac')
const { readSecret } = require('./readSecret')

readSecret({ envVar: 'TOKEN_KEY', prompt: 'Key: ' })
    .then(key => {
        if (!key) {
            console.error('No key provided (set TOKEN_KEY or pipe via stdin)')
            process.exit(1)
        }
        console.log(generateToken(key))
    })
    .catch(err => {
        console.error(err.message)
        process.exit(1)
    })
