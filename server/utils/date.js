const moment = require("moment");

function getNextDate(date, type) {
  console.log(date);
  switch (type) {
    case "daily":
      date = moment(date)
        .add(1, "d")
        .toDate();
      break;
    case "weekly":
      date = moment(date)
        .add(1, "w")
        .toDate();
      break;
    case "monthly":
      date = moment(date)
        .add(1, "M")
        .toDate();
      break;
    case "annually":
      date = moment(date)
        .add(1, "years")
        .toDate();
      break;
    case "weekdays":
      do {
        date = moment(date)
          .add(1, "d")
          .toDate();
      } while (isWeekend(date));
      break;
    case "weekends":
      do {
        date = moment(date)
          .add(1, "d")
          .toDate();
      } while (!isWeekend(date));
      break;
    default:
  }
  console.log(date);
  return date;
}

function isWeekend(date) {
  return date.getDay() % 6 == 0;
}

module.exports = { isWeekend, getNextDate };
