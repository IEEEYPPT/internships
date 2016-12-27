'use strict';

const DatabaseFunctions = require('./../../database/functions.js');
const UtilsFunctions = require('./../../utils/functions.js');
const uuidV4 = require('uuid/v4');
const Joi = require('joi');

module.exports = function(server) {

    server.route({
        method: 'GET',
        path: '/',
        config: {
            handler: function (request, reply) {
                let data = {
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
                let data = {title:"Sign in",errors:[]};
                if (request.auth.isAuthenticated) {
                    return reply.redirect('/');
                }
                else if(request.method === 'post'){
                    if(request.payload.email && request.payload.password){
                        DatabaseFunctions.checkStudentLogin(request.payload.email,request.payload.password,function(answer) {
                            if(answer.code == 200){
                                const uuid = uuidV4();
                                request.server.app.cache.set(uuid, {scope:'student', id:answer.student}, 0, (err) => {

                                    if (err) {
                                        reply(err);
                                    }

                                    request.cookieAuth.set({ uuid: uuid,scope:'student'});
                                    return reply.redirect('/');
                                });
                            } else {
                                data.errors.push({message:"Wrong email/password"});
                                return reply.view("login",data);    
                            }
                        });
                    } else {
                        data.errors.push({message:"Missing email/password"});
                        return reply.view("login",data);
                    }
                } else {
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
                let data = {title:"Register",errors:[]};
                if (request.auth.isAuthenticated) {
                    return reply.redirect('/');
                }
                if(request.method === 'post'){
                    if(request.payload.password === request.payload.check_password){
                        UtilsFunctions.cryptPassword(request.payload.password,function(err,hash){
                            if(!err){
                                request.payload.password = hash;
                                DatabaseFunctions.createStudent(request.payload,function(result){
                                    if(result.code == 201){
                                        return reply.redirect("/");
                                    } else {
                                        data.errors.push({message: "Missing, wrong or already used values"});
                                        DatabaseFunctions.getCities(function(cities){
                                            DatabaseFunctions.getStudentBranchs(function(sbs){
                                                data.sbs = sbs.message;
                                                data.cities = cities.message;
                                                return reply.view("register",data);
                                            })
                                        });                       
                                    }
                                })
                            } else {
                                data.errors.push({message: "Missing, wrong or already used values"});
                                DatabaseFunctions.getCities(function(cities){
                                    DatabaseFunctions.getStudentBranchs(function(sbs){    
                                        data.sbs = sbs.message;
                                        data.cities = cities.message;
                                        return reply.view("register",data);
                                    })
                                });
                            }
                        })
                    } else {
                        data.errors.push({message: "Passwords aren't equal"});
                        DatabaseFunctions.getCities(function(cities){
                            DatabaseFunctions.getStudentBranchs(function(sbs){    
                                data.sbs = sbs.message;
                                data.cities = cities.message;
                                return reply.view("register",data);
                            })
                        });     
                    }   
                } else {                
                    DatabaseFunctions.getCities(function(cities){
                        DatabaseFunctions.getStudentBranchs(function(sbs){    
                            data.sbs = sbs.message;
                            data.cities = cities.message;
                            return reply.view("register",data);
                        })
                    });
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/internship',
        config: {
            handler: function(request, reply){
                let data = {title: "Internships",errors:[],authenticated: request.auth.isAuthenticated};
                DatabaseFunctions.getInternships(function(internships){
                    if(internships.code == 200){
                        data.internships = internships.message;
                        return reply.view("internship/list",data);
                    } else {
                        data.errors.push({message: "Error fetching internships from database"});
                        return reply.view("internship/list",data);
                    }
                })
            }
        }
    })
    
    server.route({
        method: 'GET',
        path: '/internship/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.number().integer().required()
                }
            },
            handler: function(request, reply){
                let data = {title: "Internship",errors:[],authenticated: request.auth.isAuthenticated};
                DatabaseFunctions.getInternship(request.params.id,function(internship){
                    if(internship.code == 200){
                        data.internship = internship.message;
                        return reply.view("internship/profile",data);
                    } else {
                        data.errors.push({message: "Error fetching internship from database"});
                        return reply.view("internship/profile",data);
                    }
                })
            }
        }
    })

    server.route({
        method: 'GET',
        path: '/company',
        config: {
            handler: function(request, reply){
                let data = {title: "Companies",errors:[],authenticated: request.auth.isAuthenticated};
                DatabaseFunctions.getCompanies(function(companies){
                    if(companies.code == 200){
                        data.companies = companies.message;
                        return reply.view("company/list",data);
                    } else {
                        data.errors.push({message: "Error fetching companies from database"});
                        return reply.view("company/list",data);
                    }
                })
            }
        }
        
    })

    server.route({
        method: 'GET',
        path: '/company/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.number().integer().required()
                }
            },
            handler: function(request,reply){
                let data = {
                    authenticated: request.auth.isAuthenticated,
                    errors: []
                };
                DatabaseFunctions.getCompany(encodeURIComponent(request.params.id),function(answer){
                    if(answer.code == 200){
                        data.company = answer.message;
                        DatabaseFunctions.getCity(data.company.city_id, function(answer){
                            if(answer.code == 200){
                                data.company.city_name = answer.message.name;
                                return reply.view('company/profile',data);
                            } else {
                                data.errors = [{message:"Couldn't fetch company data"}];
                                return reply.view('company/profile',data);
                            }
                        })
                    } else {
                        data.errors = [{message:"Couldn't fetch company data"}];
                        return reply.view('company/profile',data);
                    }
                })
            }
        }
    })

    server.route({
        method: 'GET',
        path: '/company/{id}/internship',
        config: {
            validate: {
                params: {
                    id: Joi.number().integer().required()
                }
            },
            handler: function(request,reply){
                let data = {
                    authenticated: request.auth.isAuthenticated,
                    errors: []
                };
                DatabaseFunctions.getInternshipsFromCompany(encodeURIComponent(request.params.id),function(answer){
                    if(answer.code == 200){
                        data.title = answer.message[0].company_name + " internships";
                        data.internships = answer.message;
                        return reply.view('company/internships',data);
                    } else {
                        data.title = "Internships";                        
                        data.errors = [{message:"Couldn't fetch company internships data"}];
                        return reply.view('company/internships',data);
                    }
                })
            }
        }
    })

    server.route({
        method: 'GET',
        path: '/profile',
        config: {
            handler: function (request,reply){
                let data = {
                    authenticated: request.auth.isAuthenticated,
                    errors: []
                };
                DatabaseFunctions.getStudent(request.auth.credentials.id, function(answer){
                    if(answer.code == 200){
                        data.student = answer.message;
                        DatabaseFunctions.getStudentBranch(data.student.student_branch_id,function(answer){
                            if(answer.code == 200){
                                data.student.student_branch_name = answer.message.name;
                                DatabaseFunctions.getCity(data.student.city_id,function(answer){
                                    if(answer.code == 200){
                                        data.student.city_name = answer.message.name;
                                        return reply.view("student/profile",data);
                                    } else {
                                        data.errors = [{message:"Couldn't fetch student data"}];
                                        return reply.view("student/profile",data);
                                    }
                                });
                            } else {
                                data.errors.push({message:"Couldn't fetch student data"});
                                return reply.view("student/profile",data);
                            }
                        });
                    } else {
                        data.errors.push({message:"Couldn't fetch student data"});
                        return reply.view("student/profile",data);
                    }
                })
            }
        }
    });

    server.route({
        method: '*',
        path: '/{p*}',
        config: {
            handler: function(request,reply){
                let data = {
                    title: 'Error',
                    errors: [{message: "Unavailable resource: " + request.path + " isn't available"}]
                }
                reply.view('error',data).code(404);
            }
        }
    });

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