'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserContactPreferences = sequelize.define('UserContactPreferences', {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    text: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {});

  UserContactPreferences.associate = function(models) {
    
    UserContactPreferences.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId"
    })

  };
  
  return UserContactPreferences;
};