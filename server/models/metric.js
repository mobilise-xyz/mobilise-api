'use strict';
module.exports = (sequelize, DataTypes) => {
  const Metric = sequelize.define('Metric', {
    name: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    verb: {
      allowNull: false,
      type: DataTypes.STRING
    },
    value: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  Metric.associate = function() {
    // associations can be defined here
  };
  return Metric;
};