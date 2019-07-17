"use strict";
module.exports = (sequelize, DataTypes) => {
  const {UUIDV4, DATEONLY, UUID, STRING} = DataTypes;
  const RepeatedBooking = sequelize.define(
    "RepeatedBooking",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: UUID,
        defaultValue: UUIDV4
      },
      type: {
        type: STRING,
        allowNull: false
      },
      untilDate: {
        type: DATEONLY,
        allowNull: false
      }
    },
    {}
  );
  RepeatedBooking.associate = function(models) {
    const { Booking } = models;
    RepeatedBooking.hasMany(Booking, {
      as: "bookings",
      foreignKey: "repeatedId"
    });
  };
  return RepeatedBooking;
};
