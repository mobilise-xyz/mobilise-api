var request = require('supertest');
var app = require('../app');
var chai = require('chai');

var expect = chai.expect;

const adminEmail = 'seededadmin@testing.com';
const adminPassword = 'Admin123';

const volunteerEmail = 'seededvolunteer@testing.com';
const volunteerPassword = 'Volunteer123';

describe('Retrieving users', function() {
  it('Unauthorised user cannot retrieve a user by id', function(done) {
    request(app)
      .get('/users/8fa1b3d0-80b6-11e9-bc42-526af7764f65')
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('Authorised user can retrieve a user by id', function(done) {
    request(app)
      .post('/auth/login')
      .send(
          {
          email: adminEmail,
          password: adminPassword
          }
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
          request(app)
          .get('/users/8fa1b3d0-80b6-11e9-bc42-526af7764f65')
          .set('Authorization', 'Bearer '+response.body.token)
          .set('Accept', 'application/json')
          .expect(200, done);
      })
  });
})