'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn("Users", "lastLocked", {
      type: Sequelize.DATE,
      allowNull: true,
    })

  },

  down: (queryInterface) => {
    return queryInterface.removeColumn("Users", "lastLocked");
  }
};
