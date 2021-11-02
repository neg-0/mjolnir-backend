
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { user_name: 'Floyd' },
        { user_name: 'Mario' },
        { user_name: 'Stephen' }
      ]);
    });
};
