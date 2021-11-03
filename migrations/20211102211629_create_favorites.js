
exports.up = function (knex) {
    return knex.schema.createTable('favorites', table => {
      table.integer('user_id').references('id').inTable('users');
      table.integer('template_id').references('id').inTable('templates');
    });
  }
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('favorites');
  };
  