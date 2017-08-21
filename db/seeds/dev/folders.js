
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('urls').del()
    .then(() => knex('folders').del())
      .then(() => {
        return Promise.all([
          knex('folders').insert({
            folder_name: 'Games'
          }, 'id')
          .then(folder => {
            return knex('urls').insert([
              { long_url: 'https://en.wikipedia.org/wiki/ABCs_(song)',
                short_url: 'https://www.abc.com',
                folder_id: folder[0],
                url_title: 'ABC\'s'
              },
              { long_url: 'https://en.wikipedia.org/wiki/Zebra',
                short_url: 'https://www.zebra.com',
                folder_id: folder[0],
                url_title: 'Zebras'
              }
            ])
          })
          .then(() => console.log('Seeding complete!'))
          .catch(error => console.log(`Error seeding data: ${error}`))
        ])
      })
      .catch(error => console.log(`Error seeding data: ${error}`));
};
