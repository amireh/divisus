const { assert } = require('chai');
const subject = require('../serializeError');

describe('divisus::serializeError', function () {
  context('given a plain string...', function() {
    it('keeps it as it is', function() {
      const output = subject('message');

      assert.equal(typeof output, 'string');
      assert.equal(output, 'message');
    })
  })

  context('given an Error...', function() {
    let error, output;

    beforeEach(function() {
      error = new Error('message');
      error.file = 'test.js';

      output = subject(error);
    });

    it('serializes it as JSON', function () {
      assert.isString(output);
      assert.doesNotThrow(function() {
        JSON.parse(output);
      })
    });

    it('serializes @message', function() {
      assert.equal(JSON.parse(output).message, error.message);
    });

    it('serializes @stack', function() {
      assert.equal(JSON.parse(output).stack, error.stack);
    });

    it('serializes custom properties', function() {
      assert.equal(JSON.parse(output).file, error.file);
      assert.equal(JSON.parse(output).file, 'test.js');
    });
  });
});