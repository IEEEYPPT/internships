
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('student', function (table) {
            table.string('area');
        })
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('student', function (table) {
            table.dropColumn('area');
        })
    ])
};