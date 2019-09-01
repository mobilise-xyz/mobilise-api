'use strict';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.removeColumn("Users", "approved");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Users", "approved", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
  }
};
