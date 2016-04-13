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
            db.getStudents(function(answer) {
                reply(answer);
            });
        }
    });
    server.route({
        method: 'POST',
        path: '/student',
        handler: function (request, reply) {
            var student = {
                email:request.payload.email,
                password:request.payload.password,
                ieeeNumber:request.payload.ieeeNumber,
                firstName:request.payload.firstName,
                lastName:request.payload.lastName,
                birthdate:request.payload.birthdate,
                graduationYear:request.payload.graduationYear
            };
            if(student.email && student.password && student.ieeeNumber
             && student.firstName && student.lastName && student.birthdate 
             && student.graduationYear){
                 db.createStudent(student,function(answer) {
                     reply(answer);
                 });
            } else {
                reply({code: "rejected", msg: "Wrong values provided"});
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/student/{id}',
        handler: function (request, reply) {
            db.getStudent(request.params.id, function(answer) {
                reply(answer);
            });
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
