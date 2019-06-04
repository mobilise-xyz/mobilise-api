'use strict';

var roleName = 'Seeded Role';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', 
      [
        {
          name: roleName,
          involves: 'Testing',
          createdAt: '2019-06-06',
          updatedAt: '2019-06-06'
        }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', {name: roleName});
  }
};
