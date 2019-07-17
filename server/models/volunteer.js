"use strict";
module.exports = (sequelize, DataTypes) => {
  const { INTEGER, ARRAY, UUID, STRING, FLOAT, CHAR } = DataTypes;
  const Volunteer = sequelize.define(
    "Volunteer",
    {
      userId: {
        allowNull: false,
        primaryKey: true,
        type: UUID
      },
      roles: ARRAY(STRING),
      availability: {
        type: ARRAY(ARRAY(CHAR(1))),
        allowNull: false,
        defaultValue: Array(7).fill(["0", "0", "0"])
      },
      lastWeekShifts: {
        type: INTEGER
      },
      lastWeekHours: {
        type: FLOAT
      },
      lastWeekIncrease: {
        type: FLOAT
      }
    },
    {}
  );

  Volunteer.associate = function(models) {
    const { Shift, Booking, User } = models;
    Volunteer.belongsTo(User, {
      as: "user",
      foreignKey: {
        name: "userId",
        allowNull: false
      },
      onDelete: "CASCADE"
    });

    Volunteer.hasMany(Booking, {
      as: "bookings",
      foreignKey: "volunteerId"
    });

    Volunteer.belongsToMany(Shift, {
      as: "shifts",
      through: Booking,
      foreignKey: "volunteerId"
    });
  };
  return Volunteer;
};
