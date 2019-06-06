'use strict';
var bcrypt = require('bcryptjs');

const Seeded = require('../utils/seeded');

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Users', [
        {
          id: Seeded.volunteers[0].UUID,
          firstName: Seeded.volunteers[0].firstName,
          lastName: Seeded.volunteers[0].lastName,
          email: Seeded.volunteers[0].email,
          password: bcrypt.hashSync(Seeded.volunteers[0].password, bcrypt.genSaltSync(8), null),
          isAdmin: Seeded.volunteers[0].isAdmin,
          dob: Seeded.volunteers[0].dob,
          createdAt: Seeded.volunteers[0].createdAt,
          updatedAt: Seeded.volunteers[0].updatedAt
        },
        {
          id: Seeded.admins[0].UUID,
          firstName: Seeded.admins[0].firstName,
          lastName: Seeded.admins[0].lastName,
          email: Seeded.admins[0].email,
          password: bcrypt.hashSync(Seeded.admins[0].password, bcrypt.genSaltSync(8), null),
          isAdmin: Seeded.admins[0].isAdmin,
          dob: Seeded.admins[0].dob,
          createdAt: Seeded.admins[0].createdAt,
          updatedAt: Seeded.admins[0].updatedAt
        }
    ], {});
    
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', {id: [Seeded.volunteers[0].UUID, Seeded.admins[0].UUID]});
  }
};
