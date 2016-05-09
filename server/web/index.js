'use strict';


const Inert = require('inert');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            return reply.view('./views/index');
        }
    });
    server.route({
        method: 'GET',
        path: '/student/register',
        handler: function (request, reply) {
            return reply.view('./views/student/register');
        }
    });
    server.route({
        method: 'GET',
        path: '/student/profile',
        handler: function (request, reply) {
            return reply.view('./views/student/profile');
        }
    });
    server.route({
        method: 'GET',
        path: '/internships/list',
        handler: function (request, reply) {
            return reply.view('./views/internships/list');
        }
    });
    next();
};


exports.register.attributes = {
    name: 'web',
    dependencies: 'visionary'
};
