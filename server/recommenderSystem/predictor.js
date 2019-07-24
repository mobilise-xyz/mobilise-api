const Q = require("q");
const shiftRepository = require("../repositories").ShiftRepository;
const {ShiftRequirement} = require("../models");
const volunteerRepository = require("../repositories").VolunteerRepository;
const {getCumulativeAvailability, volunteerIsAvailableForShiftStart, getSlotForTime, getDayOfWeekForDate} = require("../utils/availability");
const Op = require("../models").Sequelize.Op;
const {
  REQUIREMENTS_WITH_BOOKINGS
} = require("../sequelizeUtils/include");

let Predictor = function(shiftRepository) {
  this.shiftRepository = shiftRepository;

  this.computeExpectedShortages = async function(whereTrue) {
    let deferred = Q.defer();

    const cumulativeAvailability = await getCumulativeAvailability();

    let updatedShiftRequirements = [];

    await shiftRepository
      .getAll(null, whereTrue, [REQUIREMENTS_WITH_BOOKINGS()])
      .then(async shifts => {
        let i;
        for (i = 0; i < shifts.length; i++) {
          let shift = shifts[i];

          // Obtain the shift requirements
          let requirements = shift.requirements;

          let j;
          for (j = 0; j < requirements.length; j++) {
            let requirement = requirements[j];

            // Obtain the bookings made for specific role requirement
            let bookings = requirement.bookings;

            // Obtain the volunteer user ids from the bookings
            let volunteerIds = bookings.map(booking => booking.volunteerId);

            // Obtain all the volunteers who have made bookings
            let volunteers = await volunteerRepository.getAll({
              userId: { [Op.in]: volunteerIds }
            });

            // Find booked volunters who were available for shift
            let availableVolunteers = volunteers.filter(volunteer =>
              volunteerIsAvailableForShiftStart(volunteer, shift)
            );

            // Find cumulative availability for shift (start time)
            let dayOfWeek = getDayOfWeekForDate(shift.date);

            // Find slot for shift start time
            let slot = getSlotForTime(shift.start);

            // Heuristic to predict how many currently available volunteers will actually book
            let currentAvailabilityForShift =
              (cumulativeAvailability[dayOfWeek][slot] -
                availableVolunteers.length) *
              0.3;

            // Add updated shift requirement to list
            await updatedShiftRequirements.push({
              shiftId: shift.id,
              roleName: requirement.role.name,
              numberRequired: requirement.numberRequired,
              expectedShortage:
                requirement.numberRequired -
                bookings.length -
                currentAvailabilityForShift
            });
          }
        }
        return updatedShiftRequirements;
      })
      .then(async updatedShiftRequirements => {
        let i;
        for (i = 0; i < updatedShiftRequirements.length; i++) {
          let shiftRequirement = updatedShiftRequirements[i];

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
