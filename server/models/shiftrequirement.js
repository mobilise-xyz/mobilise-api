'use strict';
module.exports = (sequelize, DataTypes) => {
  const ShiftRequirement = sequelize.define('ShiftRequirement', {
    id : {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    shiftId : {
      allowNull: false,
      type: DataTypes.UUID
    },
    roleName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    numberRequired: DataTypes.INTEGER
  }, {});
  ShiftRequirement.associate = function(models) {
    // associations can be defined here
  };
  return ShiftRequirement;
};