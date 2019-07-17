var request = require('supertest');
var app = require('../../app');
const Role = require('../../server/models').Role;
var { describe, it, after } = require("mocha")

const Seeded = require('../../server/utils/seeded');

describe('Delete a role', function() {

  after(function() {
    Role.create({
      name: Seeded.roles[0].name,
      involves: Seeded.roles[0].involves,
      colour: Seeded.roles[0].colour
    })
  })

  it('Does not allow unauthorised request to delete a role', function(done) {
    request(app)
      .delete('/roles')
      .send({
        name: Seeded.roles[0].name
      })
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('Does not allow volunteer to delete existing role', function(done){
    // Acquire bearer token
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
      .then(response => {
        // Use bearer token to add role
        request(app)
          .delete('/roles')
          .send(
            {
              name: Seeded.roles[0].name,
            }
          )
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer '+response.body.token)
          .expect(401, done);
      });
  });

  it('Allows admin to delete existing role', function(done){
    // Acquire bearer token
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
      .then(response => {
        // Use bearer token to add role
        request(app)
          .delete('/roles')
          .send(
            {
              name: Seeded.roles[0].name,
            }
          )
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer '+response.body.token)
          .expect(200, done);
      });
  })

});