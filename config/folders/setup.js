'use strict';

const fs = require('fs');
const Path = require('path');

module.exports = function(dirname) {
    fs.mkdir(Path.join(dirname,'/public/upload'),function(err){
        if(err){
            if(err.errno !== 'EEXIST'){
                //TODO: Deal with unexpected errors
            }
        }
        fs.mkdir(Path.join(dirname,'/public/upload/company'),function(err){
            if(err){
                if(err.errno !== 'EEXIST'){
                    //TODO: Deal with unexpected errors
                }
                fs.mkdir(Path.join(dirname,'/public/upload/company/profile'),function(err){
                    if(err){
                        if(err.errno !== 'EEXIST'){
                            //TODO: Deal with unexpected errors
                        }
                    }
                });
                fs.mkdir(Path.join(dirname,'/public/upload/company/pdf'),function(err){
                    if(err){
                        if(err.errno !== 'EEXIST'){
                            //TODO: Deal with unexpected errors
                        }
                    }
                });
            } else {
                fs.mkdir(Path.join(dirname,'/public/upload/company/profile'),function(err){
                    if(err){
                        if(err.errno !== 'EEXIST'){
                            //TODO: Deal with unexpected errors
                        }
                    }
                });
            }
        });
        fs.mkdir(Path.join(dirname,'/public/upload/student'),function(err){
            if(err){
                if(err.errno !== 'EEXIST'){
                    //TODO: Deal with unexpected errors
                }
                fs.mkdir(Path.join(dirname,'/public/upload/student/profile'),function(err){
                    if(err){
                        if(err.errno !== 'EEXIST'){
                            //TODO: Deal with unexpected errors
                        }
                    }
                });
                fs.mkdir(Path.join(dirname,'/public/upload/student/cv'),function(err){
                    if(err){
                        if(err.errno !== 'EEXIST'){
                            //TODO: Deal with unexpected errors
                        }
                    }
                });
            } else {
                fs.mkdir(Path.join(dirname,'/public/upload/student/profile'),function(err){
                    if(err){
                        if(err.errno !== 'EEXIST'){
                            //TODO: Deal with unexpected errors
                        }
                    }
                });
            }
        });
    });
}