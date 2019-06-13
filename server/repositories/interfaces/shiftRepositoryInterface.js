var ShiftRepositoryInterface = {
  add: function(shift, creatorId, rolesRequired, repeatedId) {},
  addRepeated: function(shift, creatorId, rolesRequired, type) {},
  update: function(shift, body) {},
  updateRoles: function(shift, rolesRequired) {},
  getAllWithRequirements: function(whereTrue, withVolunteers = false) {},
  getAll: function(attributes) {},
  getById: function(id, include) {},
  removeById: function(id) {}
};

module.exports = ShiftRepositoryInterface;
