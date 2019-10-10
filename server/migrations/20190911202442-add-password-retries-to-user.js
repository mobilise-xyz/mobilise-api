'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn("Users", "passwordRetries", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 5
    })

  },

  down: (queryInterface) => {
    return queryInterface.removeColumn("Users", "passwordRetries");
  }
};
