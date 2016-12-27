'use strict';

const db = require('./index.js');
const UtilsFunctions = require('./../utils/functions.js');

function getCity(id,callback){
    db('city').where({
        id : id
    }).select('id','name','country_id').then(function(city){
        if(Object.keys(city).length === 1){
            callback({code:200,message:city[0]});
        } else {
            callback({code:404,message:"Company not found."});
        }
    });
}

function getCompany(id, callback) {
    db('company').where({
        id : id
    }).select('id','name','email','description','field',
    'city_id').then(function(company){
        if(Object.keys(company).length === 1){
            callback({code:200,message:company[0]});
        } else {
            callback({code:404,message:"Company not found."});
        }
    });
}

module.exports = {
    getStudent : function (id, callback) {
        db('student').where({
            id : id
        }).select('id','first_name','last_name','ieee_code',
        'birthdate','graduation_year','linkedin',
        'collabratec','bio','city_id',
        'student_branch_id','area').then(function(student){
            if(Object.keys(student).length === 1){
                callback({code:200,message:student[0]});
            } else {
                callback({code:404,message:"Student not found."});
            }
        });
    },
    getStudents : function(callback){
        db.select('id','first_name','last_name','ieee_code',
        'birthdate','graduation_year','linkedin',
        'collabratec','bio','city_id',
        'student_branch_id','area').from('student').then(function(students){
            if(Object.keys(students).length <= 0){
                callback({code:404,message:"There are no students available"});
            } else {
                callback({code:200,message:students});
            }
        })
    },
    createStudent: function (student,callback){
        db.insert(student).into('student').then(function(result){
             if(result.rowCount === 1){
                 callback({code:201,message: "Student created with success"});
             } else {
                 callback({code:500,message: "Student could not be created"});
             }
        },
        function(error){
            callback({code:500,message: "Student could not be created : " + error}); //TODO Remove this error message
        });
    },
    checkStudentLogin: function (email,password,callback){
        db.select('id','password').from('student').where({
            email : email
        }).then(function(student){
            if(Object.keys(student).length === 1){
                UtilsFunctions.comparePassword(password,student[0].password,function(val,isPasswordMatch){
                    if(isPasswordMatch){
                        return callback({code: 200, message: "Login successful",student: student[0].id}); //TODO check this code value
                    }
                    else{
                        return callback({code: 500, message: "Invalid login"}); //TODO check this code value
                    }
                })
            } else {
                return callback({code: 404, message: "Email or password invalid"});
            }
        });
    },
    createCompany: function (company,callback){
        db.insert(company).into('company').then(function(result){
             if(result.rowCount === 1){
                 callback({code:201,message: "Company created with success"});
             } else {
                 callback({code:500,message: "Company could not be created : " + result});
             }
        },
        function(error){
            callback({code:500,message: "Company could not be created : " + error}); //TODO Remove this error message
        });
    },
    getCompany : getCompany,
    getCompanies : function(callback){
        db.select('id','name','description','email','field',
        'city_id').from('company').then(function(companies){
            if(Object.keys(companies).length <= 0){
                callback({code:404,message:"There are no companies available"});
            } else {
                callback({code:200,message:companies});
            }
        })
    },
    checkCompanyLogin: function (email,password,callback){
        db.select('id','password').from('company').where({
            email : email
        }).then(function(company){
            if(Object.keys(company).length === 1){
                UtilsFunctions.comparePassword(password,company[0].password,function(val,isPasswordMatch){
                    if(isPasswordMatch){
                        return callback({code: 200, message: "Login successful",company: company[0].id}); //TODO check this code value
                    }
                    else{
                        return callback({code: 500, message: "Invalid login"}); //TODO check this code value
                    }
                })
            } else {
                return callback({code: 404, message: "Email or password invalid"});
            }
        });
    },
    getStudentBranch : function (id, callback) {
        db('student_branch').where({
            id : id
        }).select('id','name','city_id').then(function(studentBranch){
            if(Object.keys(studentBranch).length === 1){
                callback({code:200,message:studentBranch[0]});
            } else {
                callback({code:404,message:"Student Branch not found."});
            }
        });
    },
    getStudentBranchs : function(callback){
        db.select('id','name','city_id').from('student_branch').then(function(studentBranchs){
            if(Object.keys(studentBranchs).length <= 0){
                callback({code:404,message:"There are no Student Branchs available"});
            } else {
                callback({code:200,message:studentBranchs});
            }
        })
    },
    getCity : getCity,
    getCities : function (callback) {
        db.select('id','name','country_id').from('city').then(function(cities){
            if(Object.keys(cities).length <= 0){
                callback({code:404,message:"There are no cities available"});
            } else {
                callback({code:200,message:cities});
            }
        })
    },
    getInternship : function (id, callback) {
        db('internship').where({
            id : id
        }).select('id','title','description','publication_date','expiration_date','city_id','company_id').then(function(internship){
            if(Object.keys(internship).length === 1){
                getCity(internship[0].city_id,function(result){
                    if(result.code === 200){
                        internship[0].city_name = result.message.name;
                        getCompany(internship[0].company_id,function(result){
                            if(result.code === 200){
                                internship[0].company_name = result.message.name;
                                callback({code:200,message:internship[0]});
                            } else {
                                callback({code:404,message:"Internship not found."});
                            }
                        })
                    } else {
                        callback({code:404,message:"Internship not found."});
                    }
                });
            } else {
                callback({code:404,message:"Internship not found."});
            }
        });
    },
    getInternships : function (callback) {
        db.raw("SELECT internship.*,city.name AS city_name,company.name AS company_name " +
                "FROM internship "+
                "INNER JOIN city "+
                    "ON city.id = internship.city_id "+
                "INNER JOIN company "+
                    "ON company.id = internship.company_id").then(function(internships){
            if(Object.keys(internships).length <= 0){
                callback({code:404,message:"There are no internships available"});
            } else {
                callback({code:200,message:internships.rows});
            }
        });
    },
    getInternshipsFromCompany : function(id,callback){
        db.raw("SELECT internship.*,city.name AS city_name,company.name AS company_name " +
                "FROM internship "+
                "INNER JOIN city "+
                    "ON city.id = internship.city_id "+
                "INNER JOIN company "+
                    "ON company.id = internship.company_id "+
                "WHERE internship.company_id = " + id).then(function(internships){
            if(Object.keys(internships).length <= 0 || internships.rows.length <= 0){
                callback({code:404,message:"There are no internships available"});
            } else {
                callback({code:200,message:internships.rows});
            }
        });
    }
};