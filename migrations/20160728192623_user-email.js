
exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.table('student', function (table) {
            table.string('email');
        })
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.table('student', function (table) {
            table.dropColumn('email');
        })
    ])
};
