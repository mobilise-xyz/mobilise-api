var ShiftRepositoryInterface = {
    add: function(shift, creatorId, rolesRequired, repeatedId) {},
    addRepeated: function(shift, creatorId, rolesRequired, type){},
    getAllWithRoles: function() {},
    getAll: function(attributes) {},
    getById: function(id){},
    removeById: function(id) {},
    bookRole: function(shiftId, volunteerId, roleName){},
    getBookingById: function(shiftId, volunteerId){}
}

module.exports = ShiftRepositoryInterface;