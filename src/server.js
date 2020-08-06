const express = require('express')
const cors = require('cors')
const session = require('express-session')
const pgsimple = require('connect-pg-simple')
const Keycloak = require('keycloak-connect')
const next = require('next')
const { getUserToken } = require('./auth')
const { PortalApi } = require('./api')
const { requestLogger, errorLogger } = require('./logging')
const config = require('./config.json')

const app = next({
    dev: true //TODO load from ENV
})
const nextHandler = app.getRequestHandler()

// Configure the session store
const pgSession = pgsimple(session)
const sessionStore = new pgSession({
    conString: config.db.connection,
    tableName: config.db.table,
    ttl: config.session.ttl
})

// Configure the Keycloak client
const keycloakClient = new Keycloak(
    {
        store: sessionStore
    },
    config.keycloak
)

app.prepare()
    .then(() => {
        const server = express()

        // Handle CORS requests
        server.use(cors())

        // Setup Express behind SSL proxy: https://expressjs.com/en/guide/behind-proxies.html 
        // Also set "proxy_set_header X-Forwarded-Proto https;" in NGINX config
        server.set('trust proxy', true);

        // Setup logging
        server.use(errorLogger)
        server.use(requestLogger)

        // Configure sessions
        server.use(
            session({
                store: sessionStore,
                secret: config.session.secret,
                resave: false,
                saveUninitialized: true,
                cookie: {
                    secure: config.session.secureCookie,
                }
            })
        )

        // Handle Keycloak authorization flow
        server.use(keycloakClient.middleware())

        server.get("/login", keycloakClient.protect(), (req, res, next) => {
            console.log('/login:', req.params)
            res.redirect("/services")
        })

        server.use(async (req, res, next) => {
            const token = getUserToken(req)
            if (token) {
                if (!req.user) {
                    req.api = new PortalApi({ baseUrl: config.apiBaseUrl, token: token.token })
                    //req.user = await req.api.user() //(null, { headers: { 'Authorization': `Bearer ${token}` }})
                    //console.log('user:', req.user.username)
                    next()
                }
            }
            else {
                res.redirect("/login")
            }
        })

        server.get("*", (req, res) => {
            return nextHandler(req, res)
        })

        server.listen(config.port, (err) => {
            if (err) throw err
            console.log(`Ready on port ${config.port}`)
        })
    })
    .catch(exception => {
        // logger.error(exception)
        console.log(exception)
        process.exit(1)
    })
