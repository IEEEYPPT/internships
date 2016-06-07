var database = require('./index.js');
var bcrypt = require('bcrypt');

module.exports = {
    cryptPassword: function(password, callback) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) 
                return callback(err);
            bcrypt.hash(password, salt, function(err, hash) {
                return callback(err, hash);
            });
        });
    },
    comparePassword: function(password, userPassword, callback) {
        bcrypt.compare(password, userPassword, function(err, isPasswordMatch) {
            if (err) 
                return callback(err);
            return callback(null, isPasswordMatch);
        });
    },
    getStudent: function (id,callback){
        database.db.tables.Student.findAll({
            where: {id: id}
        }).then(function(student){
            if(Object.keys(student).length <= 0){
                student = {code: "rejected", msg: "Student not found"};
            }
            callback(student);
        },
        function(error){
            callback({code: "rejected", msg: 'Student not found', description:error});
        });
    },
    getStudents: function (callback){
        database.db.tables.Student.findAll().then(function(students){
            if(Object.keys(students).length <= 0){
                callback({code:"rejected", msg: "Students not found: there are no students available"});
            }else{
                callback({code:"accepted", msg:students});
            }
        },
        function(error){
            callback({code:"rejected", msg: 'Students not found', description:error});
        });
    },
    createStudent: function (student,callback){
        database.db.tables.Student.create(student).then(function(){
            answer = {code:"accepted",msg: "Student created with success", data:student};
            callback(answer);
        },
        function(error){
            answer = {code:"rejected",msg: "Could not create the student", description: error}
            callback(answer);
        });
    },
    checkStudentLogin: function (email,password,callback){
        database.db.tables.Student.find({ where: {email:email}}).then(function(student){
            if(student == null){
                student = {code: "rejected", msg: "Email not found in the database"};
                callback(student);
            }else{
                var answer;
                module.exports.comparePassword(password,student.dataValues.password,function(val,isPasswordMatch){
                    if(isPasswordMatch){
                        answer = {code: "accepted", msg: "Login successful", data:student};
                        callback(answer);
                    }
                    else{
                        answer = {code: "rejected", msg: "Invalid login"};
                        callback(answer);
                    }
                });
            }
        },
        function(error){
            callback({code:"rejected", msg: 'Error checking email/password'});
        });
    },
    checkStudentEmailNotUsed:function (email,callback){
      database.db.tables.Student.find({where:{email:email}}).then(function(student){
          if(student == null){
              callback(true);
          } else {
              callback(false);
          }
      });  
    },
    getCompany: function (id,callback){
        database.db.tables.Company.findAll({
            where: {id: id}
        }).then(function(company){
            if(Object.keys(company).length <= 0){
                company = {code: "rejected", msg: "Company not found"};
                callback(company);
            }else{
                callback(company);   
            }
        },
        function(error){
            callback({code: "rejected", msg: 'Company not found', description:error});
        });
    },
    getCompanies: function (callback){
        database.db.tables.Company.findAll().then(function(companies){
            if(Object.keys(companies).length <= 0){
                companies = {code:"rejected", msg: "Companies not found: there are no companies available"};
            }
            callback(companies);
        },
        function(error){
            callback({code:"rejected", msg: 'Companies not found', description:error});
        });
    },
    createCompany: function (company,callback){
        database.db.tables.Company.create({
            email: company.email,
            password: company.password,
            name: company.name,
            description: company.description
        }).then(function(){
            answer = {code:"accepted",msg: "Company created with success"};
            callback(answer);
        },
        function(error){
            answer = {code:"rejected",msg: "Could not create the company", description: error}
            callback(answer);
        });
    },
    getStudentBranchs: function (callback){
        database.db.tables.StudentBranch.findAll().then(function(studentBranchs){
            if(Object.keys(studentBranchs).length <= 0){
                callback({code:"rejected", msg: "Student Branchs not found: there are no student branchs available"});
            } else {
                callback({code:"accepted", msg:studentBranchs});
            }
        },
        function(error){
            callback({code:"rejected", msg: 'Student Branchs not found', description:error});
        });
    },
    getCities: function (callback){
        database.db.tables.City.findAll().then(function(cities){
            if(Object.keys(cities).length <= 0){
                callback({code:"rejected", msg: "Cities not found: there are no cities available"});
            }else{
                callback({code:"accepted", msg:cities});
            }
        },
        function(error){
            callback({code:"rejected", msg: 'Cities not found', description:error});
        });
    },
    getInternships: function (callback) {
        database.db.tables.Internship.findAll().then(function(internships) {
            if(Object.keys(internships).length <= 0){
                callback({code:"rejected", msg: "Internships not found: there are no internships available"});
            }else{
                callback({code:"accepted", msg: internships});
            }
        },
        function(error) {
            callback({code:"rejected",msg:"Internships not found", description:error});
        })
    },
    getInternship: function (id,callback){
        database.db.tables.Internship.findAll({
            where: {id: id}
        }).then(function(internship){
            if(Object.keys(internship).length <= 0){
                internship = {code: "rejected", msg: "Internship not found"};
                callback(internship);
            }else{
                callback(internship);   
            }
        },
        function(error){
            callback({code: "rejected", msg: 'Internship not found', description:error});
        });
    },
    createInternship: function (internship,callback){
        database.db.tables.Internship.create({
            title: internship.title,
            description: internship.description,
            publicationDate: internship.publicationDate,
            expirationDate: internship.expirationDate
        }).then(function(){
            answer = {code:"accepted",msg: "Internship created with success"};
            callback(answer);
        },
        function(error){
            answer = {code:"rejected",msg: "Could not create the internship", description: error}
            callback(answer);
        });
    }
};