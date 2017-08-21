// Brings in express which sits on Node.js and make it easier to use
const express = require('express');
// Middleware that parses the data from incoming requests
const bodyParser = require('body-parser');
// Used to create the shortened url
const shortHash = require('short-hash');
// Creates a new instance of the express server called app
const app = express();
// If process.env.NODE_ENV value is not defined, set environment to development
// This serves more of a purpose when you go to push app to production
const environment = process.env.NODE_ENV || 'test';
// Gives us access to the object that contains all of the environments information
const configuration = require('./knexfile')[environment];
// Create a new postgres database using knex
const database = require('knex')(configuration);
// applys bodyparser to all incoming requests to parse the request body
app.use(bodyParser.json());
// Only parse urlencoded bodies where the Content-type header matches 'type'
app.use(bodyParser.urlencoded({ extended: true }));
// If the port isn't set the default to localhost:3000
app.set('port', process.env.PORT || 3000);
// Using the public directory to serve assets
app.use(express.static('public'));
// Setting Jet Fuel as the title of the local server
app.locals.title = 'Jet Fuel';
// Get route listening for requests to /api/v1/folders
app.get('/api/v1/folders', (request, response) => {
  // Selects all of the entries in the folders database
  database('folders').select()
  // sends them back to the client
    .then((folders) => {
      // if they come back ok they get a status 200
      response.status(200).json(folders);
    })
    // if they don't come back ok
    .catch((error) => {
      // they get a status 500 internal server error
      response.status(500).json({ error });
    });
});
// listens for post request to /api/v1/folders
app.post('/api/v1/folders', (request, response) => {
  // set the body of the request to a constant
  const newFolder = request.body;
  // loops through each of the requests parameters
  for (const requiredParameter of ['folder_name']) {
    // if the request body doesn't have one of the parameters
    if (!newFolder[requiredParameter]) {
      // return a status of 422 to the client
      return response.status(422).json({
        // tells the client what parameter(s) they are missing
        error: `Missing required parameter ${requiredParameter}`
      })
    }
  }
  // If all of the required parameters are entered
  database('folders')
  // the request goes on and inserts(posts) the request body, expected the whole body back
    .insert(newFolder, '*')
    // sends it to the client
    .then((folder) => {
      // if successful give status 201 for successful post
      response.status(201).json(folder[0]);
    })
    // if unsuccessful
    .catch((error) => {
      // sends a status 409 for duplicate folder names
      response.status(409).json({
        error: 'Folder name already exists',
      });
    });
});
// listens for get request to /api/v1/folders/:id/urls
app.get('/api/v1/folders/:id/urls', (request, response) => {
  // selects the database urls
  database('urls')
    // filters all values where the folder id is equal to request params id
    .where('folder_id', request.params.id)
    // selects the database values filtered
    .select()
    // sends all of the urls filtered to the client
    .then((urls) => {
      // if successful returns status 200
      response.status(200).json(urls);
    })
    // if there is an error
    .catch((error) => {
      // send internal server error status 500 back
      response.status(500).json({ error });
    });
});
// listens for post request at /api/v1/folders/:id/urls
app.post('/api/v1/folders/:id/urls', (request, response) => {
  // // set the body of the request to a constant
  const newUrl = request.body;
  // loops through each of the requests parameters
  for (const requiredParameter of ['long_url', 'url_title']) {
    // if the request body doesn't have one of the parameters
    if (!newUrl[requiredParameter]) {
      // return a status of 422 to the client
      return response.status(422).json({
        // tells the client what parameter(s) they are missing
        error: `Missing required parameter ${requiredParameter}`
      })
    }
  }
  // adds the short url to the request body
  newUrl.short_url = `myjetfuelapp.com/${shortHash(newUrl.long_url)}`;
  // adds the folder id to the request body
  newUrl.folder_id = request.params.id;
  // if all parameters are there
  database('folders').select()
    // then send the request to the client
    .then((folder) => {
      // using .insert add the request body to the database
      database('urls').insert(newUrl, '*')
        // if successful
        .then((url) => {
          // return status 201 for successful post
          response.status(201).json(url[0]);
        })
        // if not successful
        .catch((error) => {
          // return status 409 for duplicate url
          response.status(409).json({
            error: 'Url already exists, try again',
          });
        });
    });
});
// listens for route /api/v1/urls/:id to be requested
app.route('/api/v1/urls/:id')
// makes get request to
  .get((request, response) => {
    // urls database
    database('urls')
    // selects database values
      .select()
      // where the id of the url is equal to the request parameters id
      .where('id', request.params.id)
      // if successful
      .then((url) => {
        // return a status 302 and redirect the client to the original long url
        response.status(302).redirect(url[0].long_url);
      })
      // if unsuccessful
      .catch((error) => {
        // return status 500 for internal server error
        response.status(500).json({ error });
      });
  });
// listens for route set on line 21
app.listen(app.get('port'), () => {
  // if that route is requested then log the name of the server and the port it is running on
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});
// Export the server for testing
module.exports = app;
