"use strict";
module.exports = (sequelize, DataTypes) => {
  const {STRING} = DataTypes;
  const Role = sequelize.define(
    "Role",
    {
      name: {
        allowNull: false,
        primaryKey: true,
        type: STRING
      },
      involves: STRING,
      colour: STRING
    },
    {}
  );

  Role.associate = function(models) {
    const {Shift, ShiftRequirement} = models;
    Role.belongsToMany(Shift, {
      through: ShiftRequirement,
      as: "shifts",
      foreignKey: "roleName"
    });
  };
  return Role;
};
