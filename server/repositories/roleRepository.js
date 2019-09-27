const {Role} = require("../models");
const RoleRepositoryInterface = require("./interfaces/roleRepositoryInterface");

let RoleRepository = Object.create(RoleRepositoryInterface);

RoleRepository.add = function(role) {
  return Role.create({
    name: role.name,
    involves: role.involves,
    colour: role.colour
  });
};

RoleRepository.getByName = function(name) {
  return Role.findOne({ where: { name: name } });
};

RoleRepository.getAll = function() {
  return Role.findAll();
};

RoleRepository.removeByName = function(name) {
  return Role.destroy({ where: { name: name } });
};

module.exports = RoleRepository;
