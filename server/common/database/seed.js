var functions = require('./functions.js');

module.exports = function(db) {

  db.tables.Country.create({
    name: 'Portugal'
  }).then(function(country) {
    db.tables.City.create({
             name: 'Castelo Branco',
             countryId: country.id
    }).then(function(city){
        db.tables.StudentBranch.bulkCreate([{
            name:'Instituto Politécnico de Castelo Branco',
            cityId: city.id
        },{
            name:'Universidade da Beira Interior',
            cityId: city.id
        }]);
    });
    db.tables.City.create({
             name: 'Leiria',
             countryId: country.id
    }).then(function(city){
        db.tables.StudentBranch.create({
            name:'Instituto Politécnico de Leiria',
            cityId: city.id
        });
    });
    db.tables.City.create({
             name: 'Porto',
             countryId: country.id
    }).then(function(city){
        db.tables.StudentBranch.bulkCreate([{
            name:'Instituto Superior de Engenharia do Porto',
            cityId: city.id
        },{
            name:'Universidade do Porto',
            cityId: city.id
        }]);
        db.tables.Company.create({
            email:'contact@company.com',
            password:'12345',
            name:'CRITICAL Software',
            description:'Fundada em 1998, A CRITICAL Software é especializada no desenvolvimento de soluções de software e serviços de engenharia de informação para o suporte de sistemas críticos orientados à segurança, à missão e ao negócio de empresas.',
            field:'Software Development',
            cityId: city.id
        }).then(function(company){
            db.tables.Internship.create({
                title:'Software Developer',
                description: 'Mainly Java developer',
                publicationDate: '2016/05/17',
                expirationDate: '2016/05/24',
                cityId: city.id,
                companyId:company.id
            })
        });
    });
    db.tables.City.create({
             name: 'Lisboa',
             countryId: country.id
    }).then(function(city){
        db.tables.StudentBranch.bulkCreate([{
            name:'Instituto Superior Técnico',
            cityId: city.id
        },{
            name:'Instituto Universitário de Lisboa',
            cityId: city.id
        },{
            name:'Universidade Nova de Lisboa',
            cityId: city.id
        }]);
    });
    db.tables.City.create({
             name: 'Aveiro',
             countryId: country.id
    }).then(function(city){
        db.tables.StudentBranch.create({
            name:'Universidade de Aveiro',
            cityId: city.id
        });
    });
    db.tables.City.create({
             name: 'Coimbra',
             countryId: country.id
    }).then(function(city){
        db.tables.StudentBranch.create({
            name:'Universidade de Coimbra',
            cityId: city.id
        });
    });
    db.tables.City.create({
             name: 'Braga',
             countryId: country.id
    }).then(function(city){
        db.tables.StudentBranch.create({
            name:'Universidade do Minho',
            cityId: city.id
        });
    });

    db.tables.City.bulkCreate([{
             name: 'Beja',
             countryId: country.id
    }, {
             name: 'Bragança',
             countryId: country.id
    }, {
             name: 'Évora',
             countryId: country.id
    }, {
             name: 'Faro',
             countryId: country.id
    }, {
             name: 'Guarda',
             countryId: country.id
    }, {
             name: 'Portalegre',
             countryId: country.id
    }, {
             name: 'Santarém',
             countryId: country.id
    }, {
             name: 'Setúbal',
             countryId: country.id
    }, {
             name: 'Viana do Castelo',
             countryId: country.id
    }, {
             name: 'Vila Real',
             countryId: country.id
    }, {
             name: 'Viseu',
             countryId: country.id
    }]);
  });
  
  functions.cryptPassword('12345',function(err,salt){
      if(err){
          //error
      } else {
        db.tables.Student.create({
            email:'john.doe@ieee.org',
            password:salt,
            ieeeNumber: '0123456789',
            firstName: 'John',
            lastName: 'Doe',
            birthdate: '1993/01/01',
            graduationYear: 2017
        });
      }
  });
};
