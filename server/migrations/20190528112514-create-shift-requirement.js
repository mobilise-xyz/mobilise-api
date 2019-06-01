'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ShiftRequirements', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      shiftId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Shifts',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      roleName: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Roles',
          key: 'name'
        },
        onDelete: 'CASCADE'
      },
      numberRequired: {
        type: Sequelize.INTEGER
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ShiftRequirements');
  }
};