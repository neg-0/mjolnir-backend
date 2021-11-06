exports.up = function (knex) {
  return knex.schema.createTable('templates', table => {
    table.increments('id'); // adds an auto incrementing PK column
    table.varchar("title").notNullable();
    table.string("body", 100000);
    table.timestamps(true, true); // adds created_at and updated_at
  });
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('templates');
}