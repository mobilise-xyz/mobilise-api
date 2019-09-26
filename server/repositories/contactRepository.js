const {Contact} = require("../models");
const Q = require("q");
const ContactRepositoryInterface = require("./interfaces/contactRepositoryInterface");

let ContactRepository = Object.create(
  ContactRepositoryInterface
);

ContactRepository.add = function (volunteerId, contact) {
  return Contact.create({
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
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
  let deferred = Q.defer();
  Contact.destroy({
    where: {
      id: id
    }
  })
    .then(result => deferred.resolve(result))
    .catch(err => deferred.reject(err));
};

module.exports = ContactRepository;
