'use strict';

const conf =  {
    development : {
        serverPort : 3000,
        databaseClient : 'pg',
        databasePort : 5432,
        databaseHost : '127.0.0.1',
        databaseUser : 'postgres',
        databasePassword : 'postgres',
        database : 'internships',
        databaseSSL : false,
        timezone: 'utc'
    },
    production : {
        serverPort : process.env.PORT,
        databaseClient : 'pg',
        databasePort : 5432,
        databaseHost : 'ec2-23-21-255-14.compute-1.amazonaws.com',
        databaseUser : 'amoevggxdixlmo',
        databasePassword : '5u8fuNKnM-HEYF9EwxPn29k-LK',
        database : 'dae6v3s4ebol8p',
        databaseSSL : true,
        timezone: 'utc'
    }
}

module.exports = conf[process.env.NODE_ENV || 'development'];