'use strict';
module.exports = (sequelize, DataTypes) => {
  const Shift = sequelize.define('Shift', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    date: DataTypes.DATEONLY,
    start: DataTypes.TIME,
    stop: DataTypes.TIME,
    postcode: DataTypes.STRING
  }, {});
  Shift.associate = function(models) {
    // associations can be defined here
  };
  return Shift;
};