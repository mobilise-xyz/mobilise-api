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
        },
        {
          name: Seeded.roles[1].name,
          involves: Seeded.roles[1].involves,
          colour: Seeded.roles[1].colour,
          createdAt: Seeded.roles[1].createdAt,
          updatedAt: Seeded.roles[1].updatedAt
        },
        {
          name: Seeded.roles[2].name,
          involves: Seeded.roles[2].involves,
          colour: Seeded.roles[2].colour,
          createdAt: Seeded.roles[2].createdAt,
          updatedAt: Seeded.roles[2].updatedAt
        }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', {
      name: [
        Seeded.roles[0].name,
        Seeded.roles[1].name,
        Seeded.roles[2].name
      ]
    });
  }
};
