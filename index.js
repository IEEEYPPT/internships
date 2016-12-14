'use strict';

const Hapi = require('hapi');
const Path = require('path');
const Hoek = require('hoek');
const HapiAuthCookie = require('hapi-auth-cookie');
const Config = require('./config/index.js');
const Database = require('./database/index.js');

const server = new Hapi.Server();
server.connection({ port: Config.serverPort });

server.register(HapiAuthCookie, (err) => {
    const cache = server.cache({ segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 });
    server.app.cache = cache;

    server.auth.strategy('session', 'cookie', true, {
        password: 'password-should-be-32-characters',
        cookie: 'sid-internships',
        redirectTo: '/login',
        isSecure: false,
        ttl: 3 * 24 * 60 * 60 * 1000,
        validateFunc: function (request, session, callback) {

            cache.get(session.uuid, (err, cached) => {
                if (err) {
                    return callback(err, false);
                }

                if (!cached) {
                    return callback(null, false);
                }

                return callback(null, true, cached);
            });
        }
    });
});

server.register(require('vision'), (err) => {

    Hoek.assert(!err, err);

    server.views({
        engines: {
            html: require('handlebars')
        },
        compileMode: 'sync',
        relativeTo: __dirname,
        path: 'views',
        layout: 'default',
        layoutPath: Path.join(__dirname, 'views/layout'),
        helpersPath: 'views/helpers',
        partialsPath: 'views/partials'
    });
    
    require('./routes/web/index.js')(server);
    require('./routes/api/index.js')(server);
});


server.start((err) => {

    if (err) {
        throw err;
    }

    console.log('Server running at:', server.info.uri);

});