'use strict';

const Seeded = require('../utils/seeded');

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Shifts', 
      [
        {
          id: Seeded.shifts[0].UUID,
          title: Seeded.shifts[0].title,
          description: Seeded.shifts[0].description,
          date: Seeded.shifts[0].date,
          start: Seeded.shifts[0].start,
          stop: Seeded.shifts[0].stop,
          address: Seeded.shifts[0].address,
          creatorId: Seeded.shifts[0].creatorId,
          createdAt: Seeded.roles[0].createdAt,
          updatedAt: Seeded.roles[0].updatedAt
        },
        {
          id: Seeded.shifts[1].UUID,
          title: Seeded.shifts[1].title,
          description: Seeded.shifts[1].description,
          date: Seeded.shifts[1].date,
          start: Seeded.shifts[1].start,
          stop: Seeded.shifts[1].stop,
          address: Seeded.shifts[1].address,
          creatorId: Seeded.shifts[1].creatorId,
          createdAt: Seeded.roles[0].createdAt,
          updatedAt: Seeded.roles[0].updatedAt
        }
      ], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Shifts', {
      id: [
        Seeded.shifts[0].UUID,
        Seeded.shifts[1].UUID
      ]
    });
  }
};
