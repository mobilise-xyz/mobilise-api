"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Bookings", {
      shiftId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        references: {
          model: "Shifts",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      volunteerId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        references: {
          model: "Volunteers",
          key: "userId"
        },
        onDelete: "CASCADE"
      },
      roleName: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: "Roles",
          key: "name"
        },
        onDelete: "CASCADE"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable("Bookings");
  }
};
