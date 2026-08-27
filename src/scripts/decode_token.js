#!/usr/bin/env node
const { decodeToken } = require('../api/lib/hmac')
const { readSecret } = require('./readSecret')

readSecret({ envVar: 'HMAC_TOKEN', prompt: 'Token: ' })
    .then(token => {
        if (!token) {
            console.error(
                'No token provided (set HMAC_TOKEN or pipe via stdin)'
            )
            process.exit(1)
        }
        console.log(decodeToken(token))
    })
    .catch(err => {
        console.error(err.message)
        process.exit(1)
    })
