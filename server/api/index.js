'use strict';

const db = require('../common/db.js');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply({ version: '1.0' });
        }
    });
    server.route({
        method: 'GET',
        path: '/company',
        handler: function (request, reply) {

            reply({ message: 'Company.' });
        }
    });
    server.route({
        method: 'GET',
        path: '/company/{id}',
        handler: function (request, reply) {

            reply({ message: 'Company ' + request.params.id + '.' });
        }
    });
    server.route({
        method: 'GET',
        path: '/student',
        handler: function (request, reply) {
            db.getStudent(0, function(answer) {
                reply(answer);
            });
        }
    });
    server.route({
        method: 'GET',
        path: '/student/{id}',
        handler: function (request, reply) {

            reply({ message: 'Student ' + request.params.id + '.' });
        }
    });
    server.route({
        method: 'GET',
        path: '/internship',
        handler: function (request, reply) {

            reply({ message: 'Internship.' });
        }
    });
    server.route({
        method: 'GET',
        path: '/internship/{id}',
        handler: function (request, reply) {

            reply({ message: 'Internship ' + request.params.id + '.' });
        }
    });

    next();
};


exports.register.attributes = {
    name: 'api'
};
