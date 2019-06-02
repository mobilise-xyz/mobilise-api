'use strict';

var roleName = 'Warehouse Assistant';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', 
      [
        {
          name: roleName,
          involves: 'Heavy Lifting',
          createdAt: '2019-06-06',
          updatedAt: '2019-06-06'
        }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', {name: roleName});
  }
};
