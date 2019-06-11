const metricRepository = require("../repositories").MetricRepository;

var MetricController = function(metricRepository) {

  this.update = function(req, res) {
    if (!req.user.isAdmin) {
      res.status(400).send({message: "Only admin can set the metric"});
      return;
    }
    metricRepository.set(
      req.body.name,
      req.body.verb,
      req.body.value
    ).then(metric => res.status(200).send({message: "Successfully updated metric", metric: metric}))
      .catch(err => res.status(500).send(err));
  };

  this.get = function(req, res) {
    metricRepository.get().then(metric => res.status(200).send(metric))
      .catch(err => res.status(500).send(err));
  }


};

module.exports = new MetricController(metricRepository);
