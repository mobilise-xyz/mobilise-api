let request = require('supertest');
let app = require('../../app');
let chai = require('chai');
let { describe, it, after } = require("mocha");
let {User} = require('../../server/models');
let {expect} = chai;

const test = {
  volunteer: {
    email: 'testvolunteer@testing.com',
    password: 'Volunteer123',
    firstName: 'Volun',
    lastName: 'Teer',
    dob: '1998-11-25',
    isAdmin: false,
    telephone: '07979797979'
  },

  admin: {
    email: 'testadmin@testing.com',
    password: 'Admin123',
    firstName: 'Ad',
    lastName: 'Min',
    dob: '1998-11-25',
    isAdmin: true,
    telephone: '07979797979'
  }
};

describe('Register Volunteer', function() {

  after( function() {
    User.destroy({where: {email: test.volunteer.email}})
  });

  it('Can register a volunteer', function(done) {
    request(app)
      .post('/auth/register')
      .send(
        {
          firstName: test.volunteer.firstName,
          lastName: test.volunteer.lastName,
          email: test.volunteer.email,
          password: test.volunteer.password,
          dob: test.volunteer.dob,
          telephone: test.volunteer.telephone
        }
      )
      .set('Accept', 'application/json')
      .expect(201)
      .end(function(error, response) {
        if (error) {
          done(error);
        }
        const { user } = response.body;
        expect(user.email).to.equal(test.volunteer.email);
        expect(user.firstName).to.equal(test.volunteer.firstName);
        expect(user.lastName).to.equal(test.volunteer.lastName);
        expect(user.dob).to.equal(test.volunteer.dob);
        expect(user.isAdmin).to.equal(test.volunteer.isAdmin);
        
        done();
      })
  });

});

describe('Register Admin', function() {

  after( function() {
    User.destroy({where: {email: test.admin.email}})
  });

  it('Can register an admin', function(done) {
    request(app)
      .post('/auth/register')
      .send(
        {
          firstName: test.admin.firstName,
          lastName: test.admin.lastName,
          email: test.admin.email,
          password: test.admin.password,
          dob: test.admin.dob,
          isAdmin: test.admin.isAdmin,
          telephone: test.admin.telephone
        }
      )
      .set('Accept', 'application/json')
      .expect(201)
      .end(function(error, response) {
        if (error) {
          done(error);
        }

        const { user } = response.body;
        expect(user.email).to.equal(test.admin.email);
        expect(user.firstName).to.equal(test.admin.firstName);
        expect(user.lastName).to.equal(test.admin.lastName);
        expect(user.dob).to.equal(test.admin.dob);
        expect(user.isAdmin).to.equal(test.admin.isAdmin);
        
        done();
      })
  });

});