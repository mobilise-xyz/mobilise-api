const {Booking, RepeatedBooking} = require("../models");
const BookingRepositoryInterface = require("./interfaces/bookingRepositoryInterface");
const { SHIFT } = require("../sequelizeUtils/include");

let BookingRepository = Object.create(BookingRepositoryInterface);

BookingRepository.add = function(shift, volunteerId, roleName) {
  return Booking.create({
    shiftId: shift.id,
    volunteerId: volunteerId,
    roleName: roleName
  });
};

BookingRepository.createRepeatedId = function(type, untilDate) {
  return RepeatedBooking.create({
    type: type,
    untilDate: untilDate
  });
};


BookingRepository.addRepeated = async function(
  bookings
) {
  return Booking.bulkCreate(bookings);
};

BookingRepository.getAll = function() {
  return Booking.findAll();
};

BookingRepository.getAllWithShifts = function() {
  return Booking.findAll({ include: [SHIFT()] });
};

BookingRepository.getByVolunteerId = function(volunteerId, whereShift) {
  return Booking.findAll({
    where: {
      volunteerId: volunteerId
    },
    include: [SHIFT(true, whereShift)]
  });
};

BookingRepository.delete = function(shiftId, volunteerId) {
  return Booking.destroy({
    where: {
      volunteerId: volunteerId,
      shiftId: shiftId
    }
  });
};

BookingRepository.getById = function(shiftId, volunteerId) {
  return Booking.findOne({
    where: {
      shiftId: shiftId,
      volunteerId: volunteerId
    },
    include: [SHIFT()]
  });
};

module.exports = BookingRepository;
