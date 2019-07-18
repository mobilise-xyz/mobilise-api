'use strict';

module.exports = (sequelize, DataTypes) => {
  const {BOOLEAN, UUID} = DataTypes;
  const UserContactPreference = sequelize.define('UserContactPreference', {
    userId: {
      type: UUID,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    text: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {});

  UserContactPreference.associate = function(models) {
    const {User} = models;
    UserContactPreference.belongsTo(User, {
      as: "user",
      foreignKey: "userId"
    })

  };
  
  return UserContactPreference;
};