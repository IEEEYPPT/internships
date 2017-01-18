
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('student', function (table) {
            table.string('picture');
        }),
        knex.schema.table('company', function (table) {
            table.string('picture');
        })
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('student', function (table) {
            table.dropColumn('picture');
        }),
        knex.schema.table('company', function (table) {
            table.dropColumn('picture');
        })
    ])
};
