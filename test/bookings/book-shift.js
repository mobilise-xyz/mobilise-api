var request = require("supertest");
var app = require("../../app");
var {describe, it, after} = require("mocha");

var {Booking} = require("../../server/models");
const Seeded = require('../../server/utils/seeded');

const test = {
  booking: {
    volunteerId: Seeded.volunteers[0].UUID,
    shiftId: Seeded.shifts[0].UUID,
    roleName: Seeded.shifts[0].rolesRequired[0].roleName
  }
};

describe("Booking shift", function () {

  after(function () {
    Booking.destroy({
      where: {
        volunteerId: test.booking.volunteerId,
        shiftId: test.booking.shiftId,
        roleName: test.booking.roleName
      }
    })
  });

  it("Does not allow unauthorised request to book a shift", function (done) {
    request(app)
      .post(`/shifts/${test.booking.shiftId}/book`)
      .send({
        roleName: test.booking.roleName
      })
      .set("Accept", "application/json")
      .expect(401, done);
  });

  it("Does not allow admin to book a shift", function (done) {
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
        // Use bearer token to book shift
        request(app)
          .post(`/shifts/${test.booking.shiftId}/book`)
          .send({
            roleName: test.booking.roleName
          })
          .set("Authorization", "Bearer " + response.body.user.token)
          .set("Accept", "application/json")
          .expect(401, done);
      });
  });

  it("Allows volunteer to book a shift", function (done) {
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
        // Use bearer token to book shift
        request(app)
          .post(`/shifts/${test.booking.shiftId}/book`)
          .send({
            roleName: test.booking.roleName
          })
          .set("Authorization", "Bearer " + response.body.user.token)
          .set("Accept", "application/json")
          .expect(200, done);
      });
  });

  it("Does not allow volunteer too book shift with incorrect role", function (done) {
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
        // Use bearer token to book shift
        request(app)
          .post(`/shifts/${test.booking.shiftId}/book`)
          .send({
            roleName: "This role does not exist"
          })
          .set("Authorization", "Bearer " + response.body.user.token)
          .set("Accept", "application/json")
          .expect(400, done);
      });
  });
});