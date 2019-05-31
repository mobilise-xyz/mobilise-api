'use strict';
module.exports = (sequelize, DataTypes) => {
  const Shift = sequelize.define('Shift', {
    id : {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    creatorId : {
      allowNull: false,
      type: DataTypes.UUID
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    start: {
      type: DataTypes.TIME,
      allowNull: false
    },
    stop: {
      type: DataTypes.TIME,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {});
  Shift.associate = function(models) {

    Shift.belongsToMany(models.Role, {
      through: models.ShiftRole,
      as: "roles",
      foreignKey: "shiftId"
    });

    Shift.belongsTo(models.RepeatedShift, {
      as: "repeated",
      foreignKey: "repeatedId"
    });

    Shift.belongsToMany(models.Volunteer, {
      through: models.Booking,
      as: "volunteers",
      foreignKey: "shiftId"
    })
  };
  return Shift;
};