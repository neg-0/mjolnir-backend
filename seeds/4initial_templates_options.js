
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('template_options').del()
    .then(function () {
      // Inserts seed entries
      return knex('template_options').insert([
        { template_id: 1, option_id: 1, option_name: 'NAME', option_type: 'string', option_text: "Little Timmy" },
        { template_id: 1, option_id: 2, option_name: 'AGE', option_type: 'number', option_text: "7" },
        { template_id: 1, option_id: 3, option_name: 'DISPOSITION', option_type: 'dropdown', option_text: "[naughty,nice]" },
      ]);
    });
};
