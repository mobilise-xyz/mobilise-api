const moment = require("moment");
const Q = require("q");
const volunteerRepository = require('../repositories').VolunteerRepository;

const AVAILABILITY_THRESHOLD = 0.5;

function volunteerIsAvailableForShift(volunteer, shift) {

  var dayOfWeek = moment(shift.date, "YYYY-MM-DD").toDate().getDay();
  var dayAvailability = volunteer.availability[(((dayOfWeek - 1) % 7) + 7) % 7];

  var startAvailability = dayAvailability[getSlotForTime(shift.start)];
  var stopAvailability  = dayAvailability[getSlotForTime(shift.stop)];
  
  return (Number(startAvailability) + Number(stopAvailability) / 2) >= AVAILABILITY_THRESHOLD;
}

function getSlotForTime(time) {
  var m = moment(time, "hh:mm:ss");
  if (m.isBefore(moment("12:00:00",  "hh:mm:ss"))) {
    return 0;
  } else if (m.isAfter(moment("16:00:00",  "hh:mm:ss"))) {
    return 2;
  }
  return 1;
}

function volunteerBookedOnShift(volunteer, shift) {
  for (var i = 0; i < shift.requirements.length; i++) {
    var requirement = shift.requirements[i];
    for (var j = 0; j < requirement.bookings.length; j++) {
      if (requirement.bookings[j].volunteerId === volunteer.userId) {
        return true;
      }
    }
  }
  return false;
}

async function getCumulativeAvailability() {

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

module.exports = {
  volunteerIsAvailableForShift,
  volunteerBookedOnShift,
  getCumulativeAvailability
};