const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pgsimple = require('connect-pg-simple');
const Keycloak = require('keycloak-connect');
const next = require('next');
const config = require('./config.json');


const app = next({
    dev: true //TODO load from ENV
});
const nextHandler = app.getRequestHandler();


// Configure the session store
const pgSession = pgsimple(session);
const sessionStore = new pgSession({
    conString: config.db.connection,
    tableName: config.db.table,
    ttl: config.session.ttl
});


// Configure the Keycloak client
const keycloakClient = new Keycloak(
    {
        store: sessionStore
    },
    config.keycloak
);


app.prepare()
    .then(() => {
        const server = express();

        server.use(cors());

        // server.enable("trust proxy");

        // server.use(errorLogger);
        // server.use(requestLogger);

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
        );

        server.use(keycloakClient.middleware());

        server.get("/login", keycloakClient.protect(), (req, res) => {
            const accessToken = ( req && req.kauth && req.kauth.grant ? req.kauth.grant.access_token : null );
            console.log('token:', accessToken);

            app.render(req, res, "/loggedin");
        });

        // server.get("/login/*", keycloakClient.protect(), (req, res) => {
        //     res.redirect(req.url.replace(/^\/login/, ""));
        // });

        server.get("/users", keycloakClient.checkSso(), (req, res) => {
            app.render(req, res, "/users");
        });

        server.get("*", (req, res) => {
            return nextHandler(req, res);
        });

        server.listen(config.port, (err) => {
            if (err) throw err;
            console.log(`Ready on http://localhost:${config.port}`);
        });
    })
    .catch(exception => {
        // logger.error(exception);
        console.log(exception);
        process.exit(1);
    });