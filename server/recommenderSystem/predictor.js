const Q = require("q");
const shiftRepository = require("../repositories").ShiftRepository;
const ShiftRequirement = require("../models").ShiftRequirement;
const volunteerRepository = require("../repositories").VolunteerRepository;
const Op = require("../models").Sequelize.Op;

var Predictor = function(shiftRepository) {

  this.shiftRepository = shiftRepository;

  this.getCumulativeAvailability = async function() {
    var deferred = Q.defer();

    await volunteerRepository.getAll()
      .then(volunteers => {

        // Initialise array to build cumulative availability
        var array = [
          [0,0,0],
          [0,0,0],
          [0,0,0],
          [0,0,0],
          [0,0,0],
          [0,0,0],
          [0,0,0]
        ]

        // Loop through list of volunteers and build the array of cumulative availabilities
        var i;
        for(i = 0; i < volunteers.length; i++) {
          var availability = volunteers[i].availability;

          // Loop through each element of 2D availability array
          var j;
          for(j = 0; j < array.length; j++) {
            var k;
            for(k = 0; k < array[j].length; k++) {

              // Compare availability character and increment corresponding cell in array
              if (availability[j][k] === '2') {
                array[j][k] = array[j][k] + 1;
              } else if (availability[j][k] === '1') {
                array[j][k] += 0.5;
              } 
            }
          }
        }

        return array;
      })
      .then(result => deferred.resolve(result))
      .catch(error => deferred.reject(error))

    return deferred.promise;
  }

  this.computeExpectedShortages = async function(whereTrue) {
    var deferred = Q.defer();

    var updatedShiftRequirements = [];

    await shiftRepository
      .getAllWithRequirements(whereTrue)
      .then(async shifts => {

        await shifts.forEach(shift => {
          // Obtain the shift requirements
          var requirements = shift.requirements;

          requirements.forEach(requirement => {

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
