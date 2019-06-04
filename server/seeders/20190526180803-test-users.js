'use strict';
var bcrypt = require('bcryptjs');

var ids = ['8fa1b3d0-80b6-11e9-bc42-526af7764f65', '8fa1b90c-80b6-11e9-bc42-526af7764f64'];

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Users', [
        {
          id: ids[0],
          firstName: 'Seeded',
          lastName: 'Volunteerson',
          email: 'seededvolunteer@testing.com',
          password: bcrypt.hashSync('Volunteer123', bcrypt.genSaltSync(8), null),
          isAdmin: false,
          dob: '1997-11-25',
          createdAt: '2019-06-06',
          updatedAt: '2019-06-06'
        },
        {
          id: ids[1],
          firstName: 'Seeded',
          lastName: 'Adminson',
          email: 'seededadmin@testing.com',
          password: bcrypt.hashSync('Admin123', bcrypt.genSaltSync(8), null),
          isAdmin: true,
          dob: '1997-11-25',
          createdAt: '2019-06-06',
          updatedAt: '2019-06-06'
        }
    ], {});
    
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', {id: ids});
  }
};
