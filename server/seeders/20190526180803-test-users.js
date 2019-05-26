'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Users', [
        {
          firstName: 'Test',
          lastName: 'Testerson',
          email: 'testtesterson@testing.com',
          password: '$2b$08$keGFvZla0qWDFw4hbCEiZunqTFM.Ink0UgJjpIyb88m3W9KSzv5N6', 
          dob: '1998-11-25',
          createdAt: '2019-06-06',
          updatedAt: '2019-06-06'
        }
    ], {});
    
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', null, {});
  }
};
