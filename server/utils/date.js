function getNextDate(date, type) {
  switch (type) {
    case "daily":
      date.add(1, "d");
      break;
    case "weekly":
      date.add(1, "w");
      break;
    case "monthly":
      date.add(1, "M");
      break;
    case "annually":
      date.add(1, "years");
      break;
    case "weekdays":
      do {
        date.add(1, "d");
      } while (isWeekend(date));
      break;
    case "weekends":
      do {
        date.add(1, "d");
      } while (!isWeekend(date));
      break;
    default:
  }
  return date;
}

// date is a moment
function isWeekend(date) {
  return date.toDate().getDay() % 6 == 0;
}

module.exports = { isWeekend, getNextDate };
