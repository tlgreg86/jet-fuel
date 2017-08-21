const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const config = require('../knexfile.js').test;
const knex = require('knex')(config);

chai.use(chaiHttp);

describe('Client routes', () => {
  it('should return the homepage', (done) => {
    chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      });
  });

  it('should return error 404 if route does not exist', (done) => {
    chai.request(server)
      .get('/fakeurl')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
  });
});

describe('API Routes', () => {
  before((done) => {
    knex.migrate.latest()
      .then(() => done());
  });

  beforeEach((done) => {
    knex.seed.run()
      .then(() => done());
  });

  describe('GET /api/v1/folders gets all folders', () => {
    it('should return an array of folders', (done) => {
      chai.request(server)
        .get('/api/v1/folders')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('folder_name');
          response.body[0].folder_name.should.equal('Places');
          done();
        });
    });
  });

  describe('POST /api/v1/folders adds to folders', () => {
    it('should create a new folder', (done) => {
      chai.request(server)
        .post('/api/v1/folders')
        .send({
          id: 2,
          folder_name: 'Ships',
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.should.have.property('folder_name');
          response.body.id.should.equal(2);

          chai.request(server)
            .get('/api/v1/folders')
            .end((error, response) => {
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('array');
              response.body.length.should.equal(2);
              response.body[1].folder_name.should.equal('Ships');
              done();
            });
        });
    });

    it('should not create a folder if a parameter is missing', (done) => {
      chai.request(server)
        .post('/api/v1/folders')
        .send({})
        .end((error, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('Missing required parameter folder_name');
          done();
        });
    });
  });

  describe('GET /api/v1/folders/:id/urls', () => {
    it('should return all urls', (done) => {
      chai.request(server)
        .get('/api/v1/folders/1/urls')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[0].should.have.property('url_title');
          response.body[0].url_title.should.equal('Hawaii');
          response.body[0].should.have.property('long_url');
          response.body[0].long_url.should.equal('https://en.wikipedia.org/wiki/Hawaii');
          response.body[0].should.have.property('short_url');
          response.body[0].short_url.should.equal('myjetfuelapp.com/s4vr4srv');
          response.body[0].should.have.property('folder_id');
          response.body[0].folder_id.should.equal(1);
          done();
        });
    });
  });

  describe('POST /api/v1/folders/:id/urls', () => {
    it('should create a new url', (done) => {
      chai.request(server)
        .post('/api/v1/folders/1/urls')
        .send({
          id: 3,
          url_title: 'Florida',
          long_url: 'https://en.wikipedia.org/wiki/Florida',
          folder_id: 1,
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(3);
          response.body.should.have.property('url_title');
          response.body.url_title.should.equal('Florida');
          response.body.should.have.property('long_url');
          response.body.long_url.should.equal('https://en.wikipedia.org/wiki/Florida');
          response.body.should.have.property('short_url');
          response.body.short_url.should.equal('myjetfuelapp.com/7dd31e87');
          response.body.should.have.property('folder_id');
          response.body.folder_id.should.equal(1);

          chai.request(server)
            .get('/api/v1/folders/1/urls')
            .end((error, response) => {
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('array');
              response.body.length.should.equal(3);
              response.body[2].should.have.property('url_title');
              response.body[2].url_title.should.equal('Florida');
              response.body[2].should.have.property('long_url');
              response.body[2].long_url.should.equal('https://en.wikipedia.org/wiki/Florida');
              response.body[2].should.have.property('short_url');
              response.body[2].short_url.should.equal('myjetfuelapp.com/7dd31e87');
              response.body[2].should.have.property('folder_id');
              response.body[2].folder_id.should.equal(1);
              done();
            });
        });
    });

    it('should not create a url with missing parameters', (done) => {
      chai.request(server)
        .post('/api/v1/folders/1/urls')
        .send({
          id: 4,
          long_url: 'https://en.wikipedia.org/wiki/Russia',
          folderID: 1,
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('Missing required parameter url_title');
          done();
        });
    });
  });

  describe('GET /api/v1/urls/:id', () => {
    it.skip('should return the original url', (done) => {
      chai.request(server)
        .get('/api/v1/urls/1')
        .end((error, response) => {
          console.log(response.body);
          response.should.have.status(200);
          response.should.be.html;
          response.body.should.be.a('object');
          response.body.should.equal('https://en.wikipedia.org/wiki/Hawaii');
          done();
        });
    });
  });
});
