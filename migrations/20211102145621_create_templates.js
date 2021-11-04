exports.up = function (knex) {
    return knex.schema.createTable('templates', table => {
    table.increments('id'); // adds an auto incrementing PK column
    table.varchar("title", 10000).notNullable();
    table.varchar("body", 10000);
    table.timestamps(true, true); // adds created_at and updated_at

});
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('templates');
}