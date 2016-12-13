'use strict';

const DatabaseFunctions = require('./../../database/functions.js');
const UtilsFunctions = require('./../../utils/functions.js');
const uuidV4 = require('uuid/v4');

module.exports = function(server) {

    server.route({
        method: 'GET',
        path: '/',
        config: {
            handler: function (request, reply) {
                var data = {
                    title: "What is the IEEE Young Professionals Internship Program?",
                    authenticated: request.auth.isAuthenticated
                }
                reply.view("index",data);
            },   
            plugins: { 'hapi-auth-cookie': { redirectTo: false }},
            auth: {
                mode: 'try'
            }
        }
    });

    server.route({
        method: ['GET','POST'],
        path: '/login',
        config: {
            auth: { mode: 'try' }, 
            plugins: { 'hapi-auth-cookie': { redirectTo: false }} ,
            handler: function (request, reply) {
                if (request.auth.isAuthenticated) {
                    return reply.redirect('/');
                }
                if(request.method === 'post'){
                    if(request.payload.email && request.payload.password){
                        DatabaseFunctions.checkStudentLogin(request.payload.email,request.payload.password,function(answer) {
                            if(answer.code == 200){
                                const uuid = uuidV4();
                                request.server.app.cache.set(uuid, {type:'student', id:answer.student}, 0, (err) => {

                                    if (err) {
                                        reply(err);
                                    }

                                    request.cookieAuth.set({ uuid: uuid});
                                    return reply.redirect('/');
                                });
                            } else {
                                var data = {
                                    title: "Sign in",
                                    errors: [{message:"Wrong email/password"}]
                                }
                                return reply.view("login",data);    
                            }
                        });
                    } else {
                        var data = {
                            title: "Sign in",
                            errors: [{message:"Missing email/password"}]
                        }
                        return reply.view("login",data);
                    }
                } else {
                    var data = {
                        title: "Sign in"
                    };
                    return reply.view("login",data);
                }
            }
        }
    });

    server.route({
        method: ['GET','POST'],
        path: '/logout',
        config: {
            handler: function(request,reply){
                request.cookieAuth.clear();
                return reply.redirect('/');
            },
            auth: { mode: 'try' }
        }
    });

    server.route({
        method: ['GET','POST'],
        path: '/register',
        config: {
            auth: { mode: 'try' }, 
            plugins: { 'hapi-auth-cookie': { redirectTo: false }} ,
            handler: function (request, reply) {
                if (request.auth.isAuthenticated) {
                    return reply.redirect('/');
                }
                var errors = [];
                if(request.method === 'post'){
                    if(request.payload.password){
                        UtilsFunctions.cryptPassword(request.payload.password,function(err,hash){
                            if(!err){
                                request.payload.password = hash;
                                DatabaseFunctions.createStudent(request.payload,function(result){
                                    if(result.code == 201){
                                        return reply.redirect("/");
                                    } else {
                                        errors.push({message: "Missing, wrong or already used values"});
                                        DatabaseFunctions.getCities(function(cities){
                                            DatabaseFunctions.getStudentBranchs(function(sbs){     
                                                var data = {
                                                    title: "Register",
                                                    cities: cities.message,
                                                    sbs: sbs.message,
                                                    errors: errors
                                                };
                                                return reply.view("register",data);
                                            })
                                        });                       
                                    }
                                })
                            } else {
                                errors.push({message: "Missing, wrong or already used values"});
                                DatabaseFunctions.getCities(function(cities){
                                    DatabaseFunctions.getStudentBranchs(function(sbs){     
                                        var data = {
                                            title: "Register",
                                            cities: cities.message,
                                            sbs: sbs.message,
                                            errors: errors
                                        };
                                        return reply.view("register",data);
                                    })
                                });
                            }
                        })
                    } else {
                        errors.push({message: "Missing, wrong or already used values"});
                        DatabaseFunctions.getCities(function(cities){
                            DatabaseFunctions.getStudentBranchs(function(sbs){     
                                var data = {
                                    title: "Register",
                                    cities: cities.message,
                                    sbs: sbs.message,
                                    errors: errors
                                };
                                return reply.view("register",data);
                            })
                        });     
                    }   
                } else {                
                    DatabaseFunctions.getCities(function(cities){
                        DatabaseFunctions.getStudentBranchs(function(sbs){     
                            var data = {
                                title: "Register",
                                cities: cities.message,
                                sbs: sbs.message,
                                errors: errors
                            };
                            return reply.view("register",data);
                        })
                    });
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/profile',
        config: {
            handler: function (request,reply){
                DatabaseFunctions.getStudent(request.auth.credentials.id, function(answer){
                    if(answer.code == 200){
                        var data = {
                            authenticated: request.auth.isAuthenticated,
                            student: answer.message
                        }
                        data.student.birthdate = new Date(data.student.birthdate);
                        data.student.birthdate = data.student.birthdate.toLocaleDateString();
                        DatabaseFunctions.getStudentBranch(data.student.student_branch_id,function(answer){
                            if(answer.code == 200){
                                data.student.student_branch_name = answer.message.name;
                                DatabaseFunctions.getCity(data.student.city_id,function(answer){
                                    if(answer.code == 200){
                                        data.student.city_name = answer.message.name;
                                        return reply.view("profile",data);
                                    } else {
                                        data.errors = [{message:"Couldn't fetch student data"}];
                                        return reply.view("profile",data);
                                    }
                                });
                            } else {
                                data.errors = [{message:"Couldn't fetch student data"}];
                                return reply.view("profile",data);
                            }
                        });
                    } else {
                        var data = {
                            authenticated: request.auth.isAuthenticated,
                            errors: [{message:"Couldn't fetch student data"}]
                        }
                        return reply.view("profile",data);
                    }
                })
            }
        }
    })

    server.register(require('inert'), (err) => {

        if (err) {
            throw err;
        }

        server.route({
            method: 'GET',
            path: '/public/{param*}',
            handler: {
                directory: { path: (__dirname + './../../public') }
            },
            config: {
                auth: false
            }
        });

    });

};