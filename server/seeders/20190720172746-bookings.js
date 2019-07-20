'use strict';

const Seeded = require('../utils/seeded');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Bookings', [
      {
        shiftId: Seeded.shifts[0].UUID,
        roleName: Seeded.shifts[0].rolesRequired[1].roleName,
        volunteerId: Seeded.volunteers[1].UUID,
        createdAt: Seeded.admins[0].createdAt,
        updatedAt: Seeded.admins[0].updatedAt
      },
      {
        shiftId: Seeded.shifts[1].UUID,
        roleName: Seeded.shifts[1].rolesRequired[0].roleName,
        volunteerId: Seeded.volunteers[1].UUID,
        createdAt: Seeded.admins[0].createdAt,
        updatedAt: Seeded.admins[0].updatedAt
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Bookings', [
      {
        shiftId: Seeded.shifts[0].UUID,
        roleName: Seeded.shifts[0].rolesRequired[1].roleName,
        volunteerId: Seeded.volunteers[1].UUID
      },
      {
        shiftId: Seeded.shifts[1].UUID,
        roleName: Seeded.shifts[1].rolesRequired[0].roleName,
        volunteerId: Seeded.volunteers[1].UUID
      }
    ]);
  }
};
