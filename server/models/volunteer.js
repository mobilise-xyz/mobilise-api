'use strict';
module.exports = (sequelize, DataTypes) => {
    const Volunteer = sequelize.define('Volunteer', {

    }, {});
    Volunteer.associate = function(models) {
        // associations can be defined here
    };
    // belongsTo adds foreign key to source
    Volunteer.belongsTo(User);
    return Volunteer;
};