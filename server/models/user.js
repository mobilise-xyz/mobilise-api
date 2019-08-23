"use strict";
module.exports = (sequelize, DataTypes) => {
  const {UUID, DATE, BOOLEAN, UUIDV4, STRING } = DataTypes;
  const User = sequelize.define(
    "User",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: UUID,
        defaultValue: UUIDV4
      },
      firstName: {
        type: STRING,
        allowNull: false
      },
      lastName: {
        type: STRING,
        allowNull: false
      },
      isAdmin: {
        type: BOOLEAN,
        defaultValue: false
      },
      email: {
        type: STRING,
        allowNull: false,
        unique: true
      },
      telephone: {
        type: STRING,
        allowNull: false
      },
      password: {
        type: STRING,
        allowNull: false
      },
      lastLogin: {
        type: DATE,
        allowNull: true
      },
      calendarAccessKey: {
        type: UUID,
        unique: true
      }
    },
    {}
  );
  User.associate = function(models) {
    const {Volunteer, Admin, UserContactPreference} = models;
    User.hasOne(Volunteer, {
      as: "volunteer",
      foreignKey: "userId"
    });

    User.hasOne(Admin, {
      as: "admin",
      foreignKey: "userId"
    });

    User.hasOne(UserContactPreference, {
      as: "contactPreferences",
      foreignKey: "userId"
    });
  };
  return User;
};
