var request = require("supertest");
var app = require("../../app");
var { describe, it } = require("mocha")
const Seeded = require('../../server/utils/seeded');

describe("Volunteers' Hall of Fame", function() {

  it("Does not allow unauthorised requests to get Hall of Fame", function(done) {
    request(app)
      .get(`/volunteers/hall-of-fame`)
      .set("Accept", "application/json")
      .expect(401, done);
  });

  it("Allows volunteers to view Hall of Fame", function(done) {
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
          .get(`/volunteers/hall-of-fame`)
          .set("Authorization", "Bearer " + response.body.token)
          .set("Accept", "application/json")
          .expect(200, done);
      });
  });

  it("Allows admins to view Hall of Fame", function(done) {
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
        // Use bearer token to get shifts
        request(app)
          .get(`/volunteers/hall-of-fame`)
          .set("Authorization", "Bearer " + response.body.token)
          .set("Accept", "application/json")
          .expect(200, done);
      });
  });
});