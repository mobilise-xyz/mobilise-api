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
    const { RepeatedBooking, Shift, Volunteer } = models;
    Booking.belongsTo(RepeatedBooking, {
      as: "repeated",
      foreignKey: "repeatedId"
    });
    Booking.belongsTo(Shift, {
      as: "shift",
      foreignKey: "shiftId"
    });
    Booking.belongsTo(Volunteer, {
      as: "volunteer",
      foreignKey: "volunteerId"
    });
  };
  return Booking;
};
