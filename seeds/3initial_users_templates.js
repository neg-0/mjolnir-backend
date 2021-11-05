
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users_templates').del()
    .then(function () {
      // Inserts seed entries
      return knex('users_templates').insert([
        { user_id: 1, template_id: 1, serialized_options: JSON.stringify({ name: "Jim" }) }, // ID 1
        { user_id: 2, template_id: 1, serialized_options: JSON.stringify({ title: "First Letter to Santa", name: "ITS A ME, MARIO" }) }, // ID 2
        { user_id: 1, template_id: 1, serialized_options: JSON.stringify({ name: "test" }) } // ID 3
      ]);
    });
}