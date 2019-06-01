'use strict';
module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    requirementId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    volunteerId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    }
  }, {});
  Booking.associate = function(models) {
    // associations can be defined here
  };
  return Booking;
};