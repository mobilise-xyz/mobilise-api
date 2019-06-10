var BookingRepositoryInterface = {
  getById: function(shiftId, volunteerId) {},
  getAll: function() {},
  add: function(shift, volunteerId, roleName) {},
  getByVolunteerId: function(volunteerId) {},
  delete: function(volunteerId, shiftId) {},
  addRepeated: function(shift, volunteerId, roleName, type, untilDate) {}
};

module.exports = BookingRepositoryInterface;
