const Shift = require('../models').Shift;
const sequelize = require("sequelize");

const shiftRepository = require('../repositories').ShiftRepository;

var Predictor = function(shiftRepository) {

  this.shiftRepository = shiftRepository;

  this.updateRecommendedShifts = function() {

    // Remove old entries in Recommended Shifts Table
    

    shiftRepository
      .getAllWithRequirements()
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

          // Add entry in Recommended Shifts Table

        })
      });

  }
}

module.exports = new Predictor(shiftRepository);