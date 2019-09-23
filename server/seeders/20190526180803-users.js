'use strict';
let bcrypt = require('bcryptjs');

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
          calendarAccessKey: Sequelize.NULL,
          lastLogin: Seeded.volunteers[0].createdAt,
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
          calendarAccessKey: Sequelize.NULL,
          lastLogin: Seeded.volunteers[1].createdAt,
          createdAt: Seeded.volunteers[1].createdAt,
          updatedAt: Seeded.volunteers[1].updatedAt
        },
        {
          id: Seeded.volunteers[2].UUID,
          firstName: Seeded.volunteers[2].firstName,
          lastName: Seeded.volunteers[2].lastName,
          email: Seeded.volunteers[2].email,
          telephone: Seeded.volunteers[2].telephone,
          password: bcrypt.hashSync(Seeded.volunteers[2].password, bcrypt.genSaltSync(8), null),
          isAdmin: Seeded.volunteers[2].isAdmin,
          calendarAccessKey: Sequelize.NULL,
          lastLogin: Sequelize.NULL,
          createdAt: Seeded.volunteers[2].createdAt,
          updatedAt: Seeded.volunteers[2].updatedAt
        },

        // Admins
    ], {});
    
  },

  down: (queryInterface) => {
      return queryInterface.bulkDelete('Users', {
        id: [
          Seeded.volunteers[0].UUID,
          Seeded.volunteers[1].UUID, 
          Seeded.volunteers[2].UUID,
          Seeded.admins[0].UUID,
          Seeded.admins[1].UUID
        ]
      });
  }
};
