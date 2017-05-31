const path = require('path');
const R = require('ramda');
const invariant = require('invariant');
const { fork } = require('child_process');
const createIdGenerator = require('./createIdGenerator');
const m = require('./messages');
const ifElse = require('./ifElse');
const WORKER_BIN = path.resolve(__dirname, 'spawnWorker.js');
const SPAWN_ARGS = [ WORKER_BIN, [], {
  // Do not pass through any arguments that were passed to the main process
  execArgv: []
}];

const spawnWithFork = (bin, args, options) => fork(bin, args, options);
const fail = message => () => invariant(false, message);
const forward = f => x => R.tap(f)(x)

/**
 * @param {Object} options
 * @param {Function} options.spawnFn
 */
function createWorkerThread({ spawnFn = spawnWithFork }) {
  let fd;

  const queue = {}
  const generateMessageId = createIdGenerator()
  const isOpen = () => !!fd
  const whenOpen = f => ifElse(isOpen, f, fail('Thread must be open.'))
  const whenClosed = f => ifElse(R.complement(isOpen), f, fail('Thread is already open.'))
  const discardDescriptor = forward(() => fd = null)
  const deliverResponse = message => {
    invariant(typeof queue[message.id] === 'function',
      `Thread: Unable to route message "${message.id}" to any handler.`
    );

    queue[message.id].apply(null, message.data);

    delete queue[message.id];
  }

  const open = _callback => {
    const callback = R.once(_callback)
    const emitReady = R.nAry(0)(callback);
    const emitFailed = R.unary(callback);
    const emitReadyOrDeliverResponse = R.ifElse(m.isReadyMessage, emitReady, deliverResponse);

    fd = R.apply(spawnFn, SPAWN_ARGS);
    fd.on('error', R.pipe(discardDescriptor, emitFailed));
    fd.on('exit', discardDescriptor);
    fd.on('message', emitReadyOrDeliverResponse);
  }

  const send = (name, data, callback) => {
    const messageId = generateMessageId();

    queue[messageId] = callback;

    fd.send({ id: messageId, name, data });
  }

  const close = callback => {
    fd.kill('SIGTERM');
    fd.disconnect();

    discardDescriptor();

    callback();
  }

  return {
    open: whenClosed(open),
    isOpen,
    send: whenOpen(send),
    close: whenOpen(close),
  }
}

module.exports = createWorkerThread;
