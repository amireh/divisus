const R = require('ramda');
const m = require('./messages');
const deserializeFunc = require('./deserializeFunc');

const handlers = {
  APPLY({ fn, args }, done) {
    R.apply(deserializeFunc(fn), args.concat(curryResponse(done)))
  }
};

const handleMessage = stream => R.pipe(
  x => Array.of(x),
  R.filter(x => handlers.hasOwnProperty(x.name)),
  R.map(x => handlers[x.name](x.data, m.applyResponse(stream, x)))
);

const curryResponse = done => (err, result) => done(err, result);

module.exports = function createWorker(stream) {
  stream.on('message', handleMessage(stream));
  m.ready(stream);
};

module.exports.handlers = handlers;