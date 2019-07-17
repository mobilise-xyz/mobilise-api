"use strict";
module.exports = (sequelize, DataTypes) => {
  const { STRING, FLOAT, UUID, INTEGER } = DataTypes;
  const ShiftRequirement = sequelize.define(
    "ShiftRequirement",
    {
      shiftId: {
        allowNull: false,
        type: UUID,
        primaryKey: true
      },
      roleName: {
        allowNull: false,
        primaryKey: true,
        type: STRING
      },
      numberRequired: INTEGER,
      expectedShortage: FLOAT
    },
    {}
  );
  ShiftRequirement.associate = function(models) {
    const { Shift, Booking, Role } = models;
    ShiftRequirement.hasMany(Booking, {
      as: "bookings",
      foreignKey: "shiftId"
    });

    ShiftRequirement.belongsTo(Role, {
      as: "role",
      foreignKey: "roleName"
    });

    ShiftRequirement.belongsTo(Shift, {
      as: "shift",
      foreignKey: "shiftId"
    });
  };
  return ShiftRequirement;
};
