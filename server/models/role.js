'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: DataTypes.STRING,
    involves: DataTypes.STRING
  }, {});
  Role.associate = function(models) {
    Role.belongsToMany(models.Shift, {
      as: 'shifts', 
      through: models.ShiftRole,
      foreignKey: 'roleId' }
   );
  };
  return Role;
};