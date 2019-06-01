"use strict";
module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    "Booking",
    {
      shiftId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID
      },
      volunteerId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID
      },
      roleName: {
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    {}
  );
  Booking.associate = function(models) {};
  return Booking;
};
