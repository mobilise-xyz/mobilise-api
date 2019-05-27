var request = require('supertest');
var app = require('../app');

describe('Register users', function() {
  it('Can register a user', function(done) {
    request(app)
      .post('/users/register')
      .send(
        {
          id: '8fa1b90c-80b6-11e9-bc42-526af7764f64',
          firstName: 'James',
          lastName: 'Test',
          email: 'jamestest@testing.com',
          password: 'Testing123',
          dob: '1998-11-25'
        }
        )
      .set('Accept', 'application/json')
      .expect(201, done);
  });
})

describe('Login users', function() {
  it('Approves correct credentials', function(done) {
    request(app)
      .post('/users/login')
      .send(
        {
          email: 'testvolunteer@testing.com',
          password: 'Volunteer123'
        }
        )
      .set('Accept', 'application/json')
      .expect(200, done);
  });
  it('Rejects invalid email', function(done) {
    request(app)
      .post('/users/login')
      .send(
        {
          email: 'incorrectvolunteer@testing.com',
          password: 'Volunteer123'
        }
        )
      .set('Accept', 'application/json')
      .expect(400, done);
  });
  it('Rejects invalid password', function(done) {
    request(app)
      .post('/users/login')
      .send(
        {
          email: 'testvolunteer@testing.com',
          password: 'Invalid123'
        }
        )
      .set('Accept', 'application/json')
      .expect(400, done);
  });
})

describe('Retrieve shifts', function() {
  it('Does not allow unauthorised requests to get shifts', function(done) {
    request(app)
      .get('/shifts')
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('Allows authorised request to get shifts', function(done) {
    // Acquire bearer token
    request(app)
      .post('/users/login')
      .send(
        {
          email: 'testvolunteer@testing.com',
          password: 'Volunteer123'
        }
        )
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
        // Use bearer token to get shifts
        request(app)
        .get('/shifts')
        .set('Authorization', 'Bearer '+response.body.token)
        .set('Accept', 'application/json')
        .expect(200, done);
      });
  });
})

describe('Add shifts', function() {
  it('Does not allow unauthorised request to add shift', function(done) {
    request(app)
      .post('/shifts')
      .send(
      {
        title: 'Food pickup',
        description: 'I mean its pretty self explanatory mate',
      }
      )
      .set('Accept', 'application/json')
      .expect(401, done);
  });
  
  it('Does not allow non-admin to add shift', function(done){
    // Acquire bearer token
    request(app)
      .post('/users/login')
      .send(
        {
          email: 'testvolunteer@testing.com',
          password: 'Volunteer123'
        }
        )
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
        // Use bearer token to add shift
        request(app)
        .post('/shifts')
        .send(
        {
          title: 'Food pickup',
          description: 'I mean its pretty self explanatory mate',
        }
        )
        .set('Authorization', 'Bearer '+response.body.token)
        .set('Accept', 'application/json')
        .expect(401, done);
      });
  }) 

  it('Allows admin to add shift', function(done){
    // Acquire bearer token
    request(app)
      .post('/users/login')
      .send(
        {
          email: 'testadmin@testing.com',
          password: 'Admin123'
        }
        )
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
        // Use bearer token to add shift
        request(app)
        .post('/shifts')
        .send(
        {
          title: 'Food pickup',
          description: 'I mean its pretty self explanatory mate',
        }
        )
        .set('Authorization', 'Bearer '+response.body.token)
        .set('Accept', 'application/json')
        .expect(201, done);
      });
  })
})