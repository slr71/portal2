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

        // Configure Keycloak
        server.use(keycloakClient.middleware({ logout: '/logout' }))

        // Middleware to add some global state
        server.use(async (req, _, next) => {
            // Setup API client for use by getServerSideProps()
            const token = getUserToken(req)
            req.api = new PortalAPI({ 
                baseUrl: config.apiBaseUrl, 
                token: token ? token.token : null 
            })

            // Prefetch user from DB since used by almost all pages/endpoints
            const userId = config.debugUser || getUserID(req)
            if (userId) {
                const user = await User.findOne({ where: { username: userId } })
                req.user = JSON.parse(JSON.stringify(user.get({ plain: true })))
            }

            if (config.debugUser)
                console.log('!!!!!!!!! RUNNING IN DEBUG MODE AS USER', config.debugUser, '!!!!!!!!!!')

            next()
        })

        server.get("/login", keycloakClient.protect(), (_, res) => {
            res.redirect("/")
        })

        // Default to landing page if not logged in
        server.get("/", keycloakClient.checkSso(), (req, res) => {
            if (!req.user)
                app.render(req, res, "/welcome")
            else
                res.redirect("/services")
        })

        // Public static files
        server.get("/:path(*.svg)", (req, res) => {
            return nextHandler(req, res)
        })

        // Public API routes
        server.use('/api', require('./api/public'))
        if (config.debug) server.use('/tests', require('./api/tests'))

        // Require auth on all routes/page after this
        server.use((req, res, next) => {
            if (!config.debugUser)
                keycloakClient.protect()
            next()
        })

        // Restricted API routes 
        server.use('/api/users', require('./api/users'))
        server.use('/api/services', require('./api/services'))
        server.use('/api/workshops', require('./api/workshops'))
        server.use('/api/forms', require('./api/forms'))
        server.use('/api/mailing-lists', require('./api/mailing_lists'))
        server.use('/api/*', (_, res) => res.send('Resource not found').status(404))

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
