const divisus = require('../');
const { assert } = require('chai');
const withCluster = require('./utils/withCluster')

describe("divisus::createFunc", function() {
  it('works given a cluster', withCluster({}, function(cluster, done) {
    const fn = divisus(cluster).fn(function(callback) {
      callback();
    })

    fn(done);
  }));

  it('supplies arguments', withCluster({}, function(cluster, done) {
    const fn = divisus(cluster).fn(function(x, callback) {
      callback(null, x + 1);
    })

    fn(1, function(err, result) {
      if (err) {
        done(err);
      }
      else {
        assert.equal(result, 2)
        done()
      }
    });
  }));

  it('allows me to use "require"', withCluster({}, function(cluster, done) {
    this.timeout(250);

    const fn = divisus(cluster).fn(function(x, callback) {
      const path = require('path');

      callback(null, path.resolve(__dirname));
    })

    fn(1, function(err, result) {
      if (err) {
        done(err);
      }
      else {
        assert.equal(typeof result, 'string')
        done()
      }
    });
  }));
});