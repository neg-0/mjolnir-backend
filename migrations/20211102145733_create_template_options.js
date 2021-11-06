exports.up = function (knex) {
    return knex.schema.createTable('template_options', table => {
        table.increments('id'); // adds an auto incrementing PK column
        table.integer('template_id').references('id').inTable('templates');
        table.string('option_name').notNullable();
        table.string('option_type').notNullable();
        table.json('option_value').notNullable();
        table.timestamps(true, true); // adds created_at and updated_at
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('template_options');
};