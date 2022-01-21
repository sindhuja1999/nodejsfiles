// @ts-check

/**
 * @typedef {Object} WorkerData
 * @property {number} howMany
 */

const {
  Worker, isMainThread, parentPort, workerData
} = require('worker_threads');

if (isMainThread) {
  /**
   * @param {number} howMany 
   */
  module.exports = function parseJSAsync(howMany) {
    return new Promise((resolve, reject) => {
      /**
       * @type {WorkerData}
       */
      const workerData = { howMany };

      const worker = new Worker(__filename, {
        workerData
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        } else {
          resolve();
        }
      });
    });
  };
} else {
  /**
   * @type {WorkerData}
   */
  const { howMany } = workerData;

  const sharedArrayBuffer = new SharedArrayBuffer(howMany * Uint32Array.BYTES_PER_ELEMENT);
  const results = new Uint32Array(sharedArrayBuffer);

  results[0] = 1;
  results[1] = 1;
  for (let i = 2; i < howMany; ++i) {
    results[i] = results[i - 1] + results[i - 2];
  }

  parentPort.postMessage(results);
}
