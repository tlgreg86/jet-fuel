
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
              { long_url: 'http://www.abcdefghijklmnop.com',
                short_url: 'www.a.com',
                folder_id: folder[0],
                url_title: 'ABC\'s'
              },
              { long_url: 'http://www.zebrastripes.com',
                short_url: 'www.z.com',
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
