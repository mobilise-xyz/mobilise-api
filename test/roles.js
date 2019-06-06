var request = require('supertest');
var app = require('../app');
const Role = require('../server/models').Role;

const Seeded = require('../server/utils/seeded');

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
          email: Seeded.volunteer.email,
          password: Seeded.volunteer.password
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
          email: Seeded.admin.email,
          password: Seeded.admin.password
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
          email: Seeded.admin.email,
          password: Seeded.admin.password
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
              name: Seeded.role.name,
              involves: Seeded.role.involves,
            }
          )
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer '+response.body.token)
          .expect(400, done);
      });
  })

});


describe('Retrieve roles', function() {
  it('Does not allow unauthorised request to get roles', function(done) {
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
          email: Seeded.volunteer.email,
          password: Seeded.volunteer.password
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

  describe('Remove a role', function() {

    after(function() {
      Role.create({
        name: Seeded.role.name,
        involves: Seeded.role.involves,
        colour: Seeded.role.colour
      })
    })

    it('Does not allow unauthorised request to remove a role', function(done) {
      request(app)
        .delete('/roles')
        .send({
          name: Seeded.role.name
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
            email: Seeded.volunteer.email,
            password: Seeded.volunteer.password
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
                name: Seeded.role.name,
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
            email: Seeded.admin.email,
            password: Seeded.admin.password
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
                name: Seeded.role.name,
              }
            )
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer '+response.body.token)
            .expect(200, done);
        });
    })

  });
})