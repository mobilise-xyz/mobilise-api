const Predictor = require('../recommenderSystem').Predictor;

var RecommendedController = function(Predictor) {

  this.Predictor = Predictor;

  this.getRecommendedShifts = function(req, res) {

    var map = Predictor.computeCurrentShiftRequirementsMap();

    res.status(200).send(map);
  }
}

module.exports = new RecommendedController(Predictor);