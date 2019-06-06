'use strict';

const Seeded = require('../utils/seeded');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Volunteers', [
      {
        userId: Seeded.volunteers[0].UUID,
        createdAt: Seeded.volunteers[0].createdAt,
        updatedAt: Seeded.volunteers[0].updatedAt
      },
      {
        userId: Seeded.volunteers[1].UUID,
        createdAt: Seeded.volunteers[1].createdAt,
        updatedAt: Seeded.volunteers[1].updatedAt
      }
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Volunteers', {
      userId: [
        Seeded.volunteers[0].UUID, 
        Seeded.volunteers[1].UUID
      ]
    });
  }
};

