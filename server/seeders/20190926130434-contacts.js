'use strict';

const Seeded = require('../utils/seeded');

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Contacts', [
      {
        id: Seeded.contacts[0].UUID,
        firstName: Seeded.contacts[0].firstName,
        lastName: Seeded.contacts[0].lastName,
        email: Seeded.contacts[0].email,
        telephone: Seeded.contacts[0].telephone,
        relation: Seeded.contacts[0].relation,
        volunteerId: Seeded.volunteers[0].UUID,
        createdAt: Seeded.volunteers[0].createdAt,
        updatedAt: Seeded.volunteers[0].updatedAt
      },
      {
        id: Seeded.contacts[1].UUID,
        firstName: Seeded.contacts[1].firstName,
        lastName: Seeded.contacts[1].lastName,
        email: Seeded.contacts[1].email,
        telephone: Seeded.contacts[1].telephone,
        relation: Seeded.contacts[0].relation,
        volunteerId: Seeded.volunteers[0].UUID,
        createdAt: Seeded.volunteers[0].createdAt,
        updatedAt: Seeded.volunteers[0].updatedAt
      }
    ]);
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Contacts', {
      id : [
        Seeded.contacts[0].token,
        Seeded.contacts[1].token
      ]
    });
  }
};
