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

ContactRepository.getById = function (id) {
  let deferred = Q.defer();
  Contact.findOne({
    where: {
      id: id
    }
  })
    .then(contact => deferred.resolve(contact))
    .catch(err => deferred.reject(err));

  return deferred.promise;
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
