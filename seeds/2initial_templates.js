
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
        {
          title: 'Letter to ex', body: `Dear {BF},
          Things have been bad for a while. And it is all your fault. Whether through ignorance or lack of mental fortitude you have failed to notice and reconcile your attitude/behavior. I will thus be taking:

          {ITEM_LIST}

        as well as our {PET_TYPE} {PET_NAME}. You can keep the {NUMBER_KIDS} kids and any other undesirables.

        I pray that this is our last correspondence. Knowing you has been the worst experience ever.

        Your ex,
        {NAME}` },
        {
          title: 'Resignation letter', body: `Dear {BOSS_NAME},

        I am writing to announce my resignation from {COMPANY_NAME}, effective two weeks from this date.

        This was not an easy decision to make. The past {YEARS} years have been very
        rewarding. I've enjoyed working for you and managing a very successful team dedicated to:

        {LIST_OF_THINGS}

        Thank you for the opportunities for growth that you have provided me. I wish you and {COMPANY_NAME}
        all the best. If I can be of any help during the transition, please don't hesitate to ask.

        Sincerely,
        {YOUR_NAME}`},
        {
          title: 'Formy McForm', body: `This form is form filling practice for those with too much time on their hands and have made the TERRIBLE choice to fill out this form. Please input your name here ({ NAME }).

          If you have made it this far and still wish to continue, input you Age: ({ AGE }) & Height: ({ HEIGHT }), after inputting the information please take a moment to stop, pause..., and think about how you spend your time. This was a { TIME_SPENT } use of your time.

          Thank you { NAME } for filling out this form.

          In the future please find a better use of your time!`
        }
      ]);
    });
};