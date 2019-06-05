const moment = require("moment");

function volunteerIsAvailableForShift(volunteer, shift) {

  var dayOfWeek = moment(shift.date, "YYYY-MM-DD").toDate().getDay();
  var dayAvailability = volunteer.availability[(((dayOfWeek - 1) % 7) + 7) % 7];

  var startAvailability= dayAvailability[getSlotForTime(shift.start)];
  var stopAvailability = dayAvailability[getSlotForTime(shift.stop)];
  return Number(startAvailability) + Number(stopAvailability) / 2;
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

module.exports = {volunteerIsAvailableForShift};