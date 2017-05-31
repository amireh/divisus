const R = require('ramda');
const invariant = require('invariant');

// Utility function for applying a function and accepting a result in one of
// three ways:
//
// - a synchronous return, where only one value may be yielded
// - a multi-value yield using a generated `this.callback(...)` callback
// - a multi-value yield that is also asynchronous using `callback = this.async();`
//
// @done will always be called with {String|Error, ...} for an error and the
// yielded values.
//
// Example victims:
//
// 1. Synchronous, single-yield:
//
//     function() {
//       return 'hello!';
//     }
//
// 2. Synchronous, multi-yield:
//
//     function() {
//       this.callback(null, 'hello', 'world!');
//     }
//
// 3. Asynchronous, single-yield:
//
//     function() {
//       var callback = this.async();
//
//       setTimeout(function() {
//         callback(null, 'hello');
//       }, 1000);
//     }
//
// 4. Asynchronous, multi-yield:
//
//     function() {
//       var callback = this.async();
//
//       setTimeout(function() {
//         callback(null, 'hello', 'world!');
//       }, 1000);
//     }
const applySyncOrAsync = fn => (args, done) => {
  let expectSynchronousResponse = fn.length === 0 || typeof R.last(args) !== 'function';

  const context = {};
  const propagate = function(err, result) {
    expectSynchronousResponse = false;

    done(err, result);
  };

  // sync/async this.callback() style
  context.callback = fnOncePedantic(function() {
    expectSynchronousResponse = false;

    done.apply(null, arguments);
  }, "this.callback(): The callback was already called.");

  context.async = fnOncePedantic(function() {
    expectSynchronousResponse = false;

    return done;
  }, "this.async(): The callback was already called.");

  try {
    // synchronus return style
    const result = fn.apply(context, args.concat(propagate));

    if (expectSynchronousResponse) {
      if (result !== undefined) {
        done(null, result);
      }
      else {
        done();
      }
    }
  }
  catch(e) { // abort the chain
    done(e);
  }
}

function fnOncePedantic(fn, errorMessage) {
  var called = false;

  return function() {
    invariant(!called, errorMessage);

    called = true;
    return fn.apply(null, arguments);
  }
}

module.exports = applySyncOrAsync;