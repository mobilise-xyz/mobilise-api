'use strict';
module.exports = (sequelize, DataTypes) => {
  const QuickLink = sequelize.define('QuickLink', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  QuickLink.associate = function() {
    // associations can be defined here
  };
  return QuickLink;
};