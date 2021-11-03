
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { user_name: 'Floyd' , password: "#####"},
        { user_name: 'Mario' , password: "#####"},
        { user_name: 'Stephen' , password: "#####" }
      ]);
    });
};
