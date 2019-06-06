'use strict';

const Seeded = require('../utils/seeded');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', 
      [
        {
          name: Seeded.role.name,
          involves: Seeded.role.involves,
          colour: Seeded.role.colour,
          createdAt: Seeded.role.createdAt,
          updatedAt: Seeded.role.updatedAt
        }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', {name: Seeded.role.name});
  }
};
