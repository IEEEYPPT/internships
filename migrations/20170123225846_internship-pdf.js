
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('internship', function (table) {
            table.string('pdf');
        })
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('internship', function (table) {
            table.dropColumn('pdf');
        })
    ])
};
