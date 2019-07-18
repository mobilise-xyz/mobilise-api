/* eslint-disable no-unused-vars */
var ShiftRepositoryInterface = {
  add: function(shift, creatorId, rolesRequired, repeatedId) {},
  addRepeated: function(shift, creatorId, rolesRequired, type) {},
  update: function(shift, body) {},
  updateRoles: function(shift, rolesRequired) {},
  getAll: function(attributes, whereTrue, include) {},
  getById: function(id, include) {},
  removeById: function(id) {}
};

module.exports = ShiftRepositoryInterface;
