'use strict';
const User = require('../models').User;
module.exports = (sequelize, DataTypes) => {
    const Volunteer = sequelize.define('Volunteer', {

    }, {});
    Volunteer.associate = function(models) {
        this.myAssociation = this.belongsTo(models.User);
    };
    return Volunteer;
};