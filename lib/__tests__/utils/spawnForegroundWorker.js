const createWorker = require('../../createWorker')
const createMemoryStream = require('./createMemoryStream')

module.exports = function spawnForegroundWorker() {
  const { local, remote } = createMemoryStream();

  createWorker(remote);

  return local;
}