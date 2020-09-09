const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const session = require('express-session')
const pgsimple = require('connect-pg-simple')
const Keycloak = require('keycloak-connect')
const next = require('next')
const { requestLogger, errorLogger } = require('./logging')
const config = require('./config.json')
const { getUserID, getUserToken } = require('./auth')
const models = require('./models');
const User = models.account_user;
const PortalAPI = require('./apiClient')

const app = next({ dev: process.env.NODE_ENV !== 'production' })
const nextHandler = app.getRequestHandler()

// Configure the session store
const pgSession = pgsimple(session)
const sessionStore = new pgSession({
    conString: `postgresql://${config.db.user ? config.db.user + '@' : ''}${config.db.host}:5432/${config.db.database}`, 
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

        // Support CORS requests -- needed for service icon image requests
        server.use(cors())

        // Support JSON encoded request bodies
        server.use(bodyParser.json())

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

        // Configure Express behind SSL proxy: https://expressjs.com/en/guide/behind-proxies.html 
        // Also set "proxy_set_header X-Forwarded-Proto https;" in NGINX config
        server.set('trust proxy', true)

        if (config.debugUser) {
            console.log('!!!!!!!!! RUNNING IN DEBUG MODE AS USER', config.debugUser, '!!!!!!!!!!')
            server.use(async (req, res, next) => {
                const user = await User.findOne({ where: { username: config.debugUser } })
                req.user = JSON.parse(JSON.stringify(user.get({ plain: true })))
                req.api = new PortalAPI({ baseUrl: config.apiBaseUrl, token: null })
                next()
            })
        }
        else {
            // Handle Keycloak authorization flow
            server.use(keycloakClient.middleware())

            // Require authentication on all routes/pages
            server.use(keycloakClient.protect())

            // Middleware to add some global state
            server.use(async (req, _, next) => {
                // Prefetch user since used in almost all pages/endpoints
                const id = getUserID(req)
                if (id) {
                    const user = await User.findOne({ where: { username: id } })
                    req.user = JSON.parse(JSON.stringify(user.get({ plain: true })))
                    //if (!req.user) ... //TODO
                }

                // Setup an API client for use by getServerSideProps()
                const token = getUserToken(req)
                if (token) {
                    req.api = new PortalAPI({ baseUrl: config.apiBaseUrl, token: token.token })
                }

                next()
            })
        }

        // API routes
        server.use('/api/users', require('./api/users'))
        server.use('/api/services', require('./api/services'))
        server.use('/api/workshops', require('./api/workshops'))
        server.use('/api/forms', require('./api/forms'))
        server.use('/api/mailing-lists', require('./api/mailing_lists'))
        if (config.debug) server.use('/tests', require('./api/tests'))
        server.use('/api/*', (_, res) => res.send('Resource not found').status(404))

        // Default to /services page
        server.get("/", (_, res) => {
            res.redirect("/services")
        })

        // UI routes
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
