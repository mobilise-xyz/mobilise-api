'use strict';
module.exports = (sequelize, DataTypes) => {
  const InvitationToken = sequelize.define('InvitationToken', {
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
  InvitationToken.associate = function() {
    // associations can be defined here
  };
  return InvitationToken;
};