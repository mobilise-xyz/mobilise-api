const moment = require("moment");
const {SHIFT_AFTER, SHIFT_BETWEEN, SHIFT_BEFORE} = require("../sequelizeUtils/where");

function getNextDate(date, type) {
  switch (type) {
    case "Daily":
      date.add(1, "d");
      break;
    case "Weekly":
      date.add(1, "w");
      break;
    case "Monthly":
      date.add(1, "M");
      break;
    case "Annually":
      date.add(1, "years");
      break;
    case "Weekdays":
      do {
        date.add(1, "d");
      } while (isWeekend(date));
      break;
    case "Weekends":
      do {
        date.add(1, "d");
      } while (!isWeekend(date));
      break;
    default:
  }
  return date;
}

function getDateRange(before, after) {
  const beforeMoment = moment(before);
  const afterMoment = moment(after);
  let whereTrue = {};
  if (before && after) {
    const afterDate = afterMoment.format("YYYY-MM-DD");
    const afterTime = afterMoment.format("HH:mm");
    let beforeDate = beforeMoment.format("YYYY-MM-DD");
    let beforeTime = beforeMoment.format("HH:mm");
    whereTrue = SHIFT_BETWEEN(afterDate, afterTime, beforeDate, beforeTime);
  } else if (before) {
    let beforeDate = beforeMoment.format("YYYY-MM-DD");
    let beforeTime = beforeMoment.format("HH:mm");
    whereTrue = SHIFT_BEFORE(beforeDate, beforeTime);
  } else if (after) {
    const afterDate = afterMoment.format("YYYY-MM-DD");
    const afterTime = afterMoment.format("HH:mm");
    whereTrue = SHIFT_AFTER(afterDate, afterTime);
  }
  return whereTrue;
}

// date is a moment
function isWeekend(date) {
  return date.toDate().getDay() % 6 === 0;
}

module.exports = { isWeekend, getNextDate, getDateRange };
