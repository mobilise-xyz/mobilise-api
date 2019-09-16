const {QuickLink} = require("../models");
const Q = require("q");
const LinkRepositoryInterface = require("./interfaces/linkRepositoryInterface");

let LinkRepository = Object.create(
  LinkRepositoryInterface
);

LinkRepository.add = function (quicklink) {
  let deferred = Q.defer();

  QuickLink.create({
    name: quicklink.name,
    url: quicklink.url
  })
    .then(quicklink => deferred.resolve(quicklink))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

LinkRepository.getAll = function () {
  let deferred = Q.defer();
  QuickLink.findAll()
    .then(quicklinks => deferred.resolve(quicklinks))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

LinkRepository.removeById = function(id) {
  let deferred = Q.defer();
  QuickLink.destroy({
    where: {
      id: id
    }
  })
    .then(result => deferred.resolve(result))
    .catch(err => deferred.reject(err));
};

module.exports = LinkRepository;

