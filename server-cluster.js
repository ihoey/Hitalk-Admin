/*
 * @Author: ihoey
 * @Date: 2018-04-27 10:51:30
 * @Last Modified by:   ihoey
 * @Last Modified time: 2018-04-27 10:51:30
 */

const cluster = require('cluster')

// 进程数量建议设置为可用的 CPU 数量
const workers = process.env.LEANCLOUD_AVAILABLE_CPUS || 1

if (cluster.isMaster) {
  for (var i = 0; i < workers; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log('worker %s died, restarting...', worker.process.pid)
    cluster.fork()
  })
} else {
  require('./server.js')
}
