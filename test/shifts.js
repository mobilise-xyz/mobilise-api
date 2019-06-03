var request = require("supertest");
var app = require("../app");
var chai = require("chai");

var expect = chai.expect;

describe("Add shifts", function() {
  it("Does not allow unauthorised request to add shift", function(done) {
    request(app)
      .post("/shifts")
      .send({
        title: "Shift Title",
        description: "Shift Description",
        date: "2019-02-08",
        start: "16:00",
        stop: "18:00",
        repeatedType: "Never",
        postcode: "SW72AZ"
      })
      .set("Accept", "application/json")
      .expect(401, done);
  });

  it("Does not allow non-admin to add shift", function(done) {
    // Acquire bearer token
    request(app)
      .post("/auth/login")
      .send({
        email: "testvolunteer@testing.com",
        password: "Volunteer123"
      })
      .set("Accept", "application/json")
      .expect(200)
      .then(response => {
        // Use bearer token to add shift
        request(app)
          .post("/shifts")
          .send({
            title: "Shift Title",
            description: "Shift Description",
            date: "2019-02-08",
            start: "16:00",
            stop: "18:00",
            repeatedType: "Never",
            address: "SW72AZ"
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
        email: "testadmin@testing.com",
        password: "Admin123"
      })
      .set("Accept", "application/json")
      .expect(200)
      .then(response => {
        // Use bearer token to add shift
        request(app)
          .post("/shifts")
          .send({
            title: "Shift Title",
            description: "Shift Description",
            date: "2019-02-08",
            start: "16:00",
            stop: "18:00",
            repeatedType: "Never",
            address: "SW72AZ"
          })
          .set("Authorization", "Bearer " + response.body.token)
          .set("Accept", "application/json")
          .expect(201, done);
      });
  });
});

describe("Retrieve Shifts", function() {
  it("Does not allow unauthorised requests to get shifts", function(done) {
    request(app)
      .get("/shifts")
      .set("Accept", "application/json")
      .expect(401, done);
  });

  it("Allows authorised request to get shifts", function(done) {
    // Acquire bearer token
    request(app)
      .post("/auth/login")
      .send({
        email: "testvolunteer@testing.com",
        password: "Volunteer123"
      })
      .set("Accept", "application/json")
      .expect(200)
      .then(response => {
        // Use bearer token to get shifts
        request(app)
          .get("/shifts")
          .set("Authorization", "Bearer " + response.body.token)
          .set("Accept", "application/json")
          .expect(200, done);
      });
  });
});

describe("Retrieve Shift Titles", function() {
  it("Does not allow unauthorised requests to get shift titles", function(done) {
    request(app)
      .get("/shifts/titles")
      .set("Accept", "application/json")
      .expect(401, done);
  });

  it("Allows authorised request to get shift titles", function(done) {
    // Acquire bearer token
    request(app)
      .post("/auth/login")
      .send({
        email: "testvolunteer@testing.com",
        password: "Volunteer123"
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
