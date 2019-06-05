'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("ShiftRequirements", "expectedShortage", {
      type: Sequelize.INTEGER
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn("ShiftRequirements", "expectedShortage");
  }
};
