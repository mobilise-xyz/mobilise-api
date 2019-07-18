var request = require('supertest');
var app = require('../../app');
var { describe, it } = require("mocha")
const Seeded = require('../../server/utils/seeded');

describe('Retrieving users', function() {
  
  it('Unauthorised user cannot retrieve a user by id', function(done) {
    request(app)
      .get(`/users/${Seeded.volunteers[0].UUID}`)
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('Does not allow volunteer to retrieve another volunteer by id', function(done) {
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
      .then((response) => {
          request(app)
          .get(`/users/${Seeded.volunteers[1].UUID}`)
          .set('Authorization', 'Bearer '+response.body.token)
          .set('Accept', 'application/json')
          .expect(401, done);
      })
  });

  it('Does not allow volunteer to retrieve another admin by id', function(done) {
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
      .then((response) => {
          request(app)
          .get(`/users/${Seeded.admins[0].UUID}`)
          .set('Authorization', 'Bearer '+response.body.token)
          .set('Accept', 'application/json')
          .expect(401, done);
      })
  });

  it('Allows a volunteer to retrieve their own info', function(done) {
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
      .then((response) => {
          request(app)
          .get(`/users/${Seeded.volunteers[0].UUID}`)
          .set('Authorization', 'Bearer '+response.body.token)
          .set('Accept', 'application/json')
          .expect(200, done);
      })
  });

  it('Admin can retrieve a volunteer by id', function(done) {
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
      .then((response) => {
          request(app)
          .get(`/users/${Seeded.volunteers[0].UUID}`)
          .set('Authorization', 'Bearer '+response.body.token)
          .set('Accept', 'application/json')
          .expect(200, done);
      })
  });

  it('Admin can retrieve their own info', function(done) {
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
      .then((response) => {
          request(app)
          .get(`/users/${Seeded.admins[0].UUID}`)
          .set('Authorization', 'Bearer '+response.body.token)
          .set('Accept', 'application/json')
          .expect(200, done);
      })
  });

  it('Admin can retrieve another admin by id', function(done) {
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
      .then((response) => {
          request(app)
          .get(`/users/${Seeded.admins[1].UUID}`)
          .set('Authorization', 'Bearer '+response.body.token)
          .set('Accept', 'application/json')
          .expect(200, done);
      })
  });
})