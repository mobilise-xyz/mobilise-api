var request = require('supertest');
var app = require('../../../app');

const Seeded = require('../../../server/utils/seeded');

test = {
  contactPreferences: {
    email: true,
    text: true
  }
}

describe('Updating contact information', function() {
  
  it('Unauthorised user cannot retrieve contact preferences of a volunteer by user id', function(done) {
    request(app)
      .put(`/users/${Seeded.volunteers[0].UUID}/contact-preferences`)
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('Does not allow a volunteer to update contact preferences of another volunteer', function(done) {
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
        .put(`/users/${Seeded.volunteers[1].UUID}/contact-preferences`)
        .send({
            contactPreferences: test.contactPreferences
        })
        .set('Authorization', 'Bearer '+response.body.token)
        .set('Accept', 'application/json')
        .expect(401, done);
      })
  });

  it('Does not allow a volunteer to update contact preferences of an admin', function(done) {
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
          .put(`/users/${Seeded.admins[0].UUID}/contact-preferences`)
          .send({
              contactPreferences: test.contactPreferences
          })
          .set('Authorization', 'Bearer '+response.body.token)
          .set('Accept', 'application/json')
          .expect(401, done);
      })
  });

  it('Does not allow an admin to update contact preferences of another admin', function(done) {
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
          .put(`/users/${Seeded.admins[1].UUID}/contact-preferences`)
          .send({
            contactPreferences: test.contactPreferences
          })
          .set('Authorization', 'Bearer '+response.body.token)
          .set('Accept', 'application/json')
          .expect(401, done);
      })
  });

  it('Does not allow an admin to update contact preferences of a volunteer', function(done) {
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
          .put(`/users/${Seeded.volunteers[0].UUID}/contact-preferences`)
          .send({
            contactPreferences: test.contactPreferences
          })
          .set('Authorization', 'Bearer '+response.body.token)
          .set('Accept', 'application/json')
          .expect(401, done);
      })
  });

  it('Allows a volunteer to update their own contact preferences', function(done) {
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
          .put(`/users/${Seeded.volunteers[0].UUID}/contact-preferences`)
          .send({
            contactPreferences: test.contactPreferences
          })
          .set('Authorization', 'Bearer '+response.body.token)
          .set('Accept', 'application/json')
          .expect(200, done);
      })
  });

  it('Allows an admin to update their own contact preferences', function(done) {
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
          .put(`/users/${Seeded.admins[0].UUID}/contact-preferences`)
          .send({
            contactPreferences: test.contactPreferences
          })
          .set('Authorization', 'Bearer '+response.body.token)
          .set('Accept', 'application/json')
          .expect(200, done);
      })
  });


});