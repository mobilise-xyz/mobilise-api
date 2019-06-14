const Predictor = require("../recommenderSystem").Predictor;

var PredictionController = function() {
  this.computeExpectedShortages = function(req, res) {
      Predictor.computeExpectedShortages().then(res => {
        res.status(200).send({ message: "Computation Successful" });
      });
    }
};

module.exports = new PredictionController();
