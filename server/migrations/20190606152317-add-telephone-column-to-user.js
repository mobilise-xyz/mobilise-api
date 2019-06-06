'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn("Users", "telephone", {
      type: Sequelize.STRING,
      allowNull: false
    })

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Users", "telephone");
  }
};
