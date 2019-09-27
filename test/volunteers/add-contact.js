let request = require('supertest');
let app = require('../../app');
let { describe, it } = require("mocha");
const Seeded = require('../../server/utils/seeded');

const test = {
  contact: {
    firstName: 'Daniel',
    lastName: 'Smith',
    relation: 'Friend',
    telephone: '07979797979',
    email: 'daniel@test.com',
    volunteerId: Seeded.volunteers[1].UUID
  }
};

describe('Adding emergency contacts', function() {

  it('Unauthorised user cannot add contact to a volunteer by user id', function(done) {
    request(app)
      .post(`/volunteers/${test.contact.volunteerId}/contacts`)
      .send({
        firstName: test.contact.firstName,
        lastName: test.contact.lastName,
        relation: test.contact.relation,
        telephone: test.contact.telephone,
        email: test.contact.email
      })
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('Does not allow a volunteer to add contact to another volunteer', function(done) {
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
          .post(`/volunteers/${test.contact.volunteerId}/contacts`)
          .send({
            firstName: test.contact.firstName,
            lastName: test.contact.lastName,
            relation: test.contact.relation,
            telephone: test.contact.telephone,
            email: test.contact.email
          })
          .set('Authorization', 'Bearer '+response.body.user.token)
          .set('Accept', 'application/json')
          .expect(401, done);
      })
  });

  it('Does not allow an admin to add contact to a volunteer', function(done) {
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
          .post(`/volunteers/${test.contact.volunteerId}/contacts`)
          .send({
            firstName: test.contact.firstName,
            lastName: test.contact.lastName,
            relation: test.contact.relation,
            telephone: test.contact.telephone,
            email: test.contact.email
          })
          .set('Authorization', 'Bearer '+response.body.user.token)
          .set('Accept', 'application/json')
          .expect(401, done);
      })
  });

  it('Allows a volunteer to add their own contact', function(done) {
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
          .post(`/volunteers/${test.contact.volunteerId}/contacts`)
          .send({
            firstName: test.contact.firstName,
            lastName: test.contact.lastName,
            relation: test.contact.relation,
            telephone: test.contact.telephone,
            email: test.contact.email
          })
          .set('Authorization', 'Bearer '+response.body.user.token)
          .set('Accept', 'application/json')
          .expect(201, done);
      })
  });
});