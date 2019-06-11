'use strict';
module.exports = (sequelize, DataTypes) => {
  const Metric = sequelize.define('Metric', {
    name: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    value: DataTypes.INTEGER
  }, {});
  Metric.associate = function(models) {
    // associations can be defined here
  };
  return Metric;
};