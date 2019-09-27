let request = require("supertest");
let app = require("../../app");
let { describe, it, after, before } = require("mocha");
const uuid = require("uuid/v4");
let {Shift} = require("../../server/models");

const Seeded = require('../../server/utils/seeded');

const test = {
  shift: {
    id: uuid(),
    title: 'Shift Title 2',
    description: 'Shift Description 2',
    date: '2019-02-08',
    start: '16:00',
    stop: '18:00',
    creatorId: Seeded.admins[0].UUID,
    repeatedType: 'Never',
    address: 'SW72AZ'
  }
};

describe("Delete shift", function () {

  before(async () => {
    await Shift.create({
      id: test.shift.id,
      title: test.shift.title,
      description: test.shift.description,
      date: test.shift.date,
      start: test.shift.start,
      creatorId: test.shift.creatorId,
      stop: test.shift.stop,
      repeatedType: test.shift.repeatedType,
      address: test.shift.address
    });
  });

  after(async () => {
    await Shift.destroy({
      where: {
        id: test.shift.id
      }
    })
  });

  it("Does not allow unauthorised request to delete a shift", function (done) {
    request(app)
      .delete(`/shifts/${test.shift.id}`)
      .send()
      .set("Accept", "application/json")
      .expect(401, done);
  });

  it("Does not allow deletion of non-existent shift", function (done) {
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
          .delete(`/shifts/${uuid()}`)
          .send()
          .set("Authorization", "Bearer " + response.body.user.token)
          .set("Accept", "application/json")
          .expect(400, done);
      });
  });

  it("Does not allow volunteer to delete shift", function (done) {
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
          .delete(`/shifts/${test.shift.id}`)
          .send()
          .set("Authorization", "Bearer " + response.body.user.token)
          .set("Accept", "application/json")
          .expect(401, done);
      });
  });

  it("Allows admin to delete shift", function (done) {
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
          .delete(`/shifts/${test.shift.id}`)
          .send()
          .set("Authorization", "Bearer " + response.body.user.token)
          .set("Accept", "application/json")
          .expect(200, done);
      });
  });

});