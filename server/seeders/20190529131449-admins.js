'use strict';

const Seeded = require('../utils/seeded');

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Admins', [
      {
        userId: Seeded.admins[0].UUID,
        createdAt: Seeded.admins[0].createdAt,
        updatedAt: Seeded.admins[0].updatedAt
      },
      {
        userId: Seeded.admins[1].UUID,
        createdAt: Seeded.admins[1].createdAt,
        updatedAt: Seeded.admins[1].updatedAt
      }
  ], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Admins', {
      userId : [
        Seeded.admins[0].UUID,
        Seeded.admins[1].UUID
      ]
    });
  }
};
