const {Metric} = require("../models");
const MetricRepositoryInterface = require("./interfaces/metricRepositoryInterface");

let MetricRepository = Object.create(MetricRepositoryInterface);

MetricRepository.set = function(name, verb, value) {
  return Metric.destroy({ truncate: true })
    .then(() => {
      return Metric.create({ name: name, verb: verb, value: value });
    });
};

MetricRepository.get = function() {
  return Metric.findOne();
};

module.exports = MetricRepository;
