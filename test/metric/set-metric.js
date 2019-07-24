let request = require('supertest');
let app = require('../../app');
let { describe, it } = require("mocha");

const Seeded = require('../../server/utils/seeded');

const test = {
  metric: {
    name: 'people',
    verb: 'fed',
    value: 311313
  }
};

describe('Update metric', function() {

  it('Does not allow unauthorised request to update metric', function(done) {
    request(app)
      .post('/metric')
      .send(
        {
          name: test.metric.name,
          verb: test.metric.verb,
          value: test.metric.value
        }
      )
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('Does not allow volunteer to update metric', function(done) {
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
          .post('/metric')
          .send(
            {
              name: test.metric.name,
              verb: test.metric.verb,
              value: test.metric.value
            }
          )
          .set('Authorization', 'Bearer '+response.body.user.token)
          .set('Accept', 'application/json')
          .expect(400, done);
      });
  });

  it('Allows admin to update metric', function(done) {
    // Acquire bearer token
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
      .then(response => {
        // Use bearer token to get roles
        request(app)
          .post('/metric')
          .send(
            {
              name: test.metric.name,
              verb: test.metric.verb,
              value: test.metric.value
            }
          )
          .set('Authorization', 'Bearer '+response.body.user.token)
          .set('Accept', 'application/json')
          .expect(200, done);
      });
  });

});