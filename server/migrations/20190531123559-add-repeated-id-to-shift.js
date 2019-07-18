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

  down: (queryInterface) => {
    return queryInterface.removeColumn("Shifts", "repeatedId");
  }
};
