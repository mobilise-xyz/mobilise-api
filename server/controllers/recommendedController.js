const Predictor = require('../recommenderSystem').Predictor;

var RecommendedController = function(Predictor) {

    this.Predictor = Predictor;

    this.getRecommendedShifts = function(req, res) {
        
    }
}

module.exports = RecommendedController(Predictor);