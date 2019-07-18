"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('Volunteers', 'lastWeekShifts', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      });
      await queryInterface.addColumn('Volunteers', 'lastWeekHours', {
        type: Sequelize.FLOAT,
        defaultValue: 0
      });
      await queryInterface.addColumn('Volunteers', 'lastWeekIncrease', {
        type: Sequelize.FLOAT,
        defaultValue: 0
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },

  down: async (queryInterface) => {
    try {
      await queryInterface.removeColumn('Volunteers', 'lastWeekShifts');
      await queryInterface.removeColumn('Volunteers', 'lastWeekHours');
      await queryInterface.removeColumn('Volunteers', 'lastWeekIncrease');
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
};