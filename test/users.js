var request = require('supertest');
var app = require('../app');

const Seeded = require('../server/utils/seeded');

describe('Retrieving users', function() {
  
  it('Unauthorised user cannot retrieve a user by id', function(done) {
    request(app)
      .get(`/users/${Seeded.volunteers[0].UUID}`)
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('Admin can retrieve a user by id', function(done) {
    request(app)
      .post('/auth/login')
      .send(
          {
          email: Seeded.admins[0].email,
          password: Seeded.admins[0].password
          }
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
          request(app)
          .get(`/users/${Seeded.volunteers[0].UUID}`)
          .set('Authorization', 'Bearer '+response.body.token)
          .set('Accept', 'application/json')
          .expect(200, done);
      })
  });
})