const UtilsFunctions = require('./../utils/functions.js');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    knex('student').del(),
    knex('internship').del(),
    knex('company').del(),
    knex('student_branch').del(),
    knex('city').del(),
    knex('country').del(),
    knex.raw("ALTER SEQUENCE student_branch_id_seq RESTART WITH 1"),
    knex.raw("ALTER SEQUENCE city_id_seq RESTART WITH 1"),
    knex.raw("ALTER SEQUENCE country_id_seq RESTART WITH 1"),
    knex.raw("ALTER SEQUENCE company_id_seq RESTART WITH 1"),
    knex.raw("ALTER SEQUENCE student_id_seq RESTART WITH 1"),
    knex.raw("ALTER SEQUENCE internship_id_seq RESTART WITH 1")
  ])
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('country').insert({name: 'Portugal'}, 'id').then(function(country_id){
          return Promise.all([
            knex('city').insert({name: 'Castelo Branco', country_id: country_id[0]}, 'id').then(function(id){
              return Promise.all([
                knex('student_branch').insert({name: 'Instituto Politécnico de Castelo Branco',city_id:id[0]}),
                knex('student_branch').insert({name: 'Universidade da Beira Interior',city_id:id[0]})
              ]);
            }),
            knex('city').insert({name: 'Leiria', country_id: country_id[0]}, 'id').then(function(id){
              return knex('student_branch').insert({name: 'Instituto Politécnico de Leiria',city_id:id[0]});
            }),
            knex('city').insert({name: 'Porto', country_id: country_id[0]}, 'id').then(function(city_id){
                return Promise.all([
                  knex('student_branch').insert({name: 'Instituto Superior de Engenharia do Porto',city_id:city_id[0]}),
                  knex('student_branch').insert({name: 'Universidade do Porto',city_id:city_id[0]}),
                  knex('company').insert({email:"blip@blip.pt",password:"$2a$10$rpafZpgwR9HaT8VxTxjnb.OzrsXNsotV/2WkSuw/hp2OawVzggiK.",name:'BLIP',description:"Created with the purpose of making a difference in the web application world, we thrive to make our contribution count every day.",field:"Web Development",city_id:city_id[0] }, 'id').then(function(company_id){
                    return Promise.all([
                      knex('internship').insert({title:'Internship Program',description:'<p>We will provide to the Interns selected:<br /> - 6 months (Full-Time) of a challenge and fun Internship in Software Development<br /> - Real possibility of becoming a Software Engineer &#064; Blip<br /> - Paid Internship<br /> - Beginning of November 2014</p><p> The intern must have:<br /> - Information Technology academic background<br /> - Side projects developed</p><p> The intern must be:<br /> - Curious and action oriented<br /> - Humble and friendly <br /> - Willing to learn and share knowledge <br /> - Team player and committed<br /> - Flexible and autonomous<br /> - Passionate towards SW Development and complex challenges</p>',publication_date:'31/10/2016',expiration_date:'01/02/2017',city_id:city_id[0],company_id:company_id[0]})
                      ]);
                  })
                ]);
            }),
            knex('city').insert({name: 'Lisboa', country_id: country_id[0]}, 'id').then(function(id){
              return Promise.all([
                knex('student_branch').insert({name: 'Instituto Superior Técnico',city_id:id[0]}),
                knex('student_branch').insert({name: 'Instituto Universitário de Lisboa',city_id:id[0]}),
                knex('student_branch').insert({name: 'Universidade Nova de Lisboa',city_id:id[0]})
              ]);
            }),
            knex('city').insert({name: 'Aveiro', country_id: country_id[0]}, 'id').then(function(id){
              return knex('student_branch').insert({name: 'Universidade de Aveiro',city_id:id[0]});
            }),
            knex('city').insert({name: 'Coimbra', country_id: country_id[0]}, 'id').then(function(id){
              return knex('student_branch').insert({name: 'Universidade de Coimbra',city_id:id[0]});
            }),
            knex('city').insert({name: 'Braga', country_id: country_id[0]}, 'id').then(function(id){
              return knex('student_branch').insert({name: 'Universidade do Minho',city_id:id[0]});
            }),
            knex('city').insert({name: 'Beja', country_id: country_id[0]}),
            knex('city').insert({name: 'Bragança', country_id: country_id[0]}),
            knex('city').insert({name: 'Évora', country_id: country_id[0]}),
            knex('city').insert({name: 'Faro', country_id: country_id[0]}),
            knex('city').insert({name: 'Guarda', country_id: country_id[0]}),
            knex('city').insert({name: 'Portalegre', country_id: country_id[0]}),
            knex('city').insert({name: 'Santarém', country_id: country_id[0]}),
            knex('city').insert({name: 'Setúbal', country_id: country_id[0]}),
            knex('city').insert({name: 'Viana do Castelo', country_id: country_id[0]}),
            knex('city').insert({name: 'Vila Real', country_id: country_id[0]}),
            knex('city').insert({name: 'Viseu', country_id: country_id[0]})
          ]);
        })
      ]);
    });
};
