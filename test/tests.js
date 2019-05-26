var request = require('supertest');
var app = require('../app');

describe('GET /shifts', function() {
  it('responds with json', function(done) {
    request(app)
      .get('/shifts')
      .set('Accept', 'application/json')
      .expect(200, done);
  });
})

describe('POST /shifts', function() {
  it('responds with json', function(done) {
    request(app)
      .post('/shifts')
      .send(
        {
          title: 'Fundraising event',
          description: 'We gonna make some money'
        }
        )
      .set('Accept', 'application/json')
      .expect(201, done);
  });
})