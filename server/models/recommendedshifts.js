'use strict';
module.exports = (sequelize, DataTypes) => {
  const RecommendedShifts = sequelize.define('RecommendedShifts', {
    shiftId: DataTypes.UUID,
    roleName: DataTypes.STRING,
    expectedShortage: DataTypes.FLOAT
  }, {});
  RecommendedShifts.associate = function(models) {
    // associations can be defined here
  };
  return RecommendedShifts;
};