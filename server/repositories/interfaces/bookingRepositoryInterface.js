var BookingRepositoryInterface = {
  getById: function(shiftId, volunteerId) {},
  getAll: function() {},
  add: function(shift, volunteerId, roleName) {},
  getByVolunteerId: function(volunteerId) {},
  addRepeated: function(shift, volunteerId, roleName, type, untilDate) {}
};

module.exports = BookingRepositoryInterface;
