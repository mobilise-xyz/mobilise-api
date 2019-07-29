const ical = require("ical-generator");
const moment = require("moment");
const bookingRepository = require("../repositories").BookingRepository;
const volunteerRepository = require("../repositories").VolunteerRepository;

const {SHIFT_AFTER} = require("../sequelizeUtils/where");

let CalendarController = function(bookingRepository) {

  this.subscribeToBookings = function(req, res) {
    const cal = ical({name: 'City Harvest London'});
    const now = moment();
    const whereShift = SHIFT_AFTER(now.format("YYYY-MM-DD"), now.format("HH:mm:ss"));
    volunteerRepository
      .getByCalendarKey(req.params.key)
      .then(vol => {
        if (!vol) {
          res.status(400).json({message: "No volunteer with that id"});
        } else {
          return bookingRepository.getByVolunteerId(vol.userId, whereShift);
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
};

module.exports = new CalendarController(bookingRepository);
