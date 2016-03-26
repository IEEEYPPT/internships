'use strict';

const Composer = require('./index');
const DB = require('./server/common/db.js');

Composer((err, server) => {

    if (err) {
        throw err;
    }

    server.start(() => {
        console.log('Started the plot device on port ' + server.info.port);
    });
});
