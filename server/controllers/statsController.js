const moment = require("moment");
const { SHIFT_BETWEEN } = require("../sequelizeUtils/where");
const volunteerRepository = require("../repositories").VolunteerRepository;
const {body, validationResult} = require("express-validator");

let StatsController = function() {
  this.computeHallOfFame = function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({message: "Invalid request", errors: errors.array()});
    }
    if (process.env.COMPUTATION_TRIGGER_KEY !== req.body.key) {
      res.status(401).send({ message: "Unauthorised request" });
      return;
    }

    let date = moment.tz('Europe/London').format("YYYY-MM-DD");
    let time = moment.tz('Europe/London').format("HH:mm");
    let lastWeek = moment.tz('Europe/London')
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

  this.validate = function(method) {
    switch (method) {
      case 'computeHallOfFame': {
        return [
          body('key').isString()
        ]
      }
    }
  }
};

module.exports = new StatsController();
