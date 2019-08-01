"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Volunteers", "calendarAccessKey", {
      type: Sequelize.UUID,
      allowNull: true,
      unique: true
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn("Volunteers", "calendarAccessKey");
  }
};
