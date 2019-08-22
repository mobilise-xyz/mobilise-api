const {Contact} = require("../models");
const Q = require("q");
const ContactRepositoryInterface = require("./interfaces/contactRepositoryInterface");

let ContactRepository = Object.create(
  ContactRepositoryInterface
);

ContactRepository.add = function (volunteerId, contact) {
  let deferred = Q.defer();

  Contact.create({
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    telephone: contact.telephone,
    relation: contact.relation,
    volunteerId: volunteerId
  })
    .then(contact => deferred.resolve(contact))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

ContactRepository.getAllByVolunteerId = function (volunteerId) {
  let deferred = Q.defer();
  Contact.findAll({
    where: {
      volunteerId: volunteerId
    }
  })
    .then(contacts => deferred.resolve(contacts))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

module.exports = ContactRepository;
