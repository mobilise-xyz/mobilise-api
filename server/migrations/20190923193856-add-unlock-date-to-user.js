'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn("Users", "unlockDate", {
      type: Sequelize.DATE,
      allowNull: true,
    })

  },

  down: (queryInterface) => {
    return queryInterface.removeColumn("Users", "unlockDate");
  }
};
