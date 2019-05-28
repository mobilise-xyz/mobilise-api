'use strict';
module.exports = (sequelize, DataTypes) => {
  const ShiftRole = sequelize.define('ShiftRole', {
    shiftId : {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    numberRequired: DataTypes.INTEGER
  }, {});
  ShiftRole.associate = function(models) {
    // associations can be defined here
  };
  return ShiftRole;
};