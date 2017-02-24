exports.seed = function(knex, Promise) {
  return knex('ideas').del()
  .then(() => {
    return Promise.all([
      knex('ideas').insert({
        id: 1,
        title: 'Idea One',
        body: 'This is idea one body.',
        created_at: new Date
      }),
      knex('ideas').insert({
        id: 2,
        title: 'Title Two',
        body: 'This is idea two body.',
        created_at: new Date
      })
    ]);
  });
};
