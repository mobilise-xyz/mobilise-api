"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Shifts", "creatorId", {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "Admins",
        key: "userId"
      },
      onDelete: "CASCADE"
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn("Shifts", "creatorId");
  }
};
