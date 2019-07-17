var request = require('supertest');
var app = require('../../app');
const Role = require('../../server/models').Role;

const Seeded = require('../../server/utils/seeded');

describe('Get roles', function() {

  it('Does not allow unauthorised request to get roles', function(done) {
    request(app)
      .get('/roles')
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('Allows authorised request to get roles', function(done) {
    // Acquire bearer token
    request(app)
      .post('/auth/login')
      .send(
        {
          email: Seeded.volunteers[0].email,
          password: Seeded.volunteers[0].password
        }
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
        // Use bearer token to get roles
        request(app)
        .get('/roles')
        .set('Authorization', 'Bearer '+response.body.token)
        .set('Accept', 'application/json')
        .expect(200, done);
      });
  });

})