var ShiftRepositoryInterface = {
  add: function(shift, creatorId, rolesRequired, repeatedId) {},
  addRepeated: function(shift, creatorId, rolesRequired, type) {},
  getAllWithRoles: function() {},
  getAll: function(attributes) {},
  getById: function(id) {},
  removeById: function(id) {}
};

module.exports = ShiftRepositoryInterface;
