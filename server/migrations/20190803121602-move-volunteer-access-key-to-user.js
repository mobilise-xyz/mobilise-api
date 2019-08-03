'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Volunteers", "calendarAccessKey"),
      queryInterface.addColumn("Users", "calendarAccessKey", {
        type: Sequelize.UUID,
        allowNull: true,
        unique: true
      })
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Users", "calendarAccessKey"),
      queryInterface.addColumn("Volunteers", "calendarAccessKey", {
        type: Sequelize.UUID,
        allowNull: true,
        unique: true
      })
    ]);
  }
};
