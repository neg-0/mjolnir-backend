
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('templates').del()
    .then(function () {
      // Inserts seed entries
      return knex('templates').insert([
        {
          title: 'Letter to Santa', body: `Dear Santa,
        My name is {NAME}. I am {AGE} years old. I'm really looking forward to Christmas and your visit! I've been really good this year - well, mostly!
        There are a few very special things I would really like. They are:
        
        {ITEM_LIST}
        
        Your friend,
        {NAME}
        
        {SALUTATION}` },
        { title: 'letter to ex', body: ' very long string here' }
      ]);
    });
};
