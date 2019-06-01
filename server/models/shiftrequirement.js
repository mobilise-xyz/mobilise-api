"use strict";
module.exports = (sequelize, DataTypes) => {
  const ShiftRequirement = sequelize.define(
    "ShiftRequirement",
    {
      shiftId: {
        allowNull: false,
        type: DataTypes.UUID,
        primaryKey: true
      },
      roleName: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING
      },
      numberRequired: DataTypes.INTEGER
    },
    {}
  );
  ShiftRequirement.associate = function(models) {
    ShiftRequirement.hasMany(models.Booking, {
      as: "bookings",
      foreignKey: "shiftId"
    });

    ShiftRequirement.belongsTo(models.Role, {
      as: "role",
      foreignKey: "roleName"
    });

    ShiftRequirement.belongsTo(models.Shift, {
      as: "shift",
      foreignKey: "shiftId"
    });
  };
  return ShiftRequirement;
};
