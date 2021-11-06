
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users_templates').del()
    .then(function () {
      // Inserts seed entries
      return knex('users_templates').insert([
        { user_id: 1, template_id: 1, file_name: "Floyd's First Letter", serialized_options: { NAME: "Floyd" } },
        { user_id: 2, template_id: 1, file_name: "First Letter to Santa", serialized_options: { NAME: "ITS A ME, MARIO", AGE: 36, DISPOSITION: 'naughty', GENDER: "boy", ITEM_LIST: ['shoes', "Jessica Alba's phone number", 'ammo'], SALUTATION: true } },
        { user_id: 1, template_id: 1, file_name: "Floyd's Second Letter", serialized_options: { NAME: "Also Floyd" } }
      ]);
    });
}