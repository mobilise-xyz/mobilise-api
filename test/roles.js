var request = require('supertest');
var app = require('../app');
var chai = require('chai');

var expect = chai.expect;

describe('Add roles', function() {
  it('Does not allow unauthorised request to add role', function(done) {
    request(app)
      .post('/roles')
      .send(
        {
          name: 'Drivers mate',
          involves: 'Some heavy lifting',
        }
      )
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('Does not allow non-admin to add role', function(done){
    // Acquire bearer token
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
      .then(response => {
        // Use bearer token to add role
        request(app)
          .post('/roles')
          .send(
            {
              name: 'Drivers mate',
              involves: 'Some heavy lifting',
            }
          )
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer '+response.body.token)
          .expect(401, done);
      })
  })

  it('Allows admin to add role', function(done){
    // Acquire bearer token
    request(app)
      .post('/auth/login')
      .send(
        {
          email: 'testadmin@testing.com',
          password: 'Admin123'
        }
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
        // Use bearer token to add role
        request(app)
          .post('/roles')
          .send(
            {
              name: 'Drivers mate',
              involves: 'Some heavy lifting',
            }
          )
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer '+response.body.token)
          .expect(201, done);
      });
    })
  })


describe('Retrieve roles', function() {
  it('Does not allow unauthorised requests to get roles', function(done) {
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
          email: 'testvolunteer@testing.com',
          password: 'Volunteer123'
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