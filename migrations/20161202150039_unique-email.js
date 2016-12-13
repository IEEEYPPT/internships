
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('student', function (table) {
            table.unique('email');
            table.unique('ieee_code');
        })
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('student', function (table) {
            table.dropIndex('email');
            table.dropIndex('ieee_code');
        })
    ])
};
