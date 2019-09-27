const ical = require("ical-generator");
const moment = require("moment");
const bookingRepository = require("../repositories").BookingRepository;
const shiftRepository = require("../repositories").ShiftRepository;
const userRepository = require("../repositories").UserRepository;
const {errorMessage} = require("../utils/error");
const {validationResult, param} = require('express-validator');

const {SHIFT_AFTER} = require("../sequelizeUtils/where");

let CalendarController = function(bookingRepository) {

  this.subscribeToBookings = function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({message: "Invalid request", errors: errors.array()});
    }
    const cal = ical({name: 'City Harvest London - Bookings'});
    const now = moment.tz('Europe/London');
    const whereShift = SHIFT_AFTER(now.format("YYYY-MM-DD"), now.format("HH:mm:ss"));
    userRepository
      .getByCalendarKey(req.params.key)
      .then(user => {
        if (!user) {
          res.status(400).json({message: "Not a valid key"});
        } else if (user.isAdmin) {
          res.status(400).json({message: "Admin cannot subscribe to bookings"});
        } else {
          return bookingRepository.getByVolunteerId(user.id, whereShift);
        }
      })
      .then(bookings => {
        bookings.forEach(booking => {
          cal.createEvent({
            uid: booking.shift.id,
            start: moment.tz(`${booking.shift.date} ${booking.shift.start}`, 'Europe/London'),
            end: moment.tz(`${booking.shift.date} ${booking.shift.stop}`, 'Europe/London'),
            summary: booking.shift.title,
            location: booking.shift.address,
            description: `Description: ${booking.shift.description}\nRole: ${booking.roleName}`,
            url: 'https://city-harvest.mobilise.xyz/shifts'
          });
        });
        res.set('Content-Type', 'text/calendar;charset=utf-8');
        res.status(200).send(cal.toString());
      })
      .catch(err => res.status(500).json({message: errorMessage(err)}));
  };

  this.subscribeToShifts = function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({message: "Invalid request", errors: errors.array()});
    }
    const cal = ical({name: 'City Harvest London - Shifts'});
    const now = moment.tz('Europe/London');
    const whereShift = SHIFT_AFTER(now.format("YYYY-MM-DD"), now.format("HH:mm:ss"));
    userRepository
      .getByCalendarKey(req.params.key)
      .then(user => {
        if (!user) {
          res.status(400).json({message: "Not a valid key"});
        } else {
          return shiftRepository.getAll(null, whereShift)
        }
      })
      .then(shifts => {
        shifts.forEach(shift => {
          cal.createEvent({
            uid: shift.id,
            start: moment.tz(`${shift.date} ${shift.start}`, 'Europe/London'),
            end: moment.tz(`${shift.date} ${shift.stop}`, 'Europe/London'),
            summary: shift.title,
            location: shift.address,
            description: `Description: ${shift.description}`,
            url: 'https://city-harvest.mobilise.xyz/'
          });
        });
        res.set('Content-Type', 'text/calendar;charset=utf-8');
        res.status(200).send(cal.toString());
      })
      .catch(err => res.status(500).json({message: errorMessage(err)}));
  };

  this.validate = function(method) {
    switch (method) {
      case 'subscribeToBookings':
      case 'subscribeToShifts': {
        return [
          param('key').isUUID()
        ]
      }
    }
  }

};

module.exports = new CalendarController(bookingRepository);
