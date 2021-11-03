
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('favorites').del()
    .then(function () {
      // Inserts seed entries
      return knex('favorites').insert([
        {user_id: 1, template_id: 2},
        {user_id: 3, template_id: 1},
        {user_id: 1, template_id: 1}
      ]);
    });
};
