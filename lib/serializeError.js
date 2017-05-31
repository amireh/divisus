const serializeErrorFrd = require('serialize-error');

module.exports = function serializeError(error) {
  if (typeof error === 'string') {
    return error;
  }

  return JSON.stringify(serializeErrorFrd(error));
};