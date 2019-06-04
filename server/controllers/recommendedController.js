const Predictor = require('../recommenderSystem').Predictor;

var RecommendedController = function(Predictor) {

  this.Predictor = Predictor;

  this.getRecommendedShifts = function(req, res) {

    res.status(200);
  }

  this.computeRecommendedShifts = function(req, res) {
    
    if (req.user.isAdmin) {
      Predictor.computeRecommendedShifts();
      res.status(200)
    } else {
      res.status(400).send({message: "Unauthorised"})
    }
  }
}

module.exports = new RecommendedController(Predictor);