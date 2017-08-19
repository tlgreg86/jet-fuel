
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('urls', function(table) {
      table.string('url_title');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('urls', function(table) {
      table.dropColumn('url_title')
    })
  ]);
};
