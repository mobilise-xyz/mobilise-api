let request = require('supertest');
let app = require('../../app');
let { describe, it } = require("mocha");

const Seeded = require('../../server/utils/seeded');

describe('Get metric', function() {

  it('Does not allow unauthorised request to get metric', function(done) {
    request(app)
      .get('/metric')
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('Allows authorised request to get metric', function(done) {
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
          .get('/metric')
          .set('Authorization', 'Bearer '+response.body.user.token)
          .set('Accept', 'application/json')
          .expect(200, done);
      });
  });
});