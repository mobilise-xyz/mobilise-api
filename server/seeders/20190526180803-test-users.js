'use strict';
var bcrypt = require('bcryptjs');

const Seeded = require('../utils/seeded');

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Users', [

        // Volunteers
        {
          id: Seeded.volunteers[0].UUID,
          firstName: Seeded.volunteers[0].firstName,
          lastName: Seeded.volunteers[0].lastName,
          email: Seeded.volunteers[0].email,
          telephone: Seeded.volunteers[0].telephone,
          password: bcrypt.hashSync(Seeded.volunteers[0].password, bcrypt.genSaltSync(8), null),
          isAdmin: Seeded.volunteers[0].isAdmin,
          dob: Seeded.volunteers[0].dob,
          createdAt: Seeded.volunteers[0].createdAt,
          updatedAt: Seeded.volunteers[0].updatedAt,
        },
        {
          id: Seeded.volunteers[1].UUID,
          firstName: Seeded.volunteers[1].firstName,
          lastName: Seeded.volunteers[1].lastName,
          email: Seeded.volunteers[1].email,
          telephone: Seeded.volunteers[1].telephone,
          password: bcrypt.hashSync(Seeded.volunteers[1].password, bcrypt.genSaltSync(8), null),
          isAdmin: Seeded.volunteers[1].isAdmin,
          dob: Seeded.volunteers[1].dob,
          createdAt: Seeded.volunteers[1].createdAt,
          updatedAt: Seeded.volunteers[1].updatedAt
        },

        // Admins
        {
          id: Seeded.admins[0].UUID,
          firstName: Seeded.admins[0].firstName,
          lastName: Seeded.admins[0].lastName,
          email: Seeded.admins[0].email,
          telephone: Seeded.admins[0].telephone,
          password: bcrypt.hashSync(Seeded.admins[0].password, bcrypt.genSaltSync(8), null),
          isAdmin: Seeded.admins[0].isAdmin,
          dob: Seeded.admins[0].dob,
          createdAt: Seeded.admins[0].createdAt,
          updatedAt: Seeded.admins[0].updatedAt
        },
        {
          id: Seeded.admins[1].UUID,
          firstName: Seeded.admins[1].firstName,
          lastName: Seeded.admins[1].lastName,
          email: Seeded.admins[1].email,
          telephone: Seeded.admins[1].telephone,
          password: bcrypt.hashSync(Seeded.admins[1].password, bcrypt.genSaltSync(8), null),
          isAdmin: Seeded.admins[1].isAdmin,
          dob: Seeded.admins[1].dob,
          createdAt: Seeded.admins[1].createdAt,
          updatedAt: Seeded.admins[1].updatedAt
        }
    ], {});
    
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', {
        id: [
          Seeded.volunteers[0].UUID,
          Seeded.volunteers[1].UUID, 
          Seeded.admins[0].UUID,
          Seeded.admins[1].UUID
        ]
      });
  }
};
