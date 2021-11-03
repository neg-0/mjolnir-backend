
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('template_options').del()
    .then(function () {
      // Inserts seed entries
      return knex('template_options').insert([
        { template_id: 1, option_id: 1, option_name: 'DISPOSITION', option_type: 'boolean', option_text: "input string" },
        { template_id: 2, option_id: 77, option_name: 'DISPOSITION', option_type: 'integer', option_text: "input string" },
        { template_id: 1, option_id: 22, option_name: 'DISPOSITION', option_type: 'boolean', option_text: "input string" },
      ]);
    });
};
