'use strict';
module.exports = (sequelize, DataTypes) => {
  const RepeatedShift = sequelize.define('RepeatedShift', {
    id : {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
  }, {});
  RepeatedShift.associate = function(models) {
    RepeatedShift.hasMany(models.Shift, {
      as: "shifts",
      foreignKey: "repeatedId"
    });
  };
  return RepeatedShift;
};