const worker = require('./workerThreads');

worker(100000000).then(console.log);
