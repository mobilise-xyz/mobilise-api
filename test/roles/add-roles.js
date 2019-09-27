let request = require('supertest');
let app = require('../../app');
const {Role} = require('../../server/models');
let { describe, it, after } = require("mocha");

const Seeded = require('../../server/utils/seeded');

const test = {
  role: {
    name: 'Test Role',
    involves: 'Testing',
    colour: '#0B0BD0'
  }
};

describe('Add roles', function () {

  after(async () => {
    await Role.destroy({ where: { name: test.role.name } });
  });

  it('Does not allow unauthorised request to add role', function (done) {
    request(app)
      .post('/roles')
      .send(
        {
          name: test.role.name,
          involves: test.role.involves,
          colour: test.role.colour
        }
      )
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('Does not allow volunteer to add role', function (done) {
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
          .post('/roles')
          .send(
            {
              name: test.role.name,
              involves: test.role.involves,
              colour: test.role.colour
            }
          )
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + response.body.user.token)
          .expect(401, done);
      })
  });

  it('Allows admin to add new role', function (done) {
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
          .post('/roles')
          .send(
            {
              name: test.role.name,
              involves: test.role.involves,
              colour: test.role.colour
            }
          )
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + response.body.user.token)
          .expect(201, done);
      });
  });

  it('Does not allow admin to add existing role', function (done) {
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
          .post('/roles')
          .send(
            {
              name: Seeded.roles[0].name,
              involves: Seeded.roles[0].involves,
              colour: Seeded.roles[0].colour
            }
          )
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + response.body.user.token)
          .expect(400, done);
      });
  })
});