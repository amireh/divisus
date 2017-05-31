const async = require('async');

const mochaJanitor = mochaSuite => {
  const callbacks = [];

  mochaSuite.afterEach(function(done) {
    const cleanups = callbacks.splice(0).map(x => x.length === 0 ? async.asyncify(x) : x);

    async.series(cleanups, done);
  })

  return {
    push: x => { callbacks.push(x) }
  }
};

module.exports = mochaJanitor;