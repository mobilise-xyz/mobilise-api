'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserContactPreference = sequelize.define('UserContactPreference', {
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

  UserContactPreference.associate = function(models) {
    
    UserContactPreference.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId"
    })

  };
  
  return UserContactPreference;
};