const Predictor = require('../recommenderSystem').Predictor;

var PredictionController = function() {

    this.computeExpectedShortages = function(req, res) {

        Predictor.computeExpectedShortages();

        res.status(200).send({ message: "Computation Initiated Successfully" });

    }
};

module.exports = new PredictionController();