'use strict';

const Conf = require('./config/index.js');

module.exports = {
    client: Conf.databaseClient,
    connection: {
        host: Conf.databaseHost,
        user: Conf.databaseUser,
        password: Conf.databasePassword,
        database: Conf.database,
        port: Conf.databasePort,
        ssl: Conf.databaseSSL
    }
};