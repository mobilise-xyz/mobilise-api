"use strict";
module.exports = (sequelize, DataTypes) => {
  const { STRING, UUIDV4, UUID, DATEONLY } = DataTypes;
  const RepeatedShift = sequelize.define(
    "RepeatedShift",
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
  RepeatedShift.associate = function(models) {
    RepeatedShift.hasMany(models.Shift, {
      as: "shifts",
      foreignKey: "repeatedId"
    });
  };
  return RepeatedShift;
};
