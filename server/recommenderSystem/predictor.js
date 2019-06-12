const Q = require("q");
const shiftRepository = require("../repositories").ShiftRepository;
const ShiftRequirement = require("../models").ShiftRequirement;
const volunteerRepository = require("../repositories").VolunteerRepository;
const getCumulativeAvailability = require('../utils/availability').getCumulativeAvailability;
const Op = require("../models").Sequelize.Op;

var Predictor = function(shiftRepository) {

  this.shiftRepository = shiftRepository;

  this.computeExpectedShortages = async function(whereTrue) {
    var deferred = Q.defer();

    const cumulativeAvailability = await getCumulativeAvailability();

    var updatedShiftRequirements = [];

    await shiftRepository
      .getAllWithRequirements(whereTrue)
      .then(async shifts => {

        await shifts.forEach(shift => {
          // Obtain the shift requirements
          var requirements = shift.requirements;

          requirements.forEach(async requirement => {

            // Obtain the bookings made for specific role requirement
            var bookings = requirement.bookings;

            // Obtain all the volunteers who have made bookings
            var volunteers = await volunteerRepository.getAll({
              userId: { [Op.in]: bookings }
            })

            console.log('VOLUNTEERS');
            console.log(volunteers);

            // Add updated shift requirement to list
            updatedShiftRequirements.push({
              shiftId: shift.id,
              roleName: requirement.role.name,
              numberRequired: requirement.numberRequired,
              expectedShortage: requirement.numberRequired - bookings.length
            });
          });
        });

        return updatedShiftRequirements;
      })
      .then(async updatedShiftRequirements => {

        var i;
        for(i = 0; i < updatedShiftRequirements.length; i++) {

          var shiftRequirement = updatedShiftRequirements[i];

          await ShiftRequirement.update(
            { expectedShortage: shiftRequirement.expectedShortage },
            {
              where: {
                shiftId: shiftRequirement.shiftId,
                roleName: shiftRequirement.roleName
              }
            }
          );

        }
      })
      .then(result => deferred.resolve(result))
      .catch(error => deferred.reject(error));

    return deferred.promise;
  };
};

module.exports = new Predictor(shiftRepository);
