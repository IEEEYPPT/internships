var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/internships');

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
        allowNull: false
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

exports.db = db;