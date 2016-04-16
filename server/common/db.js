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
    var sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/internships');
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

// Force option enabled just for development
sequelize.sync({
    //force: true
}).then(function(){
    
});

var db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.tables = {Skill,Country,City,StudentBranch,Student,Company};
  
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
            callback({error: 'Student not found: ' + error});
        });
    },
    getStudents: function (callback){
        Student.findAll().then(function(students){
            if(Object.keys(students).length <= 0){
                students = {error: "Students not found: there are no students available"};
            }
            callback(students);
        },
        function(error){
            callback({error: 'Students not found: ' + error});
        });
    },
    createStudent: function (student,callback){
        Student.create({
            email: student.email,
            password: student.password,
            ieeeNumber: student.ieeeNumber,
            firstName: student.firstName,
            lastName: student.lastName,
            birthdate: student.birthdate,
            graduationYear: student.graduationYear
        }).then(function(){
            answer = {code:"accepted",msg: "Student created with success"};
            callback(answer);
        },
        function(error){
            answer = {code:"rejected",msg: "Could not create the student", description: error}
            callback(answer);
        });
    },
    getCompany: function (id,callback){
        Company.findAll({
            where: {id: id}
        }).then(function(company){
            if(Object.keys(company).length <= 0){
                company = {code: "rejected", msg: "Company not found"};
            }
            callback(company);
        },
        function(error){
            callback({error: 'Company not found: ' + error});
        });
    },
    getCompanies: function (callback){
        Company.findAll().then(function(companies){
            if(Object.keys(companies).length <= 0){
                companies = {error: "Companies not found: there are no companies available"};
            }
            callback(companies);
        },
        function(error){
            callback({error: 'Companies not found: ' + error});
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
    }
};

exports.db = db;