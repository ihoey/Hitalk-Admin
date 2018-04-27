/*
 * @Author: ihoey 
 * @Date: 2018-04-27 10:51:51 
 * @Last Modified by:   ihoey 
 * @Last Modified time: 2018-04-27 10:51:51 
 */

const AV = require('leanengine');
const mail = require('./utilities/send-mail');

AV.Cloud.afterSave('Comment', request => {
    let currentComment = request.object;

    // 发送博主通知邮件
    mail.notice(currentComment);
    console.log("收到一条评论, 已提醒站长");

    // AT评论通知
    // 获取评论内容
    var comm = currentComment.get('comment');
    // 从评论内容中提取出a标签的href属性值
    var h = comm.match(/<a.*?href?\s*=\s*[\'|\"]+?(.*?)[\'|\"]+?/i);
    if (!h) {
        console.log('这条评论没有 @ 任何人，结束!');
        return;
    }
    // 替换掉#号，即为rid。
    let rid = h[1].replace(/#/, "");
    // 将rid存入数据库，以供管理页面使用。
    currentComment.set('rid', rid);
    let query = new AV.Query('Comment');
    query.get(rid).then(parentComment => {
        if (parentComment.get('mail')) {
            mail.send(currentComment, parentComment);
            console.log("这条评论 @ 了其他人, 已提醒至对方邮箱:" + parentComment.get('mail'));
        } else {
            console.log("这条 @ 了其他人， 但被 @ 的人没留邮箱... 无法通知");
        }
    }, error => {
        console.warn('好像 @ 了一个不存在的人!');
    });
});
