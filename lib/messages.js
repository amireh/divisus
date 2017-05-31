const { curry } = require('ramda');

exports.ready = curry(function ready(stream) {
  stream.send({ name: 'READY' });
});

exports.apply = curry(function apply(thread, fn, args, callback) {
  thread.send('APPLY', { fn, args }, callback);
})

exports.applyResponse = curry(function applyResponse(stream, message, err, result) {
  stream.send({ id: message.id, data: [ err, result ] })
})

exports.isReadyMessage = x => x.name === 'READY';