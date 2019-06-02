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
          include: [
            {
              model: Booking,
              as: "bookings",
              required: false,
              where: {
                volunteerId: volunteerId
              }
            }
          ],
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
          (startDate.isBefore(lastDate) || startDate.isSame(lastDate)) &&
          shiftIndex != shifts.length
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
            shiftIndex != shifts.length - 1 &&
            startDate.isAfter(nextShiftDate)
          ) {
            shiftIndex += 1;
            nextShiftDate = moment(shifts[shiftIndex].date, "YYYY-MM-DD");
          }

          if (startDate.isSame(nextShiftDate)) {
            // The bookings in the shift are only ones with the volunteer
            // id so therefore if the length is not 0, then the volunteer
            // has a booking for this shift. So skip over it.
            if (shifts[shiftIndex].bookings.length == 0) {
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
