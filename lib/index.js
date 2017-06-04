const createFunc = require('./createFunc');
const createAsyncifiedFunc = require('./createAsyncifiedFunc');

function divisus(cluster) {
  return {
    fn: createFunc(cluster),
    asyncifiedFn: createAsyncifiedFunc(cluster),
  }
}

module.exports = divisus;
module.exports.createCluster = require('./createCluster');
module.exports.createForegroundCluster = require('./createForegroundCluster');
module.exports.serializeError = require('./serializeError');
module.exports.deserializeError = require('./deserializeError');