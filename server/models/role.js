"use strict";
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      name: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING
      },
      involves: DataTypes.STRING
    },
    {}
  );

  Role.associate = function(models) {
    Role.belongsToMany(models.Shift, {
      through: models.ShiftRequirement,
      as: "shifts",
      foreignKey: "roleName"
    });
  };
  return Role;
};
