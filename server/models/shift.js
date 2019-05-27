'use strict';
module.exports = (sequelize, DataTypes) => {
  const Shift = sequelize.define('Shift', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    start: DataTypes.DATE,
    stop: DataTypes.DATE,
    postcode: DataTypes.STRING
  }, {});
  Shift.associate = function(models) {
    // associations can be defined here
  };
  return Shift;
};