'use strict';
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    userId : {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    }
  }, {});
  Admin.associate = function(models) {
    Admin.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
    Admin.hasMany(models.Shift, {
      as: "shifts",
    });
  };
  return Admin;
};