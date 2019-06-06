var request = require("supertest");
var app = require("../../app");

const Seeded = require('../../server/utils/seeded');

describe("Volunteers' Availability", function() {

  it("Does not allow unauthorised requests to get availability", function(done) {
    request(app)
      .get(`/volunteers/${Seeded.volunteers[0].UUID}/availability`)
      .set("Accept", "application/json")
      .expect(401, done);
  });

  it("Does not allow volunteers to view others' availability", function(done) {
    request(app)
      .post("/auth/login")
      .send({
        email: Seeded.volunteers[0].email,
        password: Seeded.volunteers[0].password
      })
      .set("Accept", "application/json")
      .expect(200)
      .then(response => {
        // Use bearer token to get shifts
        request(app)
          .get(`/volunteers/${Seeded.volunteers[1].UUID}/availability`)
          .set("Authorization", "Bearer " + response.body.token)
          .set("Accept", "application/json")
          .expect(401, done);
      });
  });

  it("Allows volunteers to view their own availability", function(done) {
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
        // Use bearer token to get shifts
        request(app)
          .get(`/volunteers/${Seeded.volunteers[0].UUID}/availability`)
          .set("Authorization", "Bearer " + response.body.token)
          .set("Accept", "application/json")
          .expect(200, done);
      });
  });
});