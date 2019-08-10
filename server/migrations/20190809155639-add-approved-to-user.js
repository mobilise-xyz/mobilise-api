'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn("Users", "approved", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: false
    })

  },

  down: (queryInterface) => {
    return queryInterface.removeColumn("Users", "approved");
  }
};
