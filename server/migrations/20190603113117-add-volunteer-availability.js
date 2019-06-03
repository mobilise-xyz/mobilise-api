'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Volunteers", "availability", {
      type: Sequelize.ARRAY(Sequelize.ARRAY(Sequelize.CHAR(1)))
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Volunteers", "availability");
  }
};
