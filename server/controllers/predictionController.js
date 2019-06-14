const Predictor = require("../recommenderSystem").Predictor;

var PredictionController = function() {
  this.computeExpectedShortages = function(req, res) {
    if (
      process.env.COMPUTATION_TRIGGER_KEY !== req.body.key
    ) {
      res.status(401).send({ message: "Unauthorised request" });
    } else {
      Predictor.computeExpectedShortages().then(res => {
        res.status(200).send({ message: "Computation Successful" });
      });
    }
  };
};

module.exports = new PredictionController();
