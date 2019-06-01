"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Shifts", "repeatedId", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "RepeatedShifts",
        key: "id"
      },
      onDelete: "CASCADE"
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Shifts", "repeatedId");
  }
};
