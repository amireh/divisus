const subject = require('../serializeFunc');
const { assert } = require('chai');

describe("divisus::serializeFunc", function() {
  context('given a string...', function() {
    it('yields an object with @path pointing to the string', function() {
      assert.deepEqual(subject('f.js'), { path: 'f.js' })
    })
  })

  context('given a function...', function() {
    it('yields an object with @source pointing to the source', function() {
      const f = function() {};

      assert.include(subject(f), { source: f.toString() })
    })

    it.skip('yields an object with @filename pointing to the filename of the caller module', function() {
      const f = function() {};

      assert.include(subject(f), { filename: __filename })
    })
  })

  context('given something else...', function() {
    it('whines', function() {
      assert.throws(function() {
        subject(null);
      }, "Don't know how to serialize functions of this type.");
    })
  })
});