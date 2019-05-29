'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Volunteers', [
      {
        userId: '8fa1b3d0-80b6-11e9-bc42-526af7764f65',
        createdAt: '2019-06-06',
        updatedAt: '2019-06-06'
      }
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Volunteers', null, {});
  }
};
