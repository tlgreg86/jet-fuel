// process.env.NODE_ENV = 'test';

const knex = require('../db/knex')
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

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
    })
  })
})

describe('API Routes', () => {
  before((done) => {
    knex.migrate.latest()
      .then(() => done())
  });

  beforeEach((done) => {
    knex.seed.run()
      .then(() => done())
  });

  describe('GET /api/v1/folders gets all folders', () => {
    it('should return an array of folders', (done) => {
      chai.request(server)
      .get('/api/v1/folders')
      .end(error, response) => {
        response.should.have.status(200);
        done();
      }
    })
  })
})
