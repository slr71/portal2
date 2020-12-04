const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const session = require('express-session')
const pgsimple = require('connect-pg-simple')
const Keycloak = require('keycloak-connect')
const next = require('next')
const { requestLogger, errorLogger } = require('./api/lib/logging')
const config = require('./config.json')
const { WS_CONNECTED } = require('./constants')
const { getUserID, getUserToken } = require('./api/lib/auth')
const PortalAPI = require('./lib/apiClient')
const ws = require('ws')

const isDevelopment = process.env.NODE_ENV !== 'production'
const app = next({ dev: isDevelopment })
const nextHandler = app.getRequestHandler()

// Configure the session store
const pgSession = pgsimple(session)
const sessionStore = new pgSession({
    conString: `postgresql://${config.db.user ? config.db.user + '@' : ''}${config.db.host}:5432/${config.db.database}`, 
    tableName: config.db.sessionTable,
    ttl: config.session.ttl,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
})

// Configure the Keycloak client
const keycloakClient = new Keycloak(
    { store: sessionStore },
    config.keycloak
)

// Configure web socket server
const wsServer = new ws.Server({ port: config.wsPort })
const sockets = {}
wsServer.on('connection', (ws, req) => {
    const username = req.url.substr(1) //TODO consider using express-ws package for routing
    console.log(`Connection from username=${username} ip=${req.connection.remoteAddress} key=${req.headers['sec-websocket-key']}`)

    sockets[username] = ws

    // ws.on('message', (message) => {
    //     console.log('Socket received:', message)
    // })

    ws.send(JSON.stringify({ 
        type: WS_CONNECTED,
        data: {
            key: req.headers['sec-websocket-key']
        }
    }))
})

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

        // For "sign in" button on landing page
        server.get("/login", keycloakClient.protect(), (_, res) => {
            res.redirect("/")
        })

        // Public static files
        server.get("/*.(svg|ico|png|gif|jpg)", (req, res) => {
            return nextHandler(req, res)
        })

        //if (isDevelopment) 
            server.get("/_next/*", (req, res) => {
                return nextHandler(req, res)
            })
        //else
        //    server.get("/_next/static/*", (req, res) => {
        //        return nextHandler(req, res)
        //    })

        // Setup API client for use by getServerSideProps()
        server.use(async (req, _, next) => {
            const token = getUserToken(req)
            req.api = new PortalAPI({ 
                baseUrl: config.apiBaseUrl, 
                token: token ? token.token : null 
            })
            next()
        })

        // Save web socket handle
        server.use((req, _, next) => {
            const username = getUserID(req)
            req.ws = sockets[username]
            next()
        })

        // Default to landing page if not logged in
        server.get("/", keycloakClient.checkSso(), (req, res) => {
            const token = getUserToken(req)
            if (token)
                res.redirect("/services")
            else
                app.render(req, res, "/welcome")
        })

        // Public UI pages
        server.get("/password", (req, res) => { 
            app.render(req, res, "/password")
        })

        server.get("/confirm_email", (req, res) => { 
            app.render(req, res, "/confirm_email")
        })

        // Public API routes
        server.use('/api', require('./api/public'))
        if (isDevelopment) server.use('/api/tests', require('./api/tests'))

        // Restricted API routes 
        server.use('/api/users', keycloakClient.checkSso(), require('./api/users'))
        server.use('/api/services', keycloakClient.checkSso(), require('./api/services'))
        server.use('/api/workshops', keycloakClient.checkSso(), require('./api/workshops'))
        server.use('/api/forms', keycloakClient.checkSso(), require('./api/forms'))
        server.use('/api/mailing_lists', keycloakClient.checkSso(), require('./api/mailing_lists'))
        server.use('/api/*', (_, res) => res.send('Resource not found').status(404))

        // Require auth on all routes/page after this
        if (!config.debugUser) server.use(keycloakClient.protect())

        // Restricted UI pages
        server.get("*", (req, res) => {
            return nextHandler(req, res)
        })

        // Catch errors
        server.use(errorHandler)

        server.listen(config.port, (err) => {
            if (err) throw err
            if (isDevelopment)
                console.log('!!!!!!!!! RUNNING IN DEV MODE !!!!!!!!!!')
            if (config.debugUser)
                console.log('!!!!!!!!! EMULATING USER', config.debugUser, '!!!!!!!!!!')
            console.log(`Ready on port ${config.port}`)
        })
    })
    .catch(exception => {
        // logger.error(exception)
        console.log(exception)
        process.exit(1)
    })

function errorHandler(error, req, res) {
    console.log("ERROR ".padEnd(80, "!"));
    console.log(error.stack);

    const statusCode = error.statusCode || 500;
    const message = error.message || "Unknown error";

    res.status(statusCode).send(message);
}