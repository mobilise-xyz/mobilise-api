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
      },
      repeatedId: {
        type: DataTypes.UUID
      }
    },
    {}
  );
  Booking.associate = function(models) {
    Booking.belongsTo(models.RepeatedBooking, {
      as: "repeated",
      foreignKey: "repeatedId"
    });
  };
  return Booking;
};
