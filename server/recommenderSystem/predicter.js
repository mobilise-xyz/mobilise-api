const Shift = require('../models').Shift;
const sequelize = require("sequelize");

const shiftRepository = require('../repositories').ShiftRepository;

var Predicter = function(shiftRepository) {

    this.shiftRepository = shiftRepository;

}

module.exports = new Predicter(shiftRepository);