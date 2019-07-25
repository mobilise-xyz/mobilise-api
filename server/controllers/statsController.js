const moment = require("moment");
const { SHIFT_BETWEEN } = require("../sequelizeUtils/where");
const volunteerRepository = require("../repositories").VolunteerRepository;

let StatsController = function() {
  this.computeHallOfFame = function(req, res) {
    if (process.env.COMPUTATION_TRIGGER_KEY !== req.body.key) {
      res.status(401).send({ message: "Unauthorised request" });
      return;
    }

    let date = moment().format("YYYY-MM-DD");
    let time = moment().format("HH:mm");
    let lastWeek = moment()
      .subtract(7, "d")
      .format("YYYY-MM-DD");

    volunteerRepository
      .getAllWithShifts(SHIFT_BETWEEN(lastWeek, time, date, time))
      .then(async volunteers => {
        for (let i = 0; i < volunteers.length; i++) {
          let volunteer = volunteers[i];
          let lastWeekHours = 0;
          let lastWeekShifts = volunteer.shifts.length;
          let lastWeekIncrease = 0;
          volunteer.shifts.forEach(shift => {
            let startTime = moment(shift.start, "HH:mm");
            let stopTime = moment(shift.stop, "HH:mm");
            let duration = moment.duration(stopTime.diff(startTime));
            lastWeekHours += duration.asHours();
          });
          if (volunteer.lastWeekHours > 0) {
            lastWeekIncrease = lastWeekHours / volunteer.lastWeekHours;
          }
          await volunteerRepository.update(volunteer, {
            lastWeekHours: lastWeekHours,
            lastWeekShifts: lastWeekShifts,
            lastWeekIncrease: lastWeekIncrease
          });
        }
        res.status(200).json({ message: "Computation Successful" });
      });
  };
};

module.exports = new StatsController();
