/*
 * @Author: ihoey
 * @Date: 2018-04-27 10:51:18
 * @Last Modified by:   ihoey
 * @Last Modified time: 2018-04-27 10:51:18
 */

const AV = require('leanengine')
const app = require('./app')
// 端口一定要从环境变量 `LEANCLOUD_APP_PORT` 中获取。
// LeanEngine 运行时会分配端口并赋值到该变量。
const PORT = parseInt(process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3000)

AV.init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY,
})

// 如果不希望使用 masterKey 权限，可以将下面一行删除
AV.Cloud.useMasterKey()

app.listen(PORT, err => {
  console.log('Node app is running on port:', PORT)
  // 注册全局未捕获异常处理器
  process.on('uncaughtException', err => {
    console.error('Caught exception:', err.stack)
  })
  process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason.stack)
  })
})
