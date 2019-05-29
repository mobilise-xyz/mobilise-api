'use strict';
module.exports = (sequelize, DataTypes) => {
  const Volunteer = sequelize.define('Volunteer', {
    userId : {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    roles: DataTypes.ARRAY(DataTypes.STRING)
  }, {});
  Volunteer.associate = function(models) {
    Volunteer.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
  };
  return Volunteer;
};