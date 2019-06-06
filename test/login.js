var request = require('supertest');
var app = require('../app');
var chai = require('chai');

var expect = chai.expect;

const Seeded = require('../server/utils/seeded');

describe('Login user', function() {

  it('Approves correct credentials for volunteer', function(done) {
    request(app)
      .post('/auth/login')
      .send(
        {
          email: Seeded.volunteer.email,
          password: Seeded.volunteer.password
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
        expect(response.body).to.have.property('uid');
        expect(response.body.isAdmin).to.equal(false);
        done();
      })
  });

  it('Approves correct credentials for admin', function(done) {
    request(app)
      .post('/auth/login')
      .send(
        {
          email: Seeded.admin.email,
          password: Seeded.admin.password
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
        expect(response.body).to.have.property('uid');
        expect(response.body.isAdmin).to.equal(true);
        done();
      })
  });

  it('Rejects invalid email', function(done) {
    request(app)
      .post('/auth/login')
      .send(
        {
          email: 'incorrectvolunteer@testing.com',
          password: Seeded.volunteer.password
        }
        )
      .set('Accept', 'application/json')
      .expect(400, done);
  });

  it('Rejects invalid password for volunteer', function(done) {
    request(app)
      .post('/auth/login')
      .send(
        {
          email: Seeded.volunteer.email,
          password: 'Invalid123'
        }
        )
      .set('Accept', 'application/json')
      .expect(400, done);
  });

  it('Rejects invalid password for admin', function(done) {
    request(app)
      .post('/auth/login')
      .send(
        {
          email: Seeded.admin.email,
          password: 'Invalid123'
        }
        )
      .set('Accept', 'application/json')
      .expect(400, done);
  });

})