'use strict';
module.exports = (sequelize, DataTypes) => {
  const Volunteer = sequelize.define('Volunteer', {
    userId : {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    roles: DataTypes.ARRAY(DataTypes.STRING),
    availability: {
      type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.CHAR(1))),
      allowNull: false,
      defaultValue: Array(7).fill(['0', '0', '0'])
    }
  }, {});

  Volunteer.associate = function(models) {
    Volunteer.belongsTo(models.User, {
      as: "user",
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });

    Volunteer.hasMany(models.Booking, {
      as: "bookings",
      foreignKey: "volunteerId"
    });

    Volunteer.belongsToMany(models.Shift, {
      as: "shifts",
      through: models.Booking,
      foreignKey: "volunteerId"
    });
  };
  return Volunteer;
};