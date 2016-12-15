
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.raw("ALTER TABLE internship ALTER COLUMN description TYPE text")
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('internship', function (table) {
            table.dropColumn('description');
        })
    ])
};
