'use strict';

const Seeded = require('../utils/seeded');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('ShiftRequirements', [
      {
        shiftId: Seeded.shifts[0].UUID,
        roleName: Seeded.shifts[0].rolesRequired[0].roleName,
        numberRequired: Seeded.shifts[0].rolesRequired[0].number,
        expectedShortage: Seeded.shifts[0].rolesRequired[0].number,
        createdAt: Seeded.admins[0].createdAt,
        updatedAt: Seeded.admins[0].updatedAt
      },
      {
        shiftId: Seeded.shifts[0].UUID,
        roleName: Seeded.shifts[0].rolesRequired[1].roleName,
        numberRequired: Seeded.shifts[0].rolesRequired[1].number,
        expectedShortage: Seeded.shifts[0].rolesRequired[1].number,
        createdAt: Seeded.admins[0].createdAt,
        updatedAt: Seeded.admins[0].updatedAt
      },
      {
        shiftId: Seeded.shifts[1].UUID,
        roleName: Seeded.shifts[1].rolesRequired[0].roleName,
        numberRequired: Seeded.shifts[1].rolesRequired[0].number,
        expectedShortage: Seeded.shifts[1].rolesRequired[0].number,
        createdAt: Seeded.admins[0].createdAt,
        updatedAt: Seeded.admins[0].updatedAt
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ShiftRequirements', [
      { shiftId: Seeded.shifts[0].UUID, roleName: Seeded.shifts[0].rolesRequired[0].roleName },
      { shiftId: Seeded.shifts[0].UUID, roleName: Seeded.shifts[0].rolesRequired[1].roleName },
      { shiftId: Seeded.shifts[1].UUID, roleName: Seeded.shifts[1].rolesRequired[0].roleName }
    ]);
  }
};
