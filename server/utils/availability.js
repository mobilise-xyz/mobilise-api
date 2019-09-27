const moment = require("moment");

const volunteerRepository = require('../repositories').VolunteerRepository;

const AVAILABILITY_THRESHOLD = 0.5;

function volunteerIsAvailableForShift(volunteer, shift) {

  let dayOfWeek = getDayOfWeekForDate(shift.date);
  let dayAvailability = volunteer.availability[(((dayOfWeek - 1) % 7) + 7) % 7];

  let startAvailability = dayAvailability[getSlotForTime(shift.start)];
  let stopAvailability  = dayAvailability[getSlotForTime(shift.stop)];
  
  return (Number(startAvailability) + Number(stopAvailability) / 2) >= AVAILABILITY_THRESHOLD;
}

function volunteerIsAvailableForShiftStart(volunteer, shift) {

  let dayOfWeek = getDayOfWeekForDate(shift.date);
  let dayAvailability = volunteer.availability[(((dayOfWeek - 1) % 7) + 7) % 7];

  let startAvailability = dayAvailability[getSlotForTime(shift.start)];
  
  return Number(startAvailability) >= AVAILABILITY_THRESHOLD;
}

function getSlotForTime(time) {
  let m = moment(time, "hh:mm:ss");
  if (m.isBefore(moment("12:00:00",  "hh:mm:ss"))) {
    return 0;
  } else if (m.isAfter(moment("16:00:00",  "hh:mm:ss"))) {
    return 2;
  }
  return 1;
}

// Accepts date in YYYY-MM-DD formate
function getDayOfWeekForDate(date) {
  return moment(date, "YYYY-MM-DD").toDate().getDay();
}

function volunteerBookedOnShift(volunteer, shift) {
  for (let i = 0; i < shift.requirements.length; i++) {
    let requirement = shift.requirements[i];
    for (let j = 0; j < requirement.bookings.length; j++) {
      if (requirement.bookings[j].volunteerId === volunteer.userId) {
        return true;
      }
    }
  }
  return false;
}

function getCumulativeAvailability() {

  return volunteerRepository.getAll()
    .then(volunteers => {

      // Initialise array to build cumulative availability
      let array = [
        [0,0,0],
        [0,0,0],
        [0,0,0],
        [0,0,0],
        [0,0,0],
        [0,0,0],
        [0,0,0]
      ];

      // Loop through list of volunteers and build the array of cumulative availabilities
      let i;
      for(i = 0; i < volunteers.length; i++) {
        let availability = volunteers[i].availability;

        // Loop through each element of 2D availability array
        let j;
        for(j = 0; j < array.length; j++) {
          let k;
          for(k = 0; k < array[j].length; k++) {

            // Compare availability character and increment corresponding cell in array
            if (availability[j][k] === '2' || availability[j][k] === '1') {
              array[j][k] = array[j][k] + 1;
            }  
          }
        }
      }
      return array;
    });
}

module.exports = {
  volunteerIsAvailableForShift,
  volunteerIsAvailableForShiftStart,
  volunteerBookedOnShift,
  getCumulativeAvailability,
  getSlotForTime,
  getDayOfWeekForDate
};