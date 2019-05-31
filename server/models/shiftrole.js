'use strict';
module.exports = (sequelize, DataTypes) => {
  const ShiftRole = sequelize.define('ShiftRole', {
    shiftId : {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    roleName: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    numberRequired: DataTypes.INTEGER
  }, {});
  ShiftRole.associate = function(models) {
    // associations can be defined here
  };
  return ShiftRole;
};