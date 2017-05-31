const serializeFunc = require('./serializeFunc');

module.exports = function createAsyncifiedFunc(cluster) {
  return function(f) {
    return function() {
      cluster.apply(serializeFunc.asyncified(f), Array.prototype.slice.call(arguments));
    }
  }
}