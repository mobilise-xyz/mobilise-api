const Op = require("../models").Sequelize.Op;

function SHIFT_BETWEEEN(startDate, startTime, endDate, endTime) {
  return {
    // Started after startDate and startTime
    [Op.or]: [
      {
        date: {
          [Op.gt]: startDate
        }
      },
      {
        [Op.and]: [
          {
            date: {
              [Op.eq]: startDate
            },
            start: {
              [Op.gte]: startTime
            }
          }
        ]
      }
    ],
    [Op.and]: {
      // Stopped before endDate and endTime
      [Op.or]: [
        {
          date: {
            [Op.lt]: endDate
          }
        },
        {
          [Op.and]: [
            {
              date: {
                [Op.eq]: endDate
              },
              stop: {
                [Op.lte]: endTime
              }
            }
          ]
        }
      ]
    }
  };
}

function SHIFT_BEFORE(date, time) {
  return {
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
  };
}

function SHIFT_AFTER(date, time) {
  return {
    [Op.or]: [
      {
        date: {
          [Op.gt]: date
        }
      },
      {
        [Op.and]: [
          {
            date: {
              [Op.eq]: date
            },
            start: {
              [Op.gte]: time
            }
          }
        ]
      }
    ]
  };
}

module.exports = {
  SHIFT_BETWEEEN,
  SHIFT_BEFORE,
  SHIFT_AFTER
};
