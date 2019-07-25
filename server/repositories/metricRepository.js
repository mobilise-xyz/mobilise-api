const {Metric} = require("../models");
const Q = require("q");
const MetricRepositoryInterface = require("./interfaces/metricRepositoryInterface");

let MetricRepository = Object.create(MetricRepositoryInterface);

MetricRepository.set = function(name, verb, value) {
  let deferred = Q.defer();

  Metric.destroy({ truncate: true })
    .then(() => {
      return Metric.create({ name: name, verb: verb, value: value });
    })
    .then(metric => deferred.resolve(metric))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

MetricRepository.get = function() {
  let deferred = Q.defer();

  Metric.findOne()
    .then(metric => deferred.resolve(metric))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

module.exports = MetricRepository;
