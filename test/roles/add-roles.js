var request = require('supertest');
var app = require('../../app');
const Role = require('../../server/models').Role;

const Seeded = require('../../server/utils/seeded');

const test = {
  role: {
    name: 'Test Role',
    involves: 'Testing'
  }
}

describe('Add roles', function() {

  after( function() {
    Role.destroy({where: {name: test.role.name}})
  })

  it('Does not allow unauthorised request to add role', function(done) {
    request(app)
      .post('/roles')
      .send(
        {
          name: test.role.name,
          involves: test.role.involves,
        }
      )
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('Does not allow volunteer to add role', function(done){
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
            }
          )
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer '+response.body.token)
          .expect(401, done);
      })
  })

  it('Allows admin to add new role', function(done){
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
            }
          )
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer '+response.body.token)
          .expect(201, done);
      });
  })

  it('Does not allow admin to add existing role', function(done){
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
            }
          )
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer '+response.body.token)
          .expect(400, done);
      });
  })

});