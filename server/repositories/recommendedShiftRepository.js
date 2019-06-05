// const RecommendedShift = require("../models").RecommendedShift;
// const RecommendedShiftRepositoryInterface = require("./interfaces/recommendedShiftRepositoryInterface");
// const Q = require("q");
// const sequelize = require('sequelize');

// var RecommendedShiftRepository = Object.create(
//   RecommendedShiftRepositoryInterface
// );

// RecommendedShiftRepository.destroy = function() {
//   var deferred = Q.defer();

//   RecommendedShift.destroy({
//     where: {},
//     truncate: true
//   })
//     .then(result => deferred.resolve(result))
//     .catch(error => deferred.reject(error));

//   return deferred.promise;
// };

// RecommendedShiftRepository.add = function(shiftId, roleName, expectedShortage) {
//   var deferred = Q.defer();

//   RecommendedShift.create({
//     shiftId: shiftId,
//     roleName: roleName,
//     expectedShortage: expectedShortage
//   })
//     .then(result => deferred.resolve(result))
//     .catch(error => deferred.reject(error));

//   return deferred.promise;
// };

// RecommendedShiftRepository.getAll = function() {
//   var deferred = Q.defer();

//   RecommendedShift
//     .findAll({
//       group: ["shiftId"],
//       attributes: [
//         "shiftId",
//         [
//           sequelize.fn(
//             'json_agg', 
//             sequelize.fn(
//               'json_build_object',
//               'name',
//               sequelize.col('roleName'),
//               'expectedShortage',
//               sequelize.col('expectedShortage')
//             )
//           ),
//           'roles'
//         ],
//         [sequelize.fn('max', sequelize.col('expectedShortage')), 'maxExpectedShortage']
//       ],
//       order: [[sequelize.fn('max', sequelize.col('expectedShortage')), 'desc']]
//     })
//     .then(result => deferred.resolve(result))
//     .catch(error => deferred.reject(error));

//   return deferred.promise;
// };

// RecommendedShiftRepository.addAll = function(recommendations) {
//   var deferred = Q.defer();

//   RecommendedShift.bulkCreate(recommendations)
//     .then(result => deferred.resolve(result))
//     .catch(error => deferred.reject(error));

//   return deferred.promise;
// };

// module.exports = RecommendedShiftRepository;