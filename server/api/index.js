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
            db.getCompanies(function(answer) {
                reply(answer);
            });
        }
    });
    server.route({
        method: 'POST',
        path: '/company',
        handler: function (request, reply) {
            var company = {
                email:request.payload.email,
                password:request.payload.password,
                name:request.payload.name,
                description:request.payload.description
            };
            if(company.email && company.password && company.name && company.description){
                 db.cryptPassword(company.password,function (err,hash) {
                     if(!err){
                         company.password = hash;
                         db.createCompany(company,function(answer) {
                             reply(answer);
                         });
                     }
                 });
            } else {
                reply({code: "rejected", msg: "Wrong values provided"});
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/company/{id}',
        handler: function (request, reply) {
            db.getCompany(request.params.id, function(answer) {
                reply(answer);
            });
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
                 db.cryptPassword(student.password,function (err,hash) {
                     if(!err){
                         student.password = hash;
                         db.createStudent(student,function(answer) {
                             reply(answer);
                         });
                     }
                 });
            } else {
                reply({code: "rejected", msg: "Wrong values provided"});
            }
        }
    });
    server.route({
        method: 'POST',
        path: '/student/login',
        handler: function (request, reply) {
            if(request.payload.email && request.payload.password){
                db.checkStudentLogin(request.payload.email,request.payload.password,function(answer) {
                    reply(answer);
                });
            } else {
                reply({code: "rejected", msg: "Wrong values provided"});
            }
        }
    });
    server.route({
        method: 'POST',
        path: '/student/email',
        handler: function (request, reply) {
            if(request.payload.email){
                db.checkStudentEmailNotUsed(request.payload.email,function(answer) {
                    if(answer){
                        answer = {code: "accepted",msg: "Email not used"};
                        reply(answer);
                    }
                    else {
                        answer = {code: "rejected",msg: "Email on use"};
                        reply(answer);
                    }
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
