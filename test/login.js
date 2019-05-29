var request = require('supertest');
var app = require('../app');
var chai = require('chai');

var expect = chai.expect;

describe('Login user', function() {

  it('Approves correct credentials', function(done) {
    request(app)
      .post('/auth/login')
      .send(
        {
          email: 'testvolunteer@testing.com',
          password: 'Volunteer123'
        }
        )
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(error, response) {
        if (error) {
          done(error);
        }

        expect(response.body).to.have.property('token');
        done();
      })
  });

  it('Rejects invalid email', function(done) {
    request(app)
      .post('/auth/login')
      .send(
        {
          email: 'incorrectvolunteer@testing.com',
          password: 'Volunteer123'
        }
        )
      .set('Accept', 'application/json')
      .expect(400, done);
  });

  it('Rejects invalid password', function(done) {
    request(app)
      .post('/auth/login')
      .send(
        {
          email: 'volunteer@testing.com',
          password: 'Invalid123'
        }
        )
      .set('Accept', 'application/json')
      .expect(400, done);
  });

})