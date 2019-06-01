var request = require('supertest');
var app = require('../app');
var chai = require('chai');

var expect = chai.expect;

describe('Register Volunteer', function() {

  it('Can register a volunteer', function(done) {
    request(app)
      .post('/auth/register')
      .send(
        {
          firstName: 'Volun',
          lastName: 'Teer',
          email: 'volunteer@testing.com',
          password: 'Volunteer123',
          dob: '1998-11-25'
        }
      )
      .set('Accept', 'application/json')
      .expect(201)
      .end(function(error, response) {
        if (error) {
          done(error);
        }

        expect(response.body.email).to.equal('volunteer@testing.com');
        expect(response.body.firstName).to.equal('Volun');
        expect(response.body.lastName).to.equal('Teer');
        expect(response.body.dob).to.equal('1998-11-25');
        expect(response.body.isAdmin).to.equal(false);
        
        done();
      })
  });

})

describe('Register Admin', function() {

  it('Can register an admin', function(done) {
    request(app)
      .post('/auth/register')
      .send(
        {
          firstName: 'Ad',
          lastName: 'Min',
          email: 'admin@testing.com',
          password: 'Admin123',
          dob: '1998-11-25',
          isAdmin: true
        }
      )
      .set('Accept', 'application/json')
      .expect(201)
      .end(function(error, response) {
        if (error) {
          done(error);
        }

        expect(response.body.email).to.equal('admin@testing.com');
        expect(response.body.firstName).to.equal('Ad');
        expect(response.body.lastName).to.equal('Min');
        expect(response.body.dob).to.equal('1998-11-25');
        expect(response.body.isAdmin).to.equal(true);
        
        done();
      })
  });

})