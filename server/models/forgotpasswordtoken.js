'use strict';
module.exports = (sequelize, DataTypes) => {
  const ForgotPasswordToken = sequelize.define('ForgotPasswordToken', {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {});
  ForgotPasswordToken.associate = function() {
    // associations can be defined here
  };
  return ForgotPasswordToken;
};