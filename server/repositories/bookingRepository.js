const Booking = require("../models").Booking;
const Shift = require("../models").Shift;
const RepeatedShift = require("../models").RepeatedShift;
const Op = require("../models").Sequelize.Op;
const RepeatedBooking = require("../models").RepeatedBooking;
const Q = require("q");
const getNextDate = require("../utils/date").getNextDate;
const sequelize = require("sequelize");
const moment = require("moment");
const BookingRepositoryInterface = require("./interfaces/bookingRepositoryInterface");

var BookingRepository = Object.create(BookingRepositoryInterface);

BookingRepository.add = function(shift, volunteerId, roleName) {
  var deferred = Q.defer();
  Booking.create({
    shiftId: shift.id,
    volunteerId: volunteerId,
    roleName: roleName
  })
    .then(booking => deferred.resolve(booking))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

BookingRepository.addRepeated = async function(
  shift,
  volunteerId,
  roleName,
  type,
  untilDate
) {
  var deferred = Q.defer();
  var repeatedId;
  var succesful = true;
  await RepeatedBooking.create({
    type: type,
    untilDate: untilDate
  })
    .then(result => (repeatedId = result.id))
    .catch(err => {
      succesful = false;
      deferred.reject(err);
    });
  if (succesful) {
    // Create repeated booking
    RepeatedShift.findOne({
      where: { id: shift.repeatedId },
      include: [
        {
          model: Shift,
          as: "shifts",
          where: {
            date: {
              [Op.between]: [shift.date, untilDate]
            }
          },
          order: [[sequelize.literal("date, start"), "asc"]]
        }
      ]
    })
      .then(result => {
        var bookings = [];
        var shifts = result.shifts;
        var startDate = moment(shift.date, "YYYY-MM-DD");
        var lastDate = moment(untilDate, "YYYY-MM-DD");
        var shiftIndex = 0;
        while (
          (moment(startDate).isBefore(lastDate) ||
            moment(startDate).isSame(lastDate)) &&
          shiftIndex != shifts.length
        ) {
          // Find the next shift for this repeated booking
          while (moment(startDate).isBefore(shifts[shiftIndex].date)) {
            // Increment with respect to the next
            startDate = getNextDate(startDate, type);
          }
          // If the booking increment is larger than shift increment
          // then get the shift that is either after or the same as the
          // booking
          while (moment(startDate).isAfter(shifts[shiftIndex].date)) {
            shiftIndex += 1;
          }

          if (moment(startDate).isSame(shifts[shiftIndex].date)) {
            // Shift must have same day
            bookings.push({
              shiftId: shifts[shiftIndex].id,
              repeatedId: repeatedId,
              roleName: roleName,
              volunteerId: volunteerId
            });
          }
          // Consider next shift
          shiftIndex += 1;
        }
        console.log(bookings);
        return Booking.bulkCreate(bookings);
      })
      .then(bookings =>
        deferred.resolve({
          message: "Created recurring booking",
          lastBooking: bookings[bookings.length - 1]
        })
      )
      .catch(err => deferred.reject(err));
  }
  return deferred.promise;
};

BookingRepository.getAll = function() {
  var deferred = Q.defer();

  Booking.findAll()
    .then(bookings => deferred.resolve(bookings))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

BookingRepository.getAllWithShifts = function() {
  var deferred = Q.defer();

  Booking.findAll({ include: ["shift"] })
    .then(bookings => deferred.resolve(bookings))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

BookingRepository.getById = function(shiftId, volunteerId) {
  var deferred = Q.defer();

  Booking.findOne({
    where: {
      shiftId: shiftId,
      volunteerId: volunteerId
    }
  })
    .then(booking => deferred.resolve(booking))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

module.exports = BookingRepository;
