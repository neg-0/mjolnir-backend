exports.up = function (knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id'); // adds an auto incrementing PK column
    table.string('user_name').notNullable();
    table.varchar('password', 64);
    table.timestamps(true, true); // adds created_at and updated_at
  });
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
}
