const {Booking, RepeatedShift, RepeatedBooking} = require("../models");
const Q = require("q");
const {getNextDate} = require("../utils/date");
const sequelize = require("sequelize");
const moment = require("moment");
const BookingRepositoryInterface = require("./interfaces/bookingRepositoryInterface");
const { SHIFT, SHIFTS_WITH_BOOKINGS } = require("../sequelizeUtils/include");

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
  var successful = true;
  await RepeatedBooking.create({
    type: type,
    untilDate: untilDate
  })
    .then(result => (repeatedId = result.id))
    .catch(err => {
      successful = false;
      deferred.reject(err);
    });
  if (successful) {
    // Create repeated booking
    RepeatedShift.findOne({
      where: { id: shift.repeatedId },
      include: [
        SHIFTS_WITH_BOOKINGS(shift.date, untilDate, [
          [sequelize.literal("date, start"), "asc"]
        ])
      ]
    })
      .then(result => {
        console.log(result);
        var bookings = [];
        var shifts = result.shifts;
        var startDate = moment(shift.date, "YYYY-MM-DD");
        var lastDate = moment(untilDate, "YYYY-MM-DD");
        var shiftIndex = 0;
        while (
          (startDate.isBefore(lastDate) || startDate.isSame(lastDate)) &&
          shiftIndex !== shifts.length
        ) {
          // Find the next booking for this repeated shift
          var nextShiftDate = moment(shifts[shiftIndex].date, "YYYY-MM-DD");

          while (startDate.isBefore(nextShiftDate)) {
            // Increment with respect to the next
            startDate = getNextDate(startDate, type);
          }
          // If the booking increment is larger than shift increment
          // then get the shift that is either after or the same as the
          // booking
          while (
            shiftIndex !== shifts.length - 1 &&
            startDate.isAfter(nextShiftDate)
          ) {
            shiftIndex += 1;
            nextShiftDate = moment(shifts[shiftIndex].date, "YYYY-MM-DD");
          }

          if (startDate.isSame(nextShiftDate)) {
            var currentBookings = shifts[shiftIndex].bookings;
            var alreadyBooked = false;
            currentBookings.forEach(booking => {
              if (booking.volunteerId === volunteerId) {
                alreadyBooked = true;
              }
            });
            if (!alreadyBooked) {
              bookings.push({
                shiftId: shifts[shiftIndex].id,
                repeatedId: repeatedId,
                roleName: roleName,
                volunteerId: volunteerId
              });
            }
          }
          // Consider next shift
          shiftIndex += 1;
        }
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

  Booking.findAll({ include: [SHIFT()] })
    .then(bookings => deferred.resolve(bookings))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

BookingRepository.getByVolunteerId = function(volunteerId, whereShift) {
  var deferred = Q.defer();
  Booking.findAll({
    where: {
      volunteerId: volunteerId
    },
    include: [SHIFT(true, whereShift)]
  })
    .then(bookings => deferred.resolve(bookings))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

BookingRepository.delete = function(shiftId, volunteerId) {
  var deferred = Q.defer();

  Booking.destroy({
    where: {
      volunteerId: volunteerId,
      shiftId: shiftId
    }
  })
    .then(booking => deferred.resolve(booking))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

BookingRepository.getById = function(shiftId, volunteerId) {
  var deferred = Q.defer();

  Booking.findOne({
    where: {
      shiftId: shiftId,
      volunteerId: volunteerId
    },
    include: [SHIFT()]
  })
    .then(booking => deferred.resolve(booking))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

module.exports = BookingRepository;
