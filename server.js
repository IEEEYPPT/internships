'use strict';

const Composer = require('./index');
const Inert = require('inert');
const Basic = require('hapi-auth-basic');
const AuthFunctions = require('./server/common/authentication/auth.js')

Composer((err, server) => {

    if (err) {
        throw err;
    }
    
    server.register(Inert, function () {
        server.route( {
            method: 'GET',
            path: '/public/{param*}',
            handler: {
                directory: { path: (__dirname + '/server/web/public') }
            }
        });
    });

    server.start(() => {
        console.log('Started the plot device on port ' + server.info.port);
    });
});
