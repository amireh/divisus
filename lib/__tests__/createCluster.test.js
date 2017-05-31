const divisus = require("../");
const path = require('path')
const { assert } = require('chai')
const withCluster = require('./utils/withCluster')

describe("divisus::createCluster", function() {
  it('creates a pool implicitly', withCluster({ size: 3, pool: null }, function(cluster, done) {
    done();
  }));

  it('can evaluate inline functions', withCluster({ size: 1, pool: null }, function(cluster, done) {
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

  it('can evaluate function modules', withCluster({ size: 1, pool: null }, function(cluster, done) {
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