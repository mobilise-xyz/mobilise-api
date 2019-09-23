const {body, validationResult} = require("express-validator");

const Predictor = require("../recommenderSystem").Predictor;

let PredictionController = function () {
  this.computeExpectedShortages = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({message: "Invalid request", errors: errors.array()});
    }
    if (process.env.COMPUTATION_TRIGGER_KEY !== req.body.key) {
      res.status(401).json({ message: "Unauthorised request" });
    } else {
      Predictor.computeExpectedShortages();
      res.status(200).json({ message: "Computation Triggered" });
    }
  };

  this.validate = function(method) {
    switch (method) {
      case 'computeExpectedShortages': {
        return [
          body('key').isString()
        ]
      }
    }
  }
};

module.exports = new PredictionController();
