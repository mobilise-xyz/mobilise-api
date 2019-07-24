let request = require("supertest");
let app = require("../../app");
let chai = require("chai");
let { describe, it } = require("mocha");
let {expect} = chai;

const Seeded = require("../../server/utils/seeded");

describe("Login user", function() {
  it("Approves correct credentials for volunteers[0]", function(done) {
    request(app)
      .post("/auth/login")
      .send({
        email: Seeded.volunteers[0].email,
        password: Seeded.volunteers[0].password
      })
      .set("Accept", "application/json")
      .expect(200)
      .end(function(error, response) {
        if (error) {
          done(error);
        }
        const { user } = response.body;

        // Ensure that we return the JSON Web Token back
        expect(user).to.have.property("token");
        expect(user).to.have.property("uid");
        expect(user).to.have.property("lastLogin");
        expect(user.isAdmin).to.equal(false);
        done();
      });
  });

  it("Approves correct credentials for admins[0]", function(done) {
    request(app)
      .post("/auth/login")
      .send({
        email: Seeded.admins[0].email,
        password: Seeded.admins[0].password
      })
      .set("Accept", "application/json")
      .expect(200)
      .end(function(error, response) {
        if (error) {
          done(error);
        }

        const { user } = response.body;

        // Ensure that we return the JSON Web Token back
        expect(user).to.have.property("token");
        expect(user).to.have.property("uid");
        expect(user).to.have.property("lastLogin");
        expect(user.isAdmin).to.equal(true);
        done();
      });
  });

  it("Rejects invalid email", function(done) {
    request(app)
      .post("/auth/login")
      .send({
        email: "incorrectvolunteer@testing.com",
        password: Seeded.volunteers[0].password
      })
      .set("Accept", "application/json")
      .expect(400, done);
  });

  it("Rejects invalid password for volunteers[0]", function(done) {
    request(app)
      .post("/auth/login")
      .send({
        email: Seeded.volunteers[0].email,
        password: "Invalid123"
      })
      .set("Accept", "application/json")
      .expect(400, done);
  });

  it("Rejects invalid password for admins[0]", function(done) {
    request(app)
      .post("/auth/login")
      .send({
        email: Seeded.admins[0].email,
        password: "Invalid123"
      })
      .set("Accept", "application/json")
      .expect(400, done);
  });
});
