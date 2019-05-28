'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ShiftRoles', {
      shiftId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        references: {
          model: 'Shifts',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Roles',
          key: 'id'
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
    return queryInterface.dropTable('ShiftRoles');
  }
};