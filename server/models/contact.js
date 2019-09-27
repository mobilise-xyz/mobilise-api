"use strict";
module.exports = (sequelize, DataTypes) => {
  const {UUID, UUIDV4, STRING} = DataTypes;
  const Contact = sequelize.define(
    "Contact",
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
      telephone: {
        type: STRING,
        allowNull: false
      },
      relation: {
        type: STRING,
        allowNull: false
      },
      volunteerId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID
      }
    },
    {}
  );
  Contact.associate = function (models) {
    const {Volunteer} = models;

    Contact.belongsTo(Volunteer, {
      as: "volunteer",
      foreignKey: "volunteerId"
    });
  };
  return Contact;
};
