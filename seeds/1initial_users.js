
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { user_name: 'Floyd' , password: "Floyd"},
        { user_name: 'Mario' , password: "Mario"},
        { user_name: 'Stephen' , password: "Stephen" }
      ]);
    });
};
