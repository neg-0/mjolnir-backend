
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users_templates').del()
    .then(function () {
      // Inserts seed entries
      return knex('users_templates').insert([
        { user_id: 1, template_id: 1, file_name: "Floyd's First Letter", serialized_options: { name: "Floyd" } }, // ID 1
        { user_id: 2, template_id: 1, file_name: "First Letter to Santa", serialized_options: { name: "ITS A ME, MARIO" } }, // ID 2
        { user_id: 1, template_id: 1, file_name: "Floyd's Second Letter", serialized_options: { name: "Also Floyd" } } // ID 3
      ]);
    });
}