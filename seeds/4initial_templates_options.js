
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('template_options').del()
    .then(function () {
      // Inserts seed entries
      return knex('template_options').insert([
        { template_id: 1, option_name: 'NAME', option_type: 'string', option_text: JSON.stringify("Little Timmy") },
        { template_id: 1, option_name: 'AGE', option_type: 'number', option_text: JSON.stringify("7") },
        { template_id: 1, option_name: 'DISPOSITION', option_type: 'dropdown', option_text: JSON.stringify(["good", "naughty"]) },
        { template_id: 1, option_name: 'GENDER', option_type: 'dropdown', option_text: JSON.stringify(["boy", "girl"]) },
        { template_id: 1, option_name: 'ITEM_LIST', option_type: 'unordered_list', option_text: JSON.stringify(["train set", "pony", "transformer"]) },
        { template_id: 1, option_name: 'SALUTATION', option_type: 'boolean', option_text: JSON.stringify("Merry Christmas") },
        { template_id: 2, option_name: 'BF', option_type: 'string', option_text: JSON.stringify("A-Hole") },
        { template_id: 2, option_name: 'ITEM_LIST', option_type: 'unordered_list', option_text: JSON.stringify(["car", "sopranos blue ray", "transformer", "your best friend Charlie"]) },
        { template_id: 2, option_name: 'PET_TYPE', option_type: 'string', option_text: JSON.stringify("Zebra") },
        { template_id: 2, option_name: 'PET_NAME', option_type: 'string', option_text: JSON.stringify("A-Hole II") },
        { template_id: 2, option_name: 'NUMBER_KIDS', option_type: 'number', option_text: JSON.stringify("3") },
        { template_id: 2, option_name: 'NAME', option_type: 'string', option_text: JSON.stringify("Princess Sophia") },
        { template_id: 3, option_name: 'BOSS_NAME', option_type: 'string', option_text: JSON.stringify("Da Boss") },
        { template_id: 3, option_name: 'COMPANY_NAME', option_type: 'string', option_text: JSON.stringify("Company") },
        { template_id: 3, option_name: 'YEARS', option_type: 'string', option_text: JSON.stringify("##") },
        { template_id: 3, option_name: 'LIST_OF_THINGS', option_type: 'unordered_list', option_text: JSON.stringify(["something", "more stuff"]) },
        { template_id: 3, option_name: 'YOUR_NAME', option_type: 'string', option_text: JSON.stringify("McLovin") },
        { template_id: 4, option_name: 'NAME', option_type: 'string', option_text: JSON.stringify(" name ") },
        { template_id: 4, option_name: 'AGE', option_type: 'number', option_text: JSON.stringify("69") },
        { template_id: 4, option_name: 'HEIGHT', option_type: 'number', option_text: JSON.stringify("5.9") },
        { template_id: 4, option_name: 'TIME_SPENT', option_type: 'dropdown', option_text: JSON.stringify(["terrible", "inefficient", "sad", ">:neutral_face:", "regretful", "productive"]) }
      ]);
    });
};