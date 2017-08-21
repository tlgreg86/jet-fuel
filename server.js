const express = require('express');
const bodyParser = require('body-parser');
const shortHash = require('short-hash');

const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);

app.use(express.static('public'));

app.locals.title = 'Jet Fuel';

app.get('/api/v1/folders', (request, response) => {
  database('folders').select()
    .then((folders) => {
      response.status(200).json(folders);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/folders', (request, response) => {
  const newFolder = request.body;

  for (const requiredParameter of ['folder_name']) {
    if (!newFolder[requiredParameter]) {
      return response.status(422).json(
        `Missing required parameter ${requiredParameter}`
      )
    }
  }
  database('folders')
    .insert(newFolder, '*')
    .then((folder) => {
      response.status(201).json(folder[0]);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/folders/:id/urls', (request, response) => {
  database('urls')
    .where('folder_id', request.params.id)
    .select()
    .then((urls) => {
      response.status(200).json(urls);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/folders/:id/urls', (request, response) => {
  const newUrl = request.body;

  for (const requiredParameter of ['long_url', 'url_title']) {
    if (!newUrl[requiredParameter]) {
      return response.status(422).json(
        `Missing required parameter ${requiredParameter}`
      );
    }
  }

  newUrl.short_url = `myjetfuelapp.com/${shortHash(newUrl.long_url)}`;
  newUrl.folder_id = request.params.id;

  database('folders').select()
    .then((folder) => {
      database('urls').insert(newUrl, '*')
        .then((url) => {
          response.status(201).json(url[0]);
        })
        .catch((error) => {
          response.status(500).json({ error });
        });
    });
});

app.route('/api/v1/urls/:id')
  .get((request, response) => {
    database('urls')
      .select()
      .where('id', request.params.id)
      .then((url) => {
        response.status(302).redirect(url[0].long_url);
      })
      .catch((error) => {
        response.status(500).json({ error });
      });
  });

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});

module.exports = app;
