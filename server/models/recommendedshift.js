'use strict';
module.exports = (sequelize, DataTypes) => {
  const RecommendedShift = sequelize.define('RecommendedShift', {
    shiftId: DataTypes.UUID,
    roleName: DataTypes.STRING,
    expectedShortage: DataTypes.FLOAT
  }, {});
  RecommendedShift.associate = function(models) {
    // associations can be defined here
  };
  return RecommendedShift;
};