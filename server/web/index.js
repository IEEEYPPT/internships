'use strict';

const Inert = require('inert');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            return reply.view('./views/app/index');
        }
    });
    server.route({
        method: 'GET',
        path: '/signin',
        handler: function (request, reply) {
            return reply.view('./views/app/signin');
        }
    });
    server.route({
        method: 'GET',
        path: '/register',
        handler: function (request, reply) {
            return reply.view('./views/app/register');
        }
    });
    server.route({
        method: 'GET',
        path: '/error',
        handler: function (request, reply) {
            return reply.view('./views/app/error');
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
        path: '/student/editProfile',
        handler: function (request, reply) {
            return reply.view('./views/student/editProfile');
        }
    });
    server.route({
        method: 'GET',
        path: '/student/internships',
        handler: function (request, reply) {
            return reply.view('./views/student/internships');
        }
    });
    server.route({
        method: 'GET',
        path: '/student/list',
        handler: function (request, reply) {
            return reply.view('./views/student/listStudents');
        }
    });

    server.route({
        method: 'GET',
        path: '/internship/list',
        handler: function (request, reply) {
            return reply.view('./views/internship/listInternships');
        }
    });

    server.route({
        method: 'GET',
        path: '/company/profile',
        handler: function (request, reply) {
            return reply.view('./views/company/profile');
        }
    });
    server.route({
        method: 'GET',
        path: '/company/list',
        handler: function (request, reply) {
            return reply.view('./views/company/listCompanies');
        }
    });
    next();
};


exports.register.attributes = {
    name: 'web',
    dependencies: 'visionary'
};
