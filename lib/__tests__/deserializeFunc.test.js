const path = require('path');
const R = require('ramda');
const { assert } = require('chai');
const deserializeFunc = require('../deserializeFunc');
const serializeFunc = require('../serializeFunc');

describe("divisus::deserializeFunc", function() {
  const of = R.compose(deserializeFunc, serializeFunc)

  context('given a function...', function() {
    it('returns it as-is', function() {
      R.tap(x => assert.equal(deserializeFunc(x), x))(function() {})
    })
  });

  context('given a module path...', function() {
    it('loads the module and returns its primary export', function() {
      const f = of(path.resolve(__dirname, 'fixtures/increment.js'));

      assert.equal(typeof f, 'function')
      assert.equal(f.name, 'increment')
      assert.equal(f(1), 2)
    })
  })

  context('given an inline function...', function() {
    it('works', function() {
      const f = of(function() {})

      assert.equal(typeof f, 'function')
      assert.doesNotThrow(f)
    })

    it('works with lambda expressions', function() {
      const f = of(() => {})

      assert.equal(f.length, 0)
      assert.equal(f(), undefined)
    })

    it('maintains the function name, if any', function() {
      const f = of(function increment(x) { return x + 1 })

      assert.equal(f.name, 'increment')
    })

    it('passes arguments', function() {
      const f = of((x, y) => x + y)

      assert.equal(f.length, 2)
      assert.equal(f(1,1), 2)
    })

    it('returns the return value', function() {
      const f = of(() => 5)

      assert.equal(f(), 5)
    })

    it('passes arguments that are functions (callbacks)', function(done) {
      const f = of(callback => callback(null, 5))

      f((err, result) => {
        assert.equal(result, 5);
        done();
      })
    })

    it('allows partial application', function() {
      const f = of(function(x, y) { return x + y; }).bind(null, 1)

      assert.equal(f.length, 1)
      assert.equal(f(1), 2)
    })

    it('allows me to use "require"', function() {
      assert.doesNotThrow(of(function() { require('path'); }))
    })

    it('allows me to use higher-order functions', function() {
      const add = function(x, y) { return x + y }
      const f = R.partial(of(add), [ 1 ])

      assert.equal(f(1), 2);
    })
  })

  context('given something else...', function() {
    it('whines', function() {
      assert.throws(function() {
        deserializeFunc(5)
      }, "Don't know how to deserialize this function.")
    })
  });
});