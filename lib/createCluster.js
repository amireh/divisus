const R = require('ramda');
const async = require('async');
const invariant = require('invariant');
const createRoundRobinPool = require('./createRoundRobinPool');
const createWorkerThread = require('./createWorkerThread')
const m = require('./messages')

module.exports = function createCluster({ size, pool: customPool }) {
  const pool = customPool || R.times(createWorkerThread, size);
  const draw = createRoundRobinPool(pool);

  return {
    start(callback) {
      invariant(typeof callback === 'function',
        "A callback must be passed to createCluster#start"
      );

      async.parallel(
        pool.filter(x => !x.isOpen()).map(x => x.open),
        callback
      );
    },

    apply(fn, args) {
      const withoutCallback = R.init(args);
      const callback = R.last(args);

      m.apply(draw())(fn, withoutCallback, function(err, result) {
        callback(err, result);
      })
    },

    stop(callback) {
      invariant(typeof callback === 'function',
        "A callback must be passed to createCluster#stop"
      );

      async.parallel(
        pool.filter(x => x.isOpen()).map(x => async.reflect(x.close)),
        callback
      );
    }
  };
};