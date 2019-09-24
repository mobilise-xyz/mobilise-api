'use strict';

const Seeded = require('../utils/seeded');

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('InvitationTokens', [
      {
        email: Seeded.invitationTokens[0].email,
        token: Seeded.invitationTokens[0].token,
        expires: Seeded.invitationTokens[0].expires,
        isAdmin: Seeded.invitationTokens[0].isAdmin,
        createdAt: Seeded.invitationTokens[0].createdAt,
        updatedAt: Seeded.invitationTokens[0].updatedAt
      },
      {
        email: Seeded.invitationTokens[1].email,
        token: Seeded.invitationTokens[1].token,
        expires: Seeded.invitationTokens[1].expires,
        isAdmin: Seeded.invitationTokens[1].isAdmin,
        createdAt: Seeded.invitationTokens[1].createdAt,
        updatedAt: Seeded.invitationTokens[1].updatedAt
      }
    ]);
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('InvitationTokens', {
      token : [
        Seeded.invitationTokens[0].token,
        Seeded.invitationTokens[1].token
      ]
    });
  }
};
