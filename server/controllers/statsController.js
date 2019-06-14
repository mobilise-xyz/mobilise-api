const moment = require("moment");
const Op = require("../models").Sequelize.Op;
const volunteerRepository = require("../repositories").VolunteerRepository;

var StatsController = function() {
  this.computeHallOfFame = function(req, res) {
    if (
      process.env.COMPUTATION_TRIGGER_KEY !== req.body.COMPUTATION_TRIGGER_KEY
    ) {
      res.status(401).send({ message: "Unauthorised request" });
      return;
    }

    var date = moment().format("YYYY-MM-DD");
    var time = moment().format("HH:mm");
    var lastWeek = moment()
      .subtract(7, "d")
      .format("YYYY-MM-DD");

    volunteerRepository
      .getAllWithShifts({
        [Op.or]: [
          {
            date: {
              [Op.gt]: lastWeek
            }
          },
          {
            [Op.and]: [
              {
                date: {
                  [Op.eq]: lastWeek
                },
                start: {
                  [Op.gte]: time
                }
              }
            ]
          }
        ],
        [Op.and]: {
          // Started after last week
          // Stopped before now
          [Op.or]: [
            {
              date: {
                [Op.lt]: date
              }
            },
            {
              [Op.and]: [
                {
                  date: {
                    [Op.eq]: date
                  },
                  stop: {
                    [Op.lte]: time
                  }
                }
              ]
            }
          ]
        }
      })
      .then(async volunteers => {
        for (var i = 0; i < volunteers.length; i++) {
          var volunteer = volunteers[i];
          var lastWeekHours = 0;
          var lastWeekShifts = volunteer.shifts.length;
          var lastWeekIncrease = 0;
          volunteer.shifts.forEach(shift => {
            var startTime = moment(shift.start, "HH:mm");
            var stopTime = moment(shift.stop, "HH:mm");
            var duration = moment.duration(stopTime.diff(startTime));
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
        res.status(200).send({ message: "Computation Successful" });
      });
  };
};

module.exports = new StatsController();
