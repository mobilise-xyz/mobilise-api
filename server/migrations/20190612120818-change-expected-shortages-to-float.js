'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("ShiftRequirements", "expectedShortage", {
      type: Sequelize.FLOAT
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("ShiftRequirements", "expectedShortage", {
      type: Sequelize.INTEGER
    })
  }
};
