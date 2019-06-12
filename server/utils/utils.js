const Op = require("../models").Sequelize.Op;
function shiftStartsAfter(date, time) {
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

module.exports = { shiftStartsAfter };
