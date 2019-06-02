const Booking = require("../models").Booking;
const Shift = require("../models").Shift;
const RepeatedShift = require("../models").RepeatedShift;
const Op = require("../models").Sequelize.Op;
const RepeatedBooking = require("../models").RepeatedBooking;
const Q = require("q");
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
          }
        }
      ]
    })
      .then(result => {
        var bookings = [];
        result.shifts.forEach(shift => {
          bookings.push({
            shiftId: shift.id,
            repeatedId: repeatedId,
            roleName: roleName,
            volunteerId: volunteerId
          });
        });
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
