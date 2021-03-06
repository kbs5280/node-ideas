
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('ideas', function(table) {
      table.increments('id').primary();
      table.string('title');
      table.string('body');

      table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('ideas')
  ])
};
