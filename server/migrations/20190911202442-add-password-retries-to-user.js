'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn("Users", "passwordRetries", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 3
    })

  },

  down: (queryInterface) => {
    return queryInterface.removeColumn("Users", "passwordRetries");
  }
};
