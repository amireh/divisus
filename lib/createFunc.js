const serializeFunc = require('./serializeFunc');

module.exports = function createFunc(cluster) {
  return function(f) {
    return function() {
      cluster.apply(serializeFunc(f), Array.prototype.slice.call(arguments));
    }
  }
}