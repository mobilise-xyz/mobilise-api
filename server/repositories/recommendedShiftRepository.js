const RecommendedShift = require("../models").RecommendedShift;
const RecommendedShiftRepositoryInterface = require("./interfaces/recommendedShiftRepositoryInterface");
const Q = require("q");

var RecommendedShiftRepository = Object.create(
  RecommendedShiftRepositoryInterface
);

RecommendedShiftRepository.destroy = function() {
  var deferred = Q.defer();

  RecommendedShift.destroy()
    .then(result => deferred.resolve(result))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

RecommendedShiftRepository.add = function(shiftId, roleName, expectedShortage) {
  var deferred = Q.defer();

  RecommendedShift.create({
    shiftId: shiftId,
    roleName: roleName,
    expectedShortage: expectedShortage
  })
    .then(result => deferred.resolve(result))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

RecommendedShiftRepository.getAll = function() {
  var deferred = Q.defer();
  RecommendedShift.findAll({
    include: ["shift"]
  })
    .then(shifts => {
      deferred.resolve(shifts);
    })
    .catch(err => {
      deferred.reject(err);
    });
  return deferred.promise;
};

module.exports = RecommendedShiftRepository;
