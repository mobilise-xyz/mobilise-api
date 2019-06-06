'use strict';

const Seeded = require('../utils/seeded');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Admins', [
      {
        userId: Seeded.admins[0].UUID,
        createdAt: Seeded.admins[0].createdAt,
        updatedAt: Seeded.admins[0].updatedAt
      }
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Admins', {userId : Seeded.admins[0].UUID});
  }
};
