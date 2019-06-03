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
            
            // Obtain the shift requirements
            var requirements = shift.getRequirements();

            // Construct Map of role name to number required
            var requirementsMap = new Map();
            requirements.foreach(requirement => {
              requirementsMap.set(requirement.roleName, requirement.numberRequired);
            })

            // Obtain the bookings made for the shift
            var bookings = shift.getBookings();

            // Loop through the bookings and update requirementsMap
            bookings.foreach(booking => {
              requirementsMap.set(booking.roleName, requirementsMap.get(booking.roleName) - 1);
            })

          })
      })

  }
}

module.exports = new Predicter(shiftRepository);