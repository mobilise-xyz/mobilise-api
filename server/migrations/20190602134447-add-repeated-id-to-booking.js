"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Bookings", "repeatedId", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "RepeatedBookings",
        key: "id"
      },
      onDelete: "CASCADE"
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Bookings", "repeatedId");
  }
};
