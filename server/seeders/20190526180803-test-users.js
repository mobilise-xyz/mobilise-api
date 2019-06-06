'use strict';
var bcrypt = require('bcryptjs');

const Seeded = require('../utils/seeded');

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Users', [
        {
          id: Seeded.volunteer.UUID,
          firstName: Seeded.volunteer.firstName,
          lastName: Seeded.volunteer.lastName,
          email: Seeded.volunteer.email,
          password: bcrypt.hashSync(Seeded.volunteer.password, bcrypt.genSaltSync(8), null),
          isAdmin: Seeded.volunteer.isAdmin,
          dob: Seeded.volunteer.dob,
          createdAt: Seeded.volunteer.createdAt,
          updatedAt: Seeded.volunteer.updatedAt
        },
        {
          id: Seeded.admin.UUID,
          firstName: Seeded.admin.firstName,
          lastName: Seeded.admin.lastName,
          email: Seeded.admin.email,
          password: bcrypt.hashSync(Seeded.admin.password, bcrypt.genSaltSync(8), null),
          isAdmin: Seeded.admin.isAdmin,
          dob: Seeded.admin.dob,
          createdAt: Seeded.admin.createdAt,
          updatedAt: Seeded.admin.updatedAt
        }
    ], {});
    
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', {id: [Seeded.volunteer.UUID, Seeded.admin.UUID]});
  }
};
