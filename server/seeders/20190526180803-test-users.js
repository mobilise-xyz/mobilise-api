'use strict';
var bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Users', [
        {
          id: Sequelize.Utils.generateUUID(),
          firstName: 'Test',
          lastName: 'Volunteerson',
          email: 'testvolunteer@testing.com',
          password: bcrypt.hashSync('Volunteer123', bcrypt.genSaltSync(8), null),
          admin: 'FALSE',
          dob: '1997-11-25',
          createdAt: '2019-06-06',
          updatedAt: '2019-06-06'
        },
        {
          id: Sequelize.Utils.generateUUID(),
          firstName: 'Test',
          lastName: 'Adminson',
          email: 'testadmin@testing.com',
          password: bcrypt.hashSync('Admin123', bcrypt.genSaltSync(8), null),
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
