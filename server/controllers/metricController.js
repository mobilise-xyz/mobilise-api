const metricRepository = require("../repositories").MetricRepository;

var MetricController = function(metricRepository) {

  this.update = function(req, res) {
    if (!req.user.isAdmin) {
      res.status(400).json({message: "Only admin can set the metric"});
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
