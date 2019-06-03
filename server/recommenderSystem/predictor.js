const Shift = require('../models').Shift;
const sequelize = require("sequelize");

const shiftRepository = require('../repositories').ShiftRepository;

var Predictor = function(shiftRepository) {

  this.shiftRepository = shiftRepository;

  this.computeShiftBookings = function() {

    shiftRepository
      .getAll([])
      .then(shifts => {
          shifts.foreach(shift => {
            
            var requirements = shift.getRequirements();

            var bookings = shift.getBookings();

          })
      })

  }
}

module.exports = new Predicter(shiftRepository);