'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Volunteers", "availability", {
      type: Sequelize.ARRAY(Sequelize.ARRAY(Sequelize.CHAR(1))),
      allowNull: false,
      defaultValue: Array(7).fill(['0', '0', '0'])
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Volunteers", "availability");
  }
};
