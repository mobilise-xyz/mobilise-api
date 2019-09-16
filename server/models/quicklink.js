'use strict';
module.exports = (sequelize, DataTypes) => {
  const QuickLink = sequelize.define('QuickLink', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    link: DataTypes.STRING,
    name: DataTypes.STRING
  }, {});
  QuickLink.associate = function() {
    // associations can be defined here
  };
  return QuickLink;
};