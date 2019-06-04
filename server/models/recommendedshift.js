"use strict";
module.exports = (sequelize, DataTypes) => {
  const RecommendedShift = sequelize.define(
    "RecommendedShift",
    {
      shiftId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
      },
      roleName: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      expectedShortage: DataTypes.FLOAT
    },
    {}
  );
  RecommendedShift.associate = function(models) {
    RecommendedShift.belongsTo(models.Shift, {
      as: "shift",
      foreignKey: "shiftId"
    });
  };
  return RecommendedShift;
};
