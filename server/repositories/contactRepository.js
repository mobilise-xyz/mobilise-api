const {Contact} = require("../models");
const ContactRepositoryInterface = require("./interfaces/contactRepositoryInterface");

let ContactRepository = Object.create(
  ContactRepositoryInterface
);

ContactRepository.add = function (volunteerId, contact) {
  return Contact.create({
    firstName: contact.firstName,
    lastName: contact.lastName,
    telephone: contact.telephone,
    relation: contact.relation,
    volunteerId: volunteerId
  });
};

ContactRepository.getAllByVolunteerId = function (volunteerId) {
  return Contact.findAll({
    where: {
      volunteerId: volunteerId
    }
  });
};

ContactRepository.getById = function (id) {
  return Contact.findOne({
    where: {
      id: id
    }
  });
};

ContactRepository.removeById = function(id) {
  return Contact.destroy({
    where: {
      id: id
    }
  });
};

module.exports = ContactRepository;
