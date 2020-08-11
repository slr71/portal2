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

const app = next({ dev: process.env.NODE_ENV != 'production' })
const nextHandler = app.getRequestHandler()

// Configure the session store
const pgSession = pgsimple(session)
const sessionStore = new pgSession({
    conString: config.db.connection,
    tableName: config.db.sessionTable,
    ttl: config.session.ttl,
    //cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
})

// Configure the Keycloak client
const keycloakClient = new Keycloak(
    { store: sessionStore },
    config.keycloak
)

app.prepare()
    .then(() => {
        const server = express()

        // Setup logging
        server.use(errorLogger)
        server.use(requestLogger)

        // Support CORS requests
        server.use(cors())

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

        // Setup Express behind SSL proxy: https://expressjs.com/en/guide/behind-proxies.html 
        // Also set "proxy_set_header X-Forwarded-Proto https;" in NGINX config
        server.set('trust proxy', true);

        // Handle Keycloak authorization flow
        server.use(keycloakClient.middleware())

        server.use(keycloakClient.protect(), async (req, res, next) => {
            const token = getUserToken(req)
            if (token) {
                if (!req.api || req.api.token != token) {
                    req.api = new PortalApi({ baseUrl: config.apiBaseUrl, token: token.token })
                    // if (!req.user)
                    //     req.user = await req.api.user() //(null, { headers: { 'Authorization': `Bearer ${token}` }})
                    //console.log('user:', req.user.username)
                    next()
                }
            }
        })

        server.get("/", (req, res) => {
            res.redirect("/services") //app.render(req, res, "/services")
        });

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
