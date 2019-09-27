'use strict';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.removeColumn("Contacts", "email");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Contacts", "email", {
      type: Sequelize.STRING,
      allowNull: true
    })
  }
};
