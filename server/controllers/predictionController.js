const Predictor = require("../recommenderSystem").Predictor;

var PredictionController = function() {
  this.computeExpectedShortages = function(req, res) {
    if (
      process.env.COMPUTATION_TRIGGER_KEY != req.body.COMPUTATION_TRIGGER_KEY
    ) {
      res.status(401).send({ message: "Unauthorised request" });
    } else {
      Predictor.computeExpectedShortages();

      res.status(200).send({ message: "Computation Initiated Successfully" });
    }
  };
};

module.exports = new PredictionController();
