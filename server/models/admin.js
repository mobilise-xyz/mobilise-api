"use strict";
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    "Admin",
    {
      userId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID
      }
    },
    {}
  );
  Admin.associate = function(models) {
    const { User, Shift } = models;
    Admin.belongsTo(User, {
      foreignKey: {
        name: "userId",
        allowNull: false
      },
      onDelete: "CASCADE"
    });

    Admin.hasMany(Shift, {
      as: "shifts",
      foreignKey: "creatorId"
    });

    Admin.belongsTo(User, {
      as: "user",
      foreignKey: "userId"
    });
  };
  return Admin;
};
