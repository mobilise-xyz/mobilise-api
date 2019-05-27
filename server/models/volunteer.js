'use strict';
module.exports = (sequelize, DataTypes) => {
    const Volunteer = sequelize.define('Volunteer', {
        roles: DataTypes.ARRAY(DataTypes.STRING)
    }, {});
    Volunteer.associate = function(models) {
        this.myAssociation = this.belongsTo(models.User);
    };
    return Volunteer;
};