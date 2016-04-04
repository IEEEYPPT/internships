var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/internships');
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
        allowNull: false
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
    force: true
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
                student = {error: "Student not found: id " + id + " doesn't exists"};
            }
            callback(student);
        },
        function(error){
            callback({error: 'Student not found: ' + error});
        });
    },
    getStudents: function (callback){
        Student.findAll({}).then(function(students){
            if(Object.keys(students).length <= 0){
                students = {error: "Students not found: there are no students available"};
            }
            callback(students);
        },
        function(error){
            callback({error: 'Students not found: ' + error});
        });
    }
};

exports.db = db;