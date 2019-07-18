const Predictor = require("../recommenderSystem").Predictor;

var PredictionController = function () {
  this.computeExpectedShortages = function (req, res) {
    if (process.env.COMPUTATION_TRIGGER_KEY !== req.body.key) {
      res.status(401).json({ message: "Unauthorised request" });
    } else {
      Predictor.computeExpectedShortages();
      res.status(200).json({ message: "Computation Successful" });
    }
  };
};

module.exports = new PredictionController();
