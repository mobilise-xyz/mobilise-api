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
    case "Week Days":
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

// date is a moment
function isWeekend(date) {
  return date.toDate().getDay() % 6 === 0;
}

module.exports = { isWeekend, getNextDate };
