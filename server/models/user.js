"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {}
  );
  User.associate = function(models) {
    User.hasOne(models.Volunteer, {
      as: "volunteer",
      foreignKey: "userId"
    });

    User.hasOne(models.Admin, {
      as: "admin",
      foreignKey: "userId"
    });

    User.hasOne(models.UserContactPreference, {
      as: "contactPreference",
      foreignKey: "userId"
    });
  };
  return User;
};
