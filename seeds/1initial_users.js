
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { user_name: 'Floyd', password: "1e3974507e8d6e1a670414a6d07e98911d9cf600c946138faeb01df81cd124ad" },
        { user_name: 'Mario', password: "1e3974507e8d6e1a670414a6d07e98911d9cf600c946138faeb01df81cd124ad" },
        { user_name: 'Stephen', password: "1e3974507e8d6e1a670414a6d07e98911d9cf600c946138faeb01df81cd124ad" }
      ]);
    });
};
