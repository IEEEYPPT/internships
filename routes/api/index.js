'use strict';

const DatabaseFunctions = require('./../../database/functions.js');
const UtilFunctions = require('./../../utils/functions.js');

module.exports = function(server) {
    
    const prefix = '/api';

    server.route({
        method: 'GET',
        path: prefix,
        handler: function (request, reply) {
            reply({version:1.0});
        }
    });

    server.route({
        method: 'GET',
        path: prefix + '/student',
        handler: function (request, reply) {
            DatabaseFunctions.getStudents(function(answer){
                reply(answer);
            });
        }
    });

    server.route({
        method: 'POST',
        path: prefix + '/student',
        handler: function (request, reply) {
            if(request.payload.email && request.payload.password && request.payload.ieeeNumber
             && request.payload.firstName && request.payload.lastName && request.payload.birthdate 
             && request.payload.graduationYear){
                 
                 UtilFunctions.cryptPassword(request.payload.password,function (err,hash) {
                     if(!err){
                         var student = {
                             email:request.payload.email,
                             password:request.payload.password,
                             ieee_code:request.payload.ieeeNumber,
                             first_name:request.payload.firstName,
                             last_name:request.payload.lastName,
                             birthdate:request.payload.birthdate,
                             graduation_year:request.payload.graduationYear
                         };
                         student.password = hash;
                         if(request.payload.studentBranchId){
                             student.student_branch_id = request.payload.studentBranchId;
                         }
                         if(request.payload.cityId){
                             student.city_id = request.payload.cityId;
                         }
                         if(request.payload.collabratec){
                             student.collabratec = request.payload.collabratec;
                         }
                         if(request.payload.linkedIn){
                             student.linkedin = request.payload.linkedIn;
                         }
                         if(request.payload.bio){
                             student.bio = request.payload.bio;
                         }
                         if(request.payload.area){
                             student.area = request.payload.area;
                         }
                         DatabaseFunctions.createStudent(student,function(answer) {
                             reply(answer);
                         });
                     }
                 });
            } else {
                reply({code: 400, message: "Missing or invalid arguments"});
            }
        }
    });

    server.route({
        method: 'GET',
        path: prefix + '/student/{id}',
        handler: function (request, reply) {
            DatabaseFunctions.getStudent(request.params.id, function(answer){
                reply(answer);
            });
        }
    });

    server.route({
        method: 'GET',
        path: prefix + '/company',
        handler: function (request, reply) {
            DatabaseFunctions.getCompanies(function(answer){
                reply(answer);
            });
        }
    });

    server.route({
        method: 'GET',
        path: prefix + '/company/{id}',
        handler: function (request, reply) {
            DatabaseFunctions.getCompany(request.params.id, function(answer){
                reply(answer);
            });
        }
    });

    server.route({
        method: 'GET',
        path: prefix + '/student_branch',
        handler: function (request, reply) {
            DatabaseFunctions.getStudentBranchs(function(answer){
                reply(answer);
            });
        }
    });

    server.route({
        method: 'GET',
        path: prefix + '/student_branch/{id}',
        handler: function (request, reply) {
            DatabaseFunctions.getStudentBranch(request.params.id, function(answer){
                reply(answer);
            });
        }
    });

    server.route({
        method: 'GET',
        path: prefix + '/city',
        handler: function (request, reply) {
            DatabaseFunctions.getCities(function(answer){
                reply(answer);
            });
        }
    });

    server.route({
        method: 'GET',
        path: prefix + '/internship',
        handler: function (request, reply) {
            DatabaseFunctions.getInternships(function(answer){
                reply(answer);
            });
        }
    });

    server.route({
        method: 'GET',
        path: prefix + '/internship/{id}',
        handler: function (request, reply) {
            DatabaseFunctions.getInternship(request.params.id, function(answer){
                reply(answer);
            });
        }
    });

};