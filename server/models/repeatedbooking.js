"use strict";
module.exports = (sequelize, DataTypes) => {
  const RepeatedBooking = sequelize.define(
    "RepeatedBooking",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      untilDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      }
    },
    {}
  );
  RepeatedBooking.associate = function(models) {
    // associations can be defined here
  };
  return RepeatedBooking;
};
