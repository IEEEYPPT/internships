var Sequelize = require('sequelize');

if(process.env.NODE_ENV == 'production'){
    var sequelize = new Sequelize('postgres://amoevggxdixlmo:5u8fuNKnM-HEYF9EwxPn29k-LK@ec2-23-21-255-14.compute-1.amazonaws.com:5432/dae6v3s4ebol8p', {
        dialect:  'postgres',
        protocol: 'postgres',
        port:     5432,
        host:     'ec2-23-21-255-14.compute-1.amazonaws.com',
        dialectOptions: {
            ssl: true
        }
    });    
} else {
    var sequelize = new Sequelize('postgres://postgres:postgres@127.0.0.1:5432/internships');
}

var bcrypt = require('bcrypt');

var Skill = sequelize.define('skill', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    }
});

var Country = sequelize.define('country', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    }
});

var City = sequelize.define('city',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    }
});

City.belongsTo(Country);

var StudentBranch = sequelize.define('studentBranch',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    }
});

StudentBranch.belongsTo(City);

var Student = sequelize.define('student',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            is: ["^.+@ieee.org$",'i']
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ieeeNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            is: ["^[0-9]+$",'i']
        }
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    birthdate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    graduationYear: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    linkedIn:{
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            is: ["^https://www.linkedin.com/in/\w+$",'i']   
        }
    },
    collabratec:{
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            is: ["^https://ieee-collabratec.ieee.org/app/p/\w+$",'i']   
        }
    },
    bio:{
        type: Sequelize.TEXT,
        allowNull: true
    },
    area:{
        type: Sequelize.TEXT,
        allowNull: true
    }
});

Student.belongsTo(City);
Student.belongsTo(StudentBranch);

Student.belongsToMany(Skill,{through: 'studentSkill'});
Skill.belongsToMany(Student,{through: 'studentSkill'});

var Company = sequelize.define('company',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Company.belongsTo(City);

var Internship = sequelize.define('internship',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description : {
        type: Sequelize.STRING,
        allowNull: false
    },
    publicationDate : {
        type: Sequelize.DATE,
        allowNull: false
    },
    expirationDate: {
        type: Sequelize.DATE,
        allowNull: false
    }
});

Internship.belongsTo(City);
Internship.belongsTo(Company);

var db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.tables = {Skill,Country,City,StudentBranch,Student,Company,Internship};


// Force option enabled just for development
sequelize.sync({
    force: true
}).then(function(){
    require('./seed.js')(db);
});

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
        Student.findAll({
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
        Student.findAll().then(function(students){
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
        Student.create(student).then(function(){
            answer = {code:"accepted",msg: "Student created with success", data:student};
            callback(answer);
        },
        function(error){
            answer = {code:"rejected",msg: "Could not create the student", description: error}
            callback(answer);
        });
    },
    checkStudentLogin: function (email,password,callback){
        Student.find({ where: {email:email}}).then(function(student){
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
      Student.find({where:{email:email}}).then(function(student){
          if(student == null){
              callback(true);
          } else {
              callback(false);
          }
      });  
    },
    getCompany: function (id,callback){
        Company.findAll({
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
        Company.findAll().then(function(companies){
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
        Company.create({
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
        StudentBranch.findAll().then(function(studentBranchs){
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
        City.findAll().then(function(cities){
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
        Internship.findAll().then(function(internships) {
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
        Internship.findAll({
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
        Internship.create({
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

db.exports = module.exports;

exports.db = db;