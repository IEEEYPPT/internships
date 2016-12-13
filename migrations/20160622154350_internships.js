
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('skill',function (table) {
            table.increments('id').primary();
            table.string('name');
        }),
        knex.schema.createTable('country',function (table) {
            table.increments('id').primary();
            table.string('name');    
        }),
        knex.schema.createTable('city',function (table) {
            table.increments('id').primary();
            table.string('name');
            table.integer('country_id')
                .references('id')
                .inTable('country');
        }),
        knex.schema.createTable('student_branch',function (table) {
            table.increments('id').primary();
            table.string('name');
            table.integer('city_id')
                .references('id')
                .inTable('city');
        }),
        knex.schema.createTable('student',function (table) {
            table.increments('id').primary();
            table.string('password');
            table.string('ieee_code');
            table.string('first_name');
            table.string('last_name');
            table.date('birthdate');
            table.integer('graduation_year');
            table.string('linkedin');
            table.string('collabratec');
            table.text('bio');
            table.integer('city_id')
                .references('id')
                .inTable('city');
            table.integer('student_branch_id')
                .references('id')
                .inTable('student_branch');
        }),
        knex.schema.createTable('company',function (table) {
            table.increments('id').primary();
            table.string('email');
            table.string('password');
            table.string('name');
            table.text('description');
            table.string('field');
            table.integer('city_id')
                .references('id')
                .inTable('city');
        }),
        knex.schema.createTable('internship',function (table) {
            table.increments('id').primary();
            table.string('title');
            table.string('description');
            table.dateTime('publication_date');
            table.dateTime('expiration_date');
            table.integer('city_id')
                .references('id')
                .inTable('city');
            table.integer('company_id')
                .references('id')
                .inTable('company');
        })
    ]);
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('skill');
    knex.schema.dropTable('country');
    knex.schema.dropTable('city');
    knex.schema.dropTable('student_branch');
    knex.schema.dropTable('student');
    knex.schema.dropTable('company');
    knex.schema.dropTable('internship');
};
