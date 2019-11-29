'use strict';
let bcrypt = require('bcryptjs');

const Seeded = require('../utils/seeded');

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('InvitationTokens', [
      {
        email: Seeded.invitationTokens[0].email,
        token: bcrypt.hashSync(Seeded.invitationTokens[0].token, bcrypt.genSaltSync(8), null),
        expires: Seeded.invitationTokens[0].expires,
        isAdmin: Seeded.invitationTokens[0].isAdmin,
        createdAt: Seeded.invitationTokens[0].createdAt,
        updatedAt: Seeded.invitationTokens[0].updatedAt
      },
      {
        email: Seeded.invitationTokens[1].email,
        token: bcrypt.hashSync(Seeded.invitationTokens[1].token, bcrypt.genSaltSync(8), null),
        expires: Seeded.invitationTokens[1].expires,
        isAdmin: Seeded.invitationTokens[1].isAdmin,
        createdAt: Seeded.invitationTokens[1].createdAt,
        updatedAt: Seeded.invitationTokens[1].updatedAt
      }
    ]);
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('InvitationTokens', {
      email : [
        Seeded.invitationTokens[0].email,
        Seeded.invitationTokens[1].email
      ]
    });
  }
};
