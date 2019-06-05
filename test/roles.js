var request = require('supertest');
var app = require('../app');
var chai = require('chai');

const Role = require('../server/models').Role;

var expect = chai.expect;

const adminEmail = 'seededadmin@testing.com';
const adminPassword = 'Admin123';

const volunteerEmail = 'seededvolunteer@testing.com';
const volunteerPassword = 'Volunteer123';

const roleName = "Test Role";
const roleInvolves = "Testing";

describe('Add roles', function() {

  after( function() {
    Role.destroy({where: {name: roleName}})
  })

  it('Does not allow unauthorised request to add role', function(done) {
    request(app)
      .post('/roles')
      .send(
        {
          name: roleName,
          involves: roleInvolves,
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
          email: volunteerEmail,
          password: volunteerPassword
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
              name: roleName,
              involves: roleInvolves,
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
          email: adminEmail,
          password: adminPassword
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
              name: roleName,
              involves: roleInvolves,
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
          email: volunteerEmail,
          password: volunteerPassword
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