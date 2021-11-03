
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users_templates').del()
    .then(function () {
      // Inserts seed entries
      return knex('users_templates').insert([
        { user_id: 1, template_id: 1, serialized_options: 'user_1 supplied form data' }, // ID 1
        { user_id: 1, template_id: 1, serialized_options: 'user_2 supplied form data' }, // ID 2
        { user_id: 1, template_id: 1, serialized_options: 'user_1 supplied form data' } // ID 3
      ]);
    });
}