const ical = require("ical-generator");
const moment = require("moment");
const bookingRepository = require("../repositories").BookingRepository;
const shiftRepository = require("../repositories").ShiftRepository;
const userRepository = require("../repositories").UserRepository;

const {SHIFT_AFTER} = require("../sequelizeUtils/where");

let CalendarController = function(bookingRepository) {

  this.subscribeToBookings = function(req, res) {
    const cal = ical({name: 'City Harvest London - Bookings'});
    const now = moment();
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
            start: moment(`${booking.shift.date} ${booking.shift.start}`),
            end: moment(`${booking.shift.date} ${booking.shift.stop}`),
            summary: booking.shift.title,
            location: booking.shift.address,
            description: `Description: ${booking.shift.description}\nRole: ${booking.roleName}`,
            url: 'https://city-harvest.mobilise.xyz/shifts'
          });
        });
        res.set('Content-Type', 'text/calendar;charset=utf-8');
        res.status(200).send(cal.toString());
      })
      .catch(err => res.status(500).json({message: err}));
  };

  this.subscribeToShifts = function(req, res) {
    const cal = ical({name: 'City Harvest London - Shifts'});
    const now = moment();
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
            start: moment(`${shift.date} ${shift.start}`),
            end: moment(`${shift.date} ${shift.stop}`),
            summary: shift.title,
            location: shift.address,
            description: `Description: ${shift.description}`,
            url: 'https://city-harvest.mobilise.xyz/'
          });
        });
        res.set('Content-Type', 'text/calendar;charset=utf-8');
        res.status(200).send(cal.toString());
      })
      .catch(err => res.status(500).json({message: err}));
  };

};

module.exports = new CalendarController(bookingRepository);
