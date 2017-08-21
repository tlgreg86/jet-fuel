const folders = [
  { id: 1, folder_name: 'Places' },
];

const urls = [
  {
    id: 1,
    url_title: 'Hawaii',
    long_url: 'https://en.wikipedia.org/wiki/Hawaii',
    short_url: 'myjetfuelapp.com/s4vr4srv',
    folder_id: 1,
  },
  {
    id: 2,
    url_title: 'Japan',
    long_url: 'https://en.wikipedia.org/wiki/Japan‎',
    short_url: 'myjetfuelapp.com/b2wa3vra34',
    folder_id: 1,
  },
];

exports.seed = (knex, Promise) => {
  return knex('urls').del()
    .then(() => {
      return knex('folders').del();
    })
    .then(() => {
      return Promise.all(folders.map((folder) => {
        return knex('folders').insert(folder);
      }));
    })
    .then(() => {
      return Promise.all(urls.map((url) => {
        return knex('urls').insert(url);
      }));
    });
};
