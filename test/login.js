var request = require('supertest');
var app = require('../app');
var chai = require('chai');

var expect = chai.expect;

const seededEmail = 'seededvolunteer@testing.com'
const seededPassword = 'Volunteer123'

describe('Login user', function() {

  it('Approves correct credentials', function(done) {
    request(app)
      .post('/auth/login')
      .send(
        {
          email: seededEmail,
          password: seededPassword
        }
        )
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(error, response) {
        if (error) {
          done(error);
        }
        
        // Ensure that we return the JSON Web Token back
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
          password: seededPassword
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
          email: seededEmail,
          password: 'Invalid123'
        }
        )
      .set('Accept', 'application/json')
      .expect(400, done);
  });

})