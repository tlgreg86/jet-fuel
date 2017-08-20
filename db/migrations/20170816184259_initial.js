
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('folders', function(table) {
      table.increments('id').primary();
      table.string('folder_name').unique();
      table.timestamps(true, true);
    }),

    knex.schema.createTable('urls', function(table) {
      table.increments('id').primary();
      table.string('url_title');
      table.string('long_url').unique();
      table.string('short_url').unique();
      table.integer('folder_id').unsigned();
      table.foreign('folder_id').references('folders.id');
      table.timestamps(true,true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('urls'),
    knex.schema.dropTable('folders')
  ])
};
