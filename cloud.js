/*
 * @Author: ihoey
 * @Date: 2018-04-27 10:51:51
 * @Last Modified by: ihoey
 * @Last Modified time: 2018-04-30 01:46:53
 */

const AV = require('leanengine')
const mail = require('./utils/send-mail')

AV.Cloud.afterSave('Comment', request => {
  let currentComment = request.object

  // 发送博主通知邮件
  mail.notice(currentComment)
  console.log('收到一条评论, 已提醒站长')

  // AT评论通知
  // 获取评论内容
  var comm = currentComment.get('comment')
  // 从评论内容中提取出a标签的href属性值
  var h = comm.match(/<a.*?href?\s*=\s*[\'|\"]+?(.*?)[\'|\"]+?/i)
  if (!h) {
    console.log('这条评论没有 @ 任何人，结束!')
    return
  }
  // 替换掉#号，即为rid。
  let rid = h[1].replace(/#/, '')
  // 将rid存入数据库，以供管理页面使用。
  currentComment.set('rid', rid)
  let query = new AV.Query('Comment')
  query.get(rid).then(
    parentComment => {
      if (parentComment.get('mail')) {
        mail.send(currentComment, parentComment)
        console.log('这条评论 @ 了其他人, 已提醒至对方邮箱:' + parentComment.get('mail'))
      } else {
        console.log('这条 @ 了其他人， 但被 @ 的人没留邮箱... 无法通知')
      }
    },
    error => {
      console.warn('好像 @ 了一个不存在的人!')
    },
  )
})

AV.Cloud.define('Sleep_Preventer', request => {
  console.log('启动定时函数', new Date(Date.now() + 8 * 60 * 60 * 1000).toUTCString())
})

AV.Cloud.beforeSave('Comment', request => {
  console.log('收到一条评论, 开始检查数据有效性')
  var comment = request.object.get('comment')
  var nick = request.object.get('nick')
  var mail = request.object.get('mail')
  var link = request.object.get('link')
  if (comment && nick && mail && link) {
    if (comment.length > 1000 || nick.length > 20 || mail.length > 50 || link.length > 50) {
      console.log('数据有误, 将被拒绝')
      // 截断并添加 '…'
      // request.object.set('comment', comment.substring(0, 140) + '…');
      throw new AV.Cloud.Error('data is too big!')
    }
  } else {
    // 不保存数据，并返回错误
    throw new AV.Cloud.Error('No comment provided!')
  }
})
