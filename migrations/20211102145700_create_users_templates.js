exports.up = function (knex) {
  return knex.schema.createTable('users_templates', table => {
    table.increments('history_id'); // adds an auto incrementing PK column
    table.integer('user_id').references('id').inTable('users');
    table.integer('template_id').references('id').inTable('templates');
    table.string('file_name').notNullable()
    table.json('serialized_options');
    table.timestamps(true, true); // adds created_at and updated_at
  });
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users_templates');
};
