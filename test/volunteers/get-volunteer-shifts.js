let request = require("supertest");
let app = require("../../app");
let { describe, it } = require("mocha");

const Seeded = require('../../server/utils/seeded');

const test = {
  volunteer: {
    UUID: Seeded.volunteers[1].UUID
  }
};

describe("Get booked shifts", function() {

  it("Does not allow unauthorised request to get shifts", function (done) {
    request(app)
      .get(`/volunteers/${test.volunteer.UUID}/shifts`)
      .set("Accept", "application/json")
      .expect(401, done);
  });

  it("Allows volunteers to get booked shifts", function(done) {
    // Acquire bearer token
    request(app)
      .post("/auth/login")
      .send({
        email: Seeded.volunteers[1].email,
        password: Seeded.volunteers[1].password
      })
      .set("Accept", "application/json")
      .expect(200)
      .then(response => {
        // Use bearer token to get shifts
        request(app)
          .get(`/volunteers/${test.volunteer.UUID}/shifts`)
          .set("Authorization", "Bearer " + response.body.user.token)
          .set("Accept", "application/json")
          .expect(200, done);
      });
  });

});

describe("Get available shifts", function() {

  it("Does not allow unauthorised request to get shifts", function (done) {
    request(app)
      .get(`/volunteers/${test.volunteer.UUID}/availableShifts`)
      .set("Accept", "application/json")
      .expect(401, done);
  });

  it("Allows volunteers to get available shifts", function(done) {
    // Acquire bearer token
    request(app)
      .post("/auth/login")
      .send({
        email: Seeded.volunteers[1].email,
        password: Seeded.volunteers[1].password
      })
      .set("Accept", "application/json")
      .expect(200)
      .then(response => {
        // Use bearer token to get shifts
        request(app)
          .get(`/volunteers/${test.volunteer.UUID}/availableShifts`)
          .set("Authorization", "Bearer " + response.body.user.token)
          .set("Accept", "application/json")
          .expect(200, done);
      });
  });

});