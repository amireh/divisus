const async = require('async');
const defer = async.nextTick;
const createCallbacks = () => ({
  error: [],
  message: [],
  exit: [],
})

module.exports = function createMemoryStream() {
  const localCallbacks = createCallbacks();
  const remoteCallbacks = createCallbacks();

  return {
    remote: {
      on(event, callback) {
        remoteCallbacks[event].push(callback);
      },

      send(payload) {
        defer(() => {
          localCallbacks['message'].forEach(f => f(payload));
        });
      },
    },

    local: {
      on(event, callback) {
        localCallbacks[event].push(callback);
      },

      emit(event, message) {
        localCallbacks[event].forEach(x => x(message));
      },

      send(payload) {
        defer(() => {
          remoteCallbacks['message'].forEach(f => f(payload));
        });
      },

      kill() {
        Object.keys(localCallbacks).forEach(key => {
          localCallbacks[key].splice(0);
        });

        Object.keys(remoteCallbacks).forEach(key => {
          remoteCallbacks[key].splice(0);
        });
      },

      disconnect() {},
    }
  };
}
