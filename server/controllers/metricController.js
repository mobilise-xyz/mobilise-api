const metricRepository = require("../repositories").MetricRepository;

let MetricController = function(metricRepository) {

  this.update = function(req, res) {
    if (!req.user.isAdmin) {
      res.status(400).json({message: "Only admin can set the metric"});
      return;
    }
    if (!req.body.name || !req.body.verb || !req.body.value) {
      res.status(400).json({message: "Please provide a name, verb and value"});
      return;
    }
    if (typeof(req.body.value) !== 'number') {
      res.status(400).json({message: "Value must be numeric"});
      return;
    }
    metricRepository.set(
      req.body.name,
      req.body.verb,
      req.body.value
    ).then(metric => res.status(200).json({message: "Successfully updated metric", metric}))
      .catch(err => res.status(500).send(err));
  };

  this.get = function(req, res) {
    metricRepository.get().then(metric => res.status(200).json({message: "Success!", metric}))
      .catch(err => res.status(500).send(err));
  }


};

module.exports = new MetricController(metricRepository);
