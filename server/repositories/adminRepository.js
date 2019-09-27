const {Admin} = require("../models");
const AdminRepositoryInterface = require("./interfaces/adminRepositoryInterface");
const { USER } = require("../sequelizeUtils/include");
let AdminRepository = Object.create(AdminRepositoryInterface);

AdminRepository.add = function(admin) {
  return Admin.create({
    userId: admin.userId
  });
};

AdminRepository.getById = function(id) {
  return Admin.findOne({
    where: {
      userId: id
    },
    include: [USER()]
  });
};

module.exports = AdminRepository;
