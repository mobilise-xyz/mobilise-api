var request = require("supertest");
var app = require("../../app");
var { describe, it } = require("mocha");
const Seeded = require('../../server/utils/seeded');

describe("Get Shift Titles", function() {

  it("Does not allow unauthorised requests to get shift titles", function(done) {
    request(app)
      .get("/shifts/titles")
      .set("Accept", "application/json")
      .expect(401, done);
  });

  it("Allows volunteers to get shift titles", function(done) {
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
          .get("/shifts/titles")
          .set("Authorization", "Bearer " + response.body.token)
          .set("Accept", "application/json")
          .expect(200, done);
      });
  });
});
