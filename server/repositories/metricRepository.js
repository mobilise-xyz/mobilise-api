const Metric = require("../models").Metric;
const Q = require('q');
const MetricRepositoryInterface = require('./interfaces/metricRepositoryInterface');

var MetricRepository = Object.create(MetricRepositoryInterface);

MetricRepository.set = function (name, verb, value) {
  var deferred = Q.defer();

  Metric
    .destroy({ truncate: true })
    .then(() => {
      return Metric.create({name: name, verb: verb, value: value})
    })
    .then(metric => deferred.resolve(metric))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

MetricRepository.get = function () {
  var deferred = Q.defer();

  Metric.findOne()
    .then(metric => deferred.resolve(metric))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

module.exports = MetricRepository;