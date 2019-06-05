const Q = require("q");
const shiftRepository = require("../repositories").ShiftRepository;
const ShiftRequirement = require("../models").ShiftRequirement;
const Op = require("../models").Sequelize.Op;

var Predictor = function(shiftRepository) {
  this.shiftRepository = shiftRepository;

  this.computeExpectedShortages = function(whereTrue) {
    var deferred = Q.defer();

    var updatedShiftRequirements = [];

    shiftRepository
      .getAllWithRequirements(whereTrue)
      .then(shifts => {
        // var shiftRequirementKeys = [];

        shifts.forEach(shift => {
          // Obtain the shift requirements
          var requirements = shift.requirements;

          requirements.forEach(requirement => {
            // Store shift id and role name in a list
            // shiftRequirementKeys.push({
            //   shiftId: shift.id,
            //   roleName: requirement.role.name
            // })

            // Obtain the bookings made for specific role requirement
            var bookings = requirement.bookings;

            // Add updated shift requirement to list
            updatedShiftRequirements.push({
              shiftId: shift.id,
              roleName: requirement.role.name,
              numberRequired: requirement.numberRequired,
              expectedShortage: requirement.numberRequired - bookings.length
            });
          });
        });

        updatedShiftRequirements.forEach(async shiftRequirement => {
          // Add updated records
          await ShiftRequirement.update(
            { expectedShortage: shiftRequirement.expectedShortage },
            {
              where: {
                shiftId: shiftRequirement.shiftId,
                roleName: shiftRequirement.roleName
              }
            }
          );
        });
      })
      .then(result => deferred.resolve(result))
      .catch(error => deferred.reject(error));

    return deferred.promise;
  };
};

module.exports = new Predictor(shiftRepository);
