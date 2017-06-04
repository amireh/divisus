const createCluster = require('./createCluster')
const createMemoryStream = require('./createMemoryStream')
const createWorker = require('./createWorker')
const createWorkerThread = require('./createWorkerThread')

module.exports = function createForegroundCluster() {
  return createCluster({
    pool: [
      createWorkerThread({
        spawnFn() {
          const { local, remote } = createMemoryStream();

          createWorker(remote);

          return local;
        }
      })
    ]
  })
};