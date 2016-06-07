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
    },
    field: {
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

db.tables = {Skill,Country,City,StudentBranch,Student,Company,Internship};

// Force option enabled just for development
sequelize.sync({
    force: true
}).then(function(){
    require('./seed.js')(db);
});

exports.db = db;