
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('templates').del()
    .then(function () {
      // Inserts seed entries
      return knex('templates').insert([
        { title: 'letter to Santa', body: 'long string here' },
        { title: 'letter to ex', body: ' very long string here' }
      ]);
    });
};
