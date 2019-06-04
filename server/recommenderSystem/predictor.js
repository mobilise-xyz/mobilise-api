const Q = require("q");

const shiftRepository = require("../repositories").ShiftRepository;
const recommendedShiftRepository = require("../repositories")
  .RecommendedShiftRepository;

var Predictor = function(shiftRepository, recommendedShiftRepository) {
  this.shiftRepository = shiftRepository;
  this.recommendedShiftRepository = recommendedShiftRepository;

  this.computeRecommendedShifts = function() {
    var deferred = Q.defer();
    // Remove old entries in Recommended Shifts Table
    var recommendations = [];
    recommendedShiftRepository
      .destroy()
      .then(_ => {
        return shiftRepository.getAllWithRequirements();
      })
      .then(shifts => {
        shifts.forEach(shift => {
          // Obtain the shift requirements
          var requirements = shift.requirements;
          // Construct Map of role name to number required
          requirements.forEach(requirement => {
            // Obtain the bookings made for the shift
            var bookings = requirement.bookings;
            recommendations.push({
              shiftId: shift.id,
              roleName: requirement.role.name,
              expectedShortage: requirement.numberRequired - bookings.length
            });
          });
        });
        return recommendedShiftRepository.addAll(recommendations);
      })
      .then(result => {
        deferred.resolve(result);
      })
      .catch(err => deferred.reject(err));
    return deferred.promise;
  };
};

module.exports = new Predictor(shiftRepository, recommendedShiftRepository);
