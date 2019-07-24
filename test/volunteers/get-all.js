let request = require("supertest");
let app = require("../../app");
let { describe, it } = require("mocha");
const Seeded = require('../../server/utils/seeded');

describe("Volunteers' Catalogue", function() {

  it("Does not allow unauthorised requests to get volunteer catalogue", function(done) {
    request(app)
      .get(`/volunteers`)
      .set("Accept", "application/json")
      .expect(401, done);
  });

  it("Does not allow volunteers to get volunteer catalogue", function(done) {
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
          .get(`/volunteers/`)
          .set("Authorization", "Bearer " + response.body.user.token)
          .set("Accept", "application/json")
          .expect(401, done);
      });
  });

  it("Allows admins to get volunteer catalogue", function(done) {
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
          .get(`/volunteers/`)
          .set("Authorization", "Bearer " + response.body.user.token)
          .set("Accept", "application/json")
          .expect(200, done);
      });
  });
});