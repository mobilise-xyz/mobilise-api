'use strict';
module.exports = (sequelize, DataTypes) => {
  const Volunteer = sequelize.define('Volunteer', {
    id : {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    roles: DataTypes.ARRAY(DataTypes.INTEGER)
  }, {});
  Volunteer.associate = function(models) {
    Volunteer.belongsTo(models.User, {
      foreignKey: {
        name: 'id',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
  };
  return Volunteer;
};