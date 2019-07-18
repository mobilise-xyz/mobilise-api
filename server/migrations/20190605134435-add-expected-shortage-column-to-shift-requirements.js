'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("ShiftRequirements", "expectedShortage", {
      type: Sequelize.INTEGER
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn("ShiftRequirements", "expectedShortage");
  }
};
