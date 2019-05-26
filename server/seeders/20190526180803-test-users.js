'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Users', [
        {
          firstName: 'Test',
          lastName: 'Volunteerson',
          email: 'testvolunteer@testing.com',
          password: '$2b$08$9hHDKTWHS2XAPlwz1mUiiO4KNDAUma28/.c6CW0AL3IDuYDgohZau',
          admin: 'FALSE',
          dob: '1997-11-25',
          createdAt: '2019-06-06',
          updatedAt: '2019-06-06'
        },
        {
          firstName: 'Test',
          lastName: 'Adminson',
          email: 'testadmin@testing.com',
          password: '$$',
          admin: 'TRUE',
          dob: '1997-11-25',
          createdAt: '2019-06-06',
          updatedAt: '2019-06-06'
        }
    ], {});
    
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', null, {});
  }
};
