var knex = require('../db/knex')
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('Client routes', () => {
  it('should return the homepage with text', (done) => {
    chai.request(server)
    .get('/')
    .end((error, response) => {
      response.should.have.status(200);
      response.should.be.html;
      done();
    })
  })
});

// describe('API Routes', () => {
//   beforeEach((done) => {
//     knex.migrate.rollback()
//     .then(() => knex.migrate.latest())
//     .then(() => knex.seed.run())
//     .then(() => done());
//   })
//
//   describe('GET /api/v1/folders gets all folders', () => {
//     it('should return an array of folders', (done) => {
//       chai.request(server)
//       .get('/api/v1/folders')
//       .end(error, response) => {
//         response.should.have.status(200);
//         done();
//       }
//     })
//   })
// })
