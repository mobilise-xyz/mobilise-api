const {Booking, RepeatedBooking} = require("../models");
const Q = require("q");
const BookingRepositoryInterface = require("./interfaces/bookingRepositoryInterface");
const { SHIFT } = require("../sequelizeUtils/include");

let BookingRepository = Object.create(BookingRepositoryInterface);

BookingRepository.add = function(shift, volunteerId, roleName) {
  let deferred = Q.defer();
  Booking.create({
    shiftId: shift.id,
    volunteerId: volunteerId,
    roleName: roleName
  })
    .then(booking => deferred.resolve(booking))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

BookingRepository.createRepeatedId = function(type, untilDate) {
  let deferred = Q.defer();

  RepeatedBooking.create({
    type: type,
    untilDate: untilDate
  })
    .then(repeated => deferred.resolve(repeated))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};


BookingRepository.addRepeated = async function(
  bookings
) {
  let deferred = Q.defer();
  Booking.bulkCreate(bookings)
    .then(bookings => deferred.resolve(bookings))
    .catch(err => deferred.reject(err));
  return deferred.promise;
};

BookingRepository.getAll = function() {
  let deferred = Q.defer();

  Booking.findAll()
    .then(bookings => deferred.resolve(bookings))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

BookingRepository.getAllWithShifts = function() {
  let deferred = Q.defer();

  Booking.findAll({ include: [SHIFT()] })
    .then(bookings => deferred.resolve(bookings))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

BookingRepository.getByVolunteerId = function(volunteerId, whereShift) {
  let deferred = Q.defer();
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
  let deferred = Q.defer();

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
  let deferred = Q.defer();

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
