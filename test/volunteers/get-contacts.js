let request = require('supertest');
let app = require('../../app');
let { describe, it } = require("mocha");
const Seeded = require('../../server/utils/seeded');

describe('Get emergency contacts', function() {

  it('Unauthorised user cannot retrieve get contacts for a volunteer by user id', function(done) {
    request(app)
      .get(`/volunteers/${Seeded.volunteers[0].UUID}/contacts`)
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('Does not allow a volunteer to view contacts of another volunteer', function(done) {
    request(app)
      .post('/auth/login')
      .send({
        email: Seeded.volunteers[1].email,
        password: Seeded.volunteers[1].password
      })
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        request(app)
          .get(`/volunteers/${Seeded.volunteers[0].UUID}/contacts`)
          .set('Authorization', 'Bearer '+response.body.user.token)
          .set('Accept', 'application/json')
          .expect(401, done);
      })
  });

  it('Allows a volunteer to get their own contacts', function(done) {
    request(app)
      .post('/auth/login')
      .send({
        email: Seeded.volunteers[0].email,
        password: Seeded.volunteers[0].password
      })
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        request(app)
          .get(`/volunteers/${Seeded.volunteers[0].UUID}/contacts`)
          .set('Authorization', 'Bearer '+response.body.user.token)
          .set('Accept', 'application/json')
          .expect(200, done);
      })
  });

  it('Allows an admin to get volunteer contacts', function(done) {
    request(app)
      .post('/auth/login')
      .send({
        email: Seeded.admins[0].email,
        password: Seeded.admins[0].password
      })
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        request(app)
          .get(`/volunteers/${Seeded.volunteers[0].UUID}/contacts`)
          .set('Authorization', 'Bearer '+response.body.user.token)
          .set('Accept', 'application/json')
          .expect(200, done);
      })
  });
});