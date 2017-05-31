const { assert } = require('chai');
const subject = require('../deserializeError');
const serializeError = require('../serializeError');
const R = require('ramda');

describe('divisus::deserializeError', function () {
  context('given a plain string...', function() {
    it('morphs into an Error with that string for a message', function() {
      const output = subject('message');

      assert.ok(output instanceof Error);
      assert.equal(output.message, 'message');
    })
  })

  context('given a JSON blob...', function() {
    let error, output;

    beforeEach(function() {
      error = new Error('My error message');
      error.customProp = 'something';

      output = subject(serializeError(error));
    })

    it('morphs it into an Error', function() {
      assert.ok(output instanceof Error);
    })

    it('deserializes @message', function() {
      assert.equal(output.message, error.message);
    })

    it('deserializes @stack', function() {
      assert.equal(output.stack, error.stack);
    })

    it('deserializes custom properties', function() {
      assert.equal(output.customProp, error.customProp);
      assert.equal(output.customProp, 'something');
    })
  });

  context('given something else...', function() {
    it('returns it as-is', function() {
      R.tap(x => assert.equal(subject(x), x))(new Error());
      R.tap(x => assert.equal(subject(x), x))(1);
      R.tap(x => assert.equal(subject(x), x))(null);
      R.tap(x => assert.equal(subject(x), x))(undefined);
    })
  })
});