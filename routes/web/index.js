'use strict';

const DatabaseFunctions = require('./../../database/functions.js');
const UtilsFunctions = require('./../../utils/functions.js');
const uuidV4 = require('uuid/v4');
const Joi = require('joi');
const fs = require('fs');
const Sharp = require('sharp');
const FileType = require('file-type');

module.exports = function(server) {

    server.route({
        method: 'GET',
        path: '/',
        config: {
            handler: function (request, reply) {
                let data = {
                    title: "What is the IEEE Young Professionals Internship Program?",
                    authenticated: request.auth.isAuthenticated,
                }
                if(request.auth.credentials && request.auth.credentials.scope){
                    data.scope = request.auth.credentials.scope;
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
                            if(answer.code === 200){
                                const uuid = uuidV4();
                                request.server.app.cache.set(uuid, {scope:'student', id:answer.student}, 0, (err) => {

                                    if (err) {
                                        reply(err);
                                    }

                                    request.cookieAuth.set({ uuid: uuid,scope:'student'});
                                    return reply.redirect('/');
                                });
                            } else {
                                DatabaseFunctions.checkCompanyLogin(request.payload.email,request.payload.password,function(answer){
                                    if(answer.code === 200){
                                        const uuid = uuidV4();
                                        request.server.app.cache.set(uuid, {scope:'company', id:answer.company}, 0, (err) => {

                                            if (err) {
                                                reply(err);
                                            }

                                            request.cookieAuth.set({ uuid: uuid,scope:'company'});
                                            return reply.redirect('/');
                                        });
                                    } else {
                                        data.errors.push({message:"Wrong email/password"});
                                        return reply.view("login",data);    
                                    }
                                });
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
        method: 'GET',
        path: '/register',
        config: {
            auth: { mode: 'try' },
            plugins: { 'hapi-auth-cookie': { redirectTo: false }},
            handler: function(request,reply){
                let data = {title:"Register",errors:[]};
                if (request.auth.isAuthenticated) {
                    return reply.redirect('/');
                }
                return reply.view("register",data);
            }
        }
    });

    server.route({
        method: ['GET','POST'],
        path: '/register/student',
        config: {
            auth: { mode: 'try' }, 
            plugins: { 'hapi-auth-cookie': { redirectTo: false }} ,
            handler: function (request, reply) {
                let data = {title:"Student Register",errors:[]};
                if (request.auth.isAuthenticated) {
                    return reply.redirect('/');
                }
                if(request.method === 'post'){
                    if(request.payload.password === request.payload.check_password){
                        UtilsFunctions.cryptPassword(request.payload.password,function(err,hash){
                            if(!err){
                                request.payload.password = hash;
                                delete request.payload.check_password;
                                DatabaseFunctions.createStudent(request.payload,function(result){
                                    if(result.code === 201){
                                        return reply.redirect("/");
                                    } else {
                                        data.errors.push({message: "Missing, wrong or already used values"});
                                        DatabaseFunctions.getCities(function(cities){
                                            DatabaseFunctions.getStudentBranchs(function(sbs){
                                                data.sbs = sbs.message;
                                                data.cities = cities.message;
                                                return reply.view("student/register",data);
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
                                        return reply.view("student/register",data);
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
                                return reply.view("student/register",data);
                            })
                        });     
                    }   
                } else {                
                    DatabaseFunctions.getCities(function(cities){
                        DatabaseFunctions.getStudentBranchs(function(sbs){    
                            data.sbs = sbs.message;
                            data.cities = cities.message;
                            return reply.view("student/register",data);
                        })
                    });
                }
            }
        }
    });

        server.route({
        method: ['GET','POST'],
        path: '/register/company',
        config: {
            auth: { mode: 'try' }, 
            plugins: { 'hapi-auth-cookie': { redirectTo: false }} ,
            handler: function (request, reply) {
                let data = {title:"Company Register",errors:[]};
                if (request.auth.isAuthenticated) {
                    return reply.redirect('/');
                }
                if(request.method === 'post'){
                    if(request.payload.password === request.payload.check_password){
                        UtilsFunctions.cryptPassword(request.payload.password,function(err,hash){
                            if(!err){
                                request.payload.password = hash;
                                delete request.payload.check_password;
                                DatabaseFunctions.createCompany(request.payload,function(result){
                                    if(result.code === 201){
                                        return reply.redirect("/");
                                    } else {
                                        data.errors.push({message: "Missing, wrong or already used values"});
                                        DatabaseFunctions.getCities(function(cities){
                                            data.cities = cities.message;
                                            return reply.view("company/register",data);
                                        });                       
                                    }
                                })
                            } else {
                                data.errors.push({message: "Missing, wrong or already used values"});
                                DatabaseFunctions.getCities(function(cities){
                                    data.cities = cities.message;
                                    return reply.view("company/register",data);
                                });
                            }
                        })
                    } else {
                        data.errors.push({message: "Passwords aren't equal"});
                        DatabaseFunctions.getCities(function(cities){
                                data.cities = cities.message;
                                return reply.view("company/register",data);
                        });     
                    }   
                } else {                
                    DatabaseFunctions.getCities(function(cities){
                            data.cities = cities.message;
                            return reply.view("company/register",data);
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
                let data = {title: "Internships",errors:[],authenticated: request.auth.isAuthenticated,scope: request.auth.credentials.scope};
                DatabaseFunctions.getInternships(function(internships){
                    if(internships.code === 200){
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
                let data = {title: "Internship",errors:[],authenticated: request.auth.isAuthenticated,scope: request.auth.credentials.scope};
                DatabaseFunctions.getInternship(request.params.id,function(internship){
                    if(internship.code === 200){
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
                let data = {title: "Companies",errors:[],authenticated: request.auth.isAuthenticated,scope: request.auth.credentials.scope};
                DatabaseFunctions.getCompanies(function(companies){
                    if(companies.code === 200){
                        data.companies = companies.message;
                        return reply.view("company/list",data);
                    } else {
                        data.errors.push({message: "Error fetching companies from database"});
                        return reply.view("company/list",data);
                    }
                })
            }
        }
        
    });

    server.route({
        method: 'GET',
        path: '/dashboard',
        config: {
            handler: function(request, reply){
                let data = {/*title:"Dashboard",*/ errors:[], authenticated: request.auth.isAuthenticated,scope: request.auth.credentials.scope,id:request.auth.credentials.id};
                return reply.view("dashboard",data);
            }
        }
    });

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
                    errors: [],
                    scope: request.auth.credentials.scope,
                    authenticated_id: request.auth.credentials.id
                };
                if(data.scope === "company" && data.authenticated_id === encodeURIComponent(request.params.id)){
                    return reply.redirect("/profile");
                }
                DatabaseFunctions.getCompany(encodeURIComponent(request.params.id),function(answer){
                    if(answer.code === 200){
                        data.company = answer.message;
                        DatabaseFunctions.getCity(data.company.city_id, function(answer){
                            if(answer.code === 200){
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
                    errors: [],
                    scope: request.auth.credentials.scope
                };
                DatabaseFunctions.getInternshipsFromCompany(encodeURIComponent(request.params.id),function(answer){
                    if(answer.code === 200){
                        data.title = answer.message[0].company_name + " internships";
                        data.internships = answer.message;
                        data.internships.empty = false;
                        return reply.view('company/internships',data);
                    } else if(answer.code === 404){
                        data.title = "Internships not available";
                        data.internships = {empty : true};
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
        method: ['GET','POST'],
        path: '/profile',
        config: {
            handler: function (request,reply){
                let data = {
                    authenticated: request.auth.isAuthenticated,
                    errors: [],
                    scope: request.auth.credentials.scope,
                    authenticated_id: request.auth.credentials.id
                };
                if(request.method === "get"){
                    if(request.auth.credentials.scope === 'student'){
                        DatabaseFunctions.getStudent(request.auth.credentials.id, function(answer){
                            if(answer.code === 200){
                                data.student = answer.message;
                                DatabaseFunctions.getCities(function(answer){
                                    if(answer.code === 200){
                                        data.student.cities = answer.message;
                                        DatabaseFunctions.getStudentBranchs(function(answer){
                                            if(answer.code === 200){
                                                data.student.sbs = answer.message;
                                                return reply.view("student/profile",data);
                                            } else {
                                                data.errors = [{message:"Couldn't fetch student data"}];
                                                return reply.view("student/profile",data);
                                            }
                                        });
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
                    } else if (request.auth.credentials.scope === 'company'){
                        DatabaseFunctions.getCompany(request.auth.credentials.id,function(answer){
                            if(answer.code === 200){
                                data.company = answer.message;
                                DatabaseFunctions.getCities(function(answer){
                                    if(answer.code === 200){
                                        data.company.cities = answer.message;
                                        return reply.view('company/profile',data);
                                    } else {
                                        data.errors = [{message:"Couldn't fetch company data"}];
                                        return reply.view('company/profile',data);
                                    }
                                });
                            } else {
                                data.errors = [{message:"Couldn't fetch company data"}];
                                return reply.view('company/profile',data);
                            }
                        })
                    }
                } else if(request.method === "post"){
                    if(request.auth.credentials.scope === 'student'){
                        DatabaseFunctions.updateStudent(request.auth.credentials.id,request.payload,function(answer){
                            if(answer.code === 200){
                                return reply.redirect("/profile");
                            } else {
                                data.errors = [{message:"Couldn't update your profile"}];
                                return reply.view("/profile",data);
                            }
                        });
                    } else if(request.auth.credentials.scope === 'company'){
                        DatabaseFunctions.updateCompany(request.auth.credentials.id,request.payload,function(answer){
                            if(answer.code === 200){
                                return reply.redirect("/profile");
                            } else {
                                data.errors = [{message:"Couldn't update your profile"}];
                                return reply.view("/profile",data);
                            }
                        });
                    }
                }
            }
        }
    });

     server.route({
        method: ['GET','POST'],
        path: '/password',
        config: {
            handler: function (request,reply){
                let data = {
                    title: "Change password",
                    authenticated: request.auth.isAuthenticated,
                    errors: [],
                    scope: request.auth.credentials.scope
                };
                if(request.method === 'get'){
                    return reply.view('password',data);
                } else if (request.method === 'post'){
                    if(request.auth.credentials.scope === 'student'){
                        DatabaseFunctions.checkStudentPassword(request.auth.credentials.id,request.payload.old_password,function(answer){
                            if(answer.code === 200){
                                if(request.payload.new_password === request.payload.check_password){
                                    UtilsFunctions.cryptPassword(request.payload.new_password,function(err,hash){
                                        if(!err){
                                            DatabaseFunctions.updateStudent(request.auth.credentials.id,{password:hash},function(answer){
                                                if(answer.code === 200){
                                                    return reply.redirect('/profile');
                                                } else {
                                                    data.errors.push({message:"Error updating password"});
                                                    return reply.view('password',data);
                                                }
                                            });
                                        } else {                                    
                                            data.errors.push({message:"Invalid password"});
                                            return reply.view('password',data);
                                        }
                                    });
                                } else {
                                    data.errors.push({message:"New password doesn't match"});
                                    return reply.view('password',data);
                                }
                            } else {
                                data.errors.push({message:answer.message});
                                return reply.view('password',data);
                            }
                        });
                    } else if(request.auth.credentials.scope === 'company'){
                        DatabaseFunctions.checkCompanyPassword(request.auth.credentials.id,request.payload.old_password,function(answer){
                            if(answer.code === 200){
                                if(request.payload.new_password === request.payload.check_password){
                                    UtilsFunctions.cryptPassword(request.payload.new_password,function(err,hash){
                                        if(!err){
                                            DatabaseFunctions.updateCompany(request.auth.credentials.id,{password:hash},function(answer){
                                                if(answer.code === 200){
                                                    return reply.redirect('/profile');
                                                } else {
                                                    data.errors.push({message:"Error updating password"});
                                                    return reply.view('password',data);
                                                }
                                            });
                                        } else {                                    
                                            data.errors.push({message:"Invalid password"});
                                            return reply.view('password',data);
                                        }
                                    });
                                } else {
                                    data.errors.push({message:"New password doesn't match"});
                                    return reply.view('password',data);
                                }
                            } else {
                                data.errors.push({message:answer.message});
                                return reply.view('password',data);
                            }
                        });
                    }
                }
            }
        }
     });

    server.route({
        method: 'POST',
        path: '/picture',
        config: {
            payload: {
                maxBytes: 209715200,
                output: 'data',
                parse: true
            },
            handler: function(request,reply){
                let data = {
                    title: "Change profile picture",
                    authenticated: request.auth.isAuthenticated,
                    errors: [],
                    scope: request.auth.credentials.scope
                };
                if(request.payload["picture"]){
                    if(request.auth.credentials && request.auth.credentials.scope){
                        const uuid = uuidV4() + '-' + request.auth.credentials.id;
                        if(request.auth.credentials.scope === "student"){
                            let pictureType = FileType(request.payload["picture"]);
                            if(pictureType && (pictureType.ext === "jpg" || pictureType.ext === "png" )){
                                DatabaseFunctions.updateStudent(request.auth.credentials.id,{picture:uuid+".png"},function(answer){
                                    if(answer.code === 200){
                                        Sharp(request.payload["picture"])
                                            .resize(350,350)
                                            .background({r: 0, g: 0, b: 0, alpha: 0})
                                            .embed()
                                            .png()
                                            .pipe(fs.createWriteStream("public/upload/student/profile/" + uuid + ".png"));
                                        reply.redirect('/profile');
                                    } else {
                                        data.errors.push({message:"Couldn't update your picture"});
                                        return reply.view('picture',data);
                                    }
                                });
                            } else {
                                data.errors.push({message:"File not supported"});
                                return reply.view('picture',data);
                            }
                        } else if(request.auth.credentials.scope === "company"){
                            let pictureType = FileType(request.payload["picture"]);
                            if(pictureType && (pictureType.ext === "jpg" || pictureType.ext === "png" )){
                                DatabaseFunctions.updateCompany(request.auth.credentials.id,{picture:uuid+".png"},function(answer){
                                    if(answer.code === 200){
                                        Sharp(request.payload["picture"])
                                            .resize(350,350)
                                            .background({r: 0, g: 0, b: 0, alpha: 0})
                                            .embed()
                                            .png()
                                            .pipe(fs.createWriteStream("public/upload/company/profile/" + uuid + ".png"));
                                        reply.redirect('/profile');
                                    } else {
                                        data.errors.push({message:"Couldn't update your picture"});
                                        return reply.view('picture',data);
                                    }
                                });
                            } else {
                                data.errors.push({message:"File not supported"});
                                return reply.view('picture',data);
                            }
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/picture',
        config: {
            handler: function (request,reply){
                let data = {
                    title: "Change profile picture",
                    authenticated: request.auth.isAuthenticated,
                    errors: [],
                    scope: request.auth.credentials.scope
                };
                if(request.auth.credentials.scope === 'student'){
                    DatabaseFunctions.getStudent(request.auth.credentials.id, function(answer){
                        if(answer.code === 200){
                            data.student = answer.message;
                            return reply.view("picture",data);
                        } else {
                            data.errors.push({message:"Couldn't fetch your data"});
                            return reply.view("picture",data);
                        }
                    });
                } else if(request.auth.credentials.scope === 'company'){
                    DatabaseFunctions.getCompany(request.auth.credentials.id, function(answer){
                        if(answer.code === 200){
                            data.company = answer.message;
                            return reply.view("picture",data);
                        } else {
                            data.errors.push({message:"Couldn't fetch your data"});
                            return reply.view("picture",data);
                        }
                    });
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/cv',
        config: {
            handler: function (request,reply){
                let data = {
                    title: "Change CV File",
                    authenticated: request.auth.isAuthenticated,
                    errors: [],
                    scope: request.auth.credentials.scope
                };
                if(request.auth.credentials.scope === 'student'){
                    DatabaseFunctions.getStudent(request.auth.credentials.id, function(answer){
                        if(answer.code === 200){
                            data.student = answer.message;
                            return reply.view("student/cv",data);
                        } else {
                            data.errors.push({message:"Couldn't fetch your data"});
                            return reply.view("student/cv",data);
                        }
                    });
                } else {
                    return reply.redirect("/");
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/cv',
        config: {
            payload: {
                maxBytes: 209715200,
                output: 'data',
                parse: true
            },
            handler: function (request,reply){
                let data = {
                    title: "Change CV File",
                    authenticated: request.auth.isAuthenticated,
                    errors: [],
                    scope: request.auth.credentials.scope
                };
                if(request.payload.cv){
                    const uuid = uuidV4() + '-' + request.auth.credentials.id;

                    let documentType = FileType(request.payload["cv"]);
                    if(documentType && documentType.ext === "pdf"){
                        fs.writeFile("public/upload/student/cv/"+ uuid + ".pdf",request.payload.cv);
                        request.payload["cv"] = uuid + ".pdf";
                    } else {
                        data.errors.push({message:"File not supported"});
                        return reply.view('student/cv',data);
                    }

                    DatabaseFunctions.updateStudent(request.auth.credentials.id,request.payload,function(answer){
                        if(answer.code === 200){
                            return reply.redirect("/profile");
                        } else {
                            data.errors.push({message:answer.message});
                            return reply.view('student/cv',data);
                        }
                    });
                } else {
                    data.errors.push({message: "Missing values"});
                    return reply.view("student/cv",data);
                };
            }
        }
    });

     server.route({
        method: 'POST',
        path: '/create/internship',
        config: {
            payload: {
                maxBytes: 209715200,
                output: 'data',
                parse: true
            },
            handler: function (request,reply){
                let data = {
                    title: "Create an Internship",
                    authenticated: request.auth.isAuthenticated,
                    errors: [],
                    scope: request.auth.credentials.scope
                };
                if(request.payload.title && request.payload.description && request.payload.city_id && request.payload.expiration_date){
                    let date = new Date();
                    const uuid = uuidV4() + '-' + request.auth.credentials.id + "-" + date.getTime();
                    date = date.toISOString();
                    request.payload.publication_date = date;
                    request.payload.company_id = request.auth.credentials.id;

                    let documentType = FileType(request.payload["pdf"]);
                    if(documentType && documentType.ext === "pdf"){
                        fs.writeFile("public/upload/company/pdf/"+ uuid + ".pdf",request.payload.pdf);
                        request.payload["pdf"] = uuid + ".pdf";
                    } else {
                        data.errors.push({message:"File not supported"});
                        return reply.view('internship/create',data);
                    }

                    DatabaseFunctions.createInternship(request.payload,function(answer){
                        if(answer.code === 201){
                            return reply.redirect("/dashboard");
                        } else {
                            data.errors.push({message:answer.message});
                            return reply.view('internship/create',data);
                        }
                    });
                } else {
                    data.errors.push({message: "Missing values"});
                    return reply.view("internship/create",data);
                };
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/create/internship',
        config: {
            handler: function (request,reply){
                let data = {
                    title: "Create an Internship",
                    authenticated: request.auth.isAuthenticated,
                    errors: [],
                    scope: request.auth.credentials.scope
                };
                if(request.auth.credentials.scope === 'company'){
                    DatabaseFunctions.getCities(function(answer){
                        if(answer.code === 200){
                            data.cities = answer.message;
                            return reply.view("internship/create",data);
                        } else {
                            data.errors.push({message:answer.message});
                            return reply.view("internship/create",data);
                        }
                    });
                } else {
                    return reply.redirect("/");
                }
            }
        }
    });

    server.route({
        method: '*',
        path: '/{p*}',
        config: {
            auth: {
                mode: 'try'
            },
            handler: function(request,reply){
                let data = {
                    title: 'Error',
                    authenticated: request.auth.isAuthenticated,
                    errors: [{message: "Unavailable resource: " + request.path + " isn't available"}],
                    scope: request.auth.credentials.scope
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