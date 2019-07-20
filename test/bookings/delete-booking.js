var request = require("supertest");
var app = require("../../app");
var { describe, it, after, before } = require("mocha");
var {Booking} = require("../../server/models");

const Seeded = require('../../server/utils/seeded');

const test = {
  booking: {
    volunteerId: Seeded.volunteers[2].UUID,
    shiftId: Seeded.shifts[0].UUID,
    roleName: Seeded.shifts[1].rolesRequired[0].roleName
  }
};

describe("Booking shift", function () {

  before(function () {
    Booking.create({
      shiftId: test.booking.shiftId,
      roleName: test.booking.roleName,
      volunteerId: test.booking.volunteerId,
      createdAt: Seeded.admins[0].createdAt,
      updatedAt: Seeded.admins[0].updatedAt
    })
  });

  after(function () {
    Booking.destroy({
      where: {
        shiftId: test.booking.shiftId,
        roleName: test.booking.roleName,
        volunteerId: test.booking.volunteerId
      }
    })
  });

  it("Does not allow unauthorised request to cancel a booking", function (done) {
    request(app)
      .delete(`/shifts/${test.booking.shiftId}/booking`)
      .send({
        reason: "Family emergency"
      })
      .set("Accept", "application/json")
      .expect(401, done);
  });

  it("Does not allow cancel non-existent booking", function (done) {
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
          .delete(`/shifts/${test.booking.shiftId}/booking`)
          .send({
            reason: "Family emergency"
          })
          .set("Authorization", "Bearer " + response.body.user.token)
          .set("Accept", "application/json")
          .expect(400, done);
      });
  });

  it("Allows volunteer to cancel booking for a shift", function (done) {
    // Acquire bearer token
    request(app)
      .post("/auth/login")
      .send({
        email: Seeded.volunteers[2].email,
        password: Seeded.volunteers[2].password
      })
      .set("Accept", "application/json")
      .expect(200)
      .then(response => {
        // Use bearer token to book shift
        request(app)
          .delete(`/shifts/${test.booking.shiftId}/booking`)
          .send({
            reason: "Family emergency"
          })
          .set("Authorization", "Bearer " + response.body.user.token)
          .set("Accept", "application/json")
          .expect(200, done);
      });
  });

});