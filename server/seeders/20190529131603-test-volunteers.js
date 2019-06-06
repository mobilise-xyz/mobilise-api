'use strict';

const Seeded = require('../utils/seeded');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Volunteers', [
      {
        userId: Seeded.volunteer.UUID,
        createdAt: Seeded.volunteer.createdAt,
        updatedAt: Seeded.volunteer.updatedAt
      }
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Volunteers', {userId: Seeded.volunteer.UUID});
  }
};

