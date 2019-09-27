const metricRepository = require("../repositories").MetricRepository;
const {validationResult, body} = require('express-validator');
const {errorMessage} = require("../utils/error");

let MetricController = function(metricRepository) {

  this.update = async function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({message: "Invalid request", errors: errors.array()});
      return;
    }
    if (!req.user.isAdmin) {
      res.status(401).json({message: "Only admin can set the metric"});
      return;
    }
    await metricRepository.set(
      req.body.name,
      req.body.verb,
      req.body.value
    ).then(metric => res.status(200).json({message: "Successfully updated metric", metric}))
      .catch(err => res.status(500).send(errorMessage(err)));
  };

  this.get = async function(req, res) {
    await metricRepository.get()
      .then(metric => res.status(200).json({message: "Success!", metric}))
      .catch(err => res.status(500).send(errorMessage(err)));
  };

  this.validate = function(method) {
    switch (method) {
      case 'update': {
        return [
          body('name').isString(),
          body('verb').isString(),
          body('value').isInt()
        ]
      }
    }
  }

};

module.exports = new MetricController(metricRepository);
