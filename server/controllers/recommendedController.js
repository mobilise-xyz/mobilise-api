const Predictor = require('../recommenderSystem').Predictor;

var RecommendedController = function(Predictor) {

  this.Predictor = Predictor;

  this.getRecommendedShifts = function(req, res) {

    res.send(200);
  }

  this.computeRecommendedShifts = function(req, res) {
    
  }
}

module.exports = new RecommendedController(Predictor);