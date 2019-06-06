'use strict';

const Seeded = require('../utils/seeded');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Admins', [
      {
        userId: Seeded.admin.UUID,
        createdAt: Seeded.admin.createdAt,
        updatedAt: Seeded.admin.updatedAt
      }
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Admins', {userId : Seeded.admin.UUID});
  }
};
