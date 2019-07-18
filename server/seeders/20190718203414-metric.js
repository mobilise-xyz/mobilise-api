'use strict';

const Seeded = require('../utils/seeded');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Metrics',[
      {
        name: Seeded.metric.name,
        verb: Seeded.metric.verb,
        value: Seeded.metric.value,
        createdAt: Seeded.metric.createdAt,
        updatedAt: Seeded.metric.updatedAt
      }], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Metrics', [{
      name: Seeded.metric.name
    }]);
  }
};
