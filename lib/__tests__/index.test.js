const divisus = require("../");
const { assert } = require('chai')
const withCluster = require('./utils/withCluster')

describe("divisus", function() {
  it('works', withCluster({ size: 1 }, function(cluster, done) {
    const fn = divisus(cluster).fn(function(callback) {
      callback();
    })

    fn(done);
  }));

  it('works with bound arguments', withCluster({ size: 1 }, function(cluster, done) {
    const fn = divisus(cluster).fn(function(x, callback) {
      callback(null, x + 1);
    }).bind(null, 1)

    fn(function(err, result) {
      if (err) {
        done(err);
      }
      else {
        assert.equal(result, 2);
        done();
      }
    })
  }));
});