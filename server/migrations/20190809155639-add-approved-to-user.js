'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn("Users", "approved", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })

  },

  down: (queryInterface) => {
    return queryInterface.removeColumn("Users", "approved");
  }
};
