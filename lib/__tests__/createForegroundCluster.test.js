const divisus = require('../');
const path = require('path')
const { assert } = require('chai')
const withForegroundCluster = require('./utils/withForegroundCluster')

describe("divisus::createForegroundCluster", function() {
  it('creates a pool implicitly', withForegroundCluster({}, function(cluster, done) {
    done();
  }));

  it('can evaluate inline functions', withForegroundCluster({}, function(cluster, done) {
    const fn = divisus(cluster).asyncifiedFn(x => x + 1);

    fn(1, function(err, result) {
      if (err) {
        done(err);
      }
      else {
        assert.equal(result, 2);

        done();
      }
    });
  }));

  it('can evaluate function modules', withForegroundCluster({}, function(cluster, done) {
    const fn = divisus(cluster).asyncifiedFn(path.resolve(__dirname, './fixtures/increment.js'));

    fn(1, function(err, result) {
      if (err) {
        done(err);
      }
      else {
        assert.equal(result, 2);

        done();
      }
    });
  }));
});