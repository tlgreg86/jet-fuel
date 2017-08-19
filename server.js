const express = require('express');
const bodyParser = require('body-parser');

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
    .then(folders => {
      response.status(200).json(folders);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/folders', (request, response) => {
  const newFolder = request.body;

  for (let requiredParameter of ['folder_name']) {
    if (!newFolder[requiredParameter]) {
      return response.status(422).json(
        `Missing required parameter ${requiredParameter}`
      );
    }
  }
  database('folders')
    .insert(newFolder, '*')
    .then(folder => {
      response.status(201).json(folder)
    })
    .catch(error => {
      response.status(500).json({error})
    })
  })

app.get('/api/v1/links', (request, response) => {
  database('folders').select()
    .then(folder => {
      response.status(200).json(folder);
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`)
});

module.exports = app;
