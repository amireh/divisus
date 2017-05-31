const R = require('ramda')
const createCluster = require('../../createCluster');
const createWorkerThread = require('../../createWorkerThread')
const spawnForegroundWorker = require('./spawnForegroundWorker')

const createPool = (size = 2) => (
  R.times(
    R.partial(createWorkerThread, [{
      spawnFn: spawnForegroundWorker
    }])
  , size)
);

const withCluster = R.curry(function(options, fn) {
  return function(done) {
    const mochaContext = this;
    const cluster = createCluster(Object.assign({}, options, {
      pool: options.hasOwnProperty('pool') ? options.pool : createPool(options.size || 2)
    }));

    cluster.start(function(err) {
      if (err) {
        done(err);
      }
      else {
        try {
          fn.call(mochaContext, cluster, function(err, result) {
            cluster.stop(function() {
              done(err, result);
            })
          })
        }
        catch (e) {
          cluster.stop(function() {
            done(e);
          })
        }
      }
    })
  }
})

module.exports = withCluster;