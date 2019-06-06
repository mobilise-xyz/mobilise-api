'use strict';

const Seeded = require('../utils/seeded');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', 
      [
        {
          name: Seeded.roles[0].name,
          involves: Seeded.roles[0].involves,
          colour: Seeded.roles[0].colour,
          createdAt: Seeded.roles[0].createdAt,
          updatedAt: Seeded.roles[0].updatedAt
        }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', {name: Seeded.roles[0].name});
  }
};
