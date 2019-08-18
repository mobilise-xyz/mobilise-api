'use strict';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.removeColumn("Users", "dob");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Users", "dob", {
      type: Sequelize.DATEONLY,
      defaultValue: "2019-06-30",
      allowNull: false
    })
  }
};
