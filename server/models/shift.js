"use strict";
module.exports = (sequelize, DataTypes) => {
  const {STRING, TIME, UUIDV4, UUID, DATEONLY} = DataTypes;
  const Shift = sequelize.define(
    "Shift",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: UUID,
        defaultValue: UUIDV4
      },
      creatorId: {
        allowNull: false,
        type: UUID
      },
      title: {
        type: STRING,
        allowNull: false
      },
      description: {
        type: STRING,
        allowNull: false
      },
      date: {
        type: DATEONLY,
        allowNull: false
      },
      start: {
        type: TIME,
        allowNull: false
      },
      stop: {
        type: TIME,
        allowNull: false
      },
      address: {
        type: STRING,
        allowNull: false
      },
      repeatedId: {
        type: UUID
      }
    },
    {}
  );
  Shift.associate = function(models) {
    const {Booking, ShiftRequirement, Admin, Role, RepeatedShift, Volunteer} = models;
    Shift.belongsToMany(Role, {
      through: ShiftRequirement,
      as: "roles",
      foreignKey: "shiftId"
    });

    Shift.belongsTo(RepeatedShift, {
      as: "repeated",
      foreignKey: "repeatedId"
    });

    Shift.hasMany(ShiftRequirement, {
      as: "requirements",
      foreignKey: "shiftId"
    });

    Shift.belongsToMany(Volunteer, {
      through: Booking,
      as: "volunteers",
      foreignKey: "shiftId"
    });

    Shift.hasMany(Booking, {
      as: "bookings",
      foreignKey: "shiftId"
    });

    Shift.belongsTo(Admin, {
      as: "creator",
      foreignKey: "creatorId"
    });
  };
  return Shift;
};
