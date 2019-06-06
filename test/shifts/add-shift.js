var request = require("supertest");
var app = require("../../app");

const Seeded = require('../../server/utils/seeded');

const test = {
  shift: {
    title: 'Shift Title',
    description: 'Shift Description',
    date: '2019-02-08',
    start: '16:00',
    stop: '18:00',
    repeatedType: 'Never',
    address: 'SW72AZ'
  }
}

describe("Add shifts", function() {
  it("Does not allow unauthorised request to add shift", function(done) {
    request(app)
      .post("/shifts")
      .send({
        title: test.shift.title,
        description: test.shift.description,
        date: test.shift.date,
        start: test.shift.start,
        stop: test.shift.stop,
        repeatedType: test.shift.repeatedType,
        address: test.shift.address
      })
      .set("Accept", "application/json")
      .expect(401, done);
  });

  it("Does not allow non-admin to add shift", function(done) {
    // Acquire bearer token
    request(app)
      .post("/auth/login")
      .send({
        email: Seeded.volunteers[0].email,
        password: Seeded.volunteers[0].password
      })
      .set("Accept", "application/json")
      .expect(200)
      .then(response => {
        // Use bearer token to add shift
        request(app)
          .post("/shifts")
          .send({
            title: test.shift.title,
            description: test.shift.description,
            date: test.shift.date,
            start: test.shift.start,
            stop: test.shift.stop,
            repeatedType: test.shift.repeatedType,
            address: test.shift.address
          })
          .set("Authorization", "Bearer " + response.body.token)
          .set("Accept", "application/json")
          .expect(401, done);
      });
  });

  it("Allows admin to add shift", function(done) {
    // Acquire bearer token
    request(app)
      .post("/auth/login")
      .send({
        email: Seeded.admins[0].email,
        password: Seeded.admins[0].password
      })
      .set("Accept", "application/json")
      .expect(200)
      .then(response => {
        // Use bearer token to add shift
        request(app)
          .post("/shifts")
          .send({
            title: test.shift.title,
            description: test.shift.description,
            date: test.shift.date,
            start: test.shift.start,
            stop: test.shift.stop,
            repeatedType: test.shift.repeatedType,
            address: test.shift.address
          })
          .set("Authorization", "Bearer " + response.body.token)
          .set("Accept", "application/json")
          .expect(201, done);
      });
  });
});