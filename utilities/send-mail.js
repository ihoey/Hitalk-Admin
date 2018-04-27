/*
 * @Author: ihoey 
 * @Date: 2018-04-27 10:55:18 
 * @Last Modified by: ihoey
 * @Last Modified time: 2018-04-27 12:00:20
 */

const config = require('../config');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: parseInt(config.SMTP_PORT),
    secure: true,
    auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS
    }
});

console.log(config);

exports.notice = (comment) => {
    let emailSubject = '👉 咚！「' + config.SITE_NAME + '」上有新评论了';
    let emailContent = '<div style="background-color:white;border-top:2px solid #12ADDB;box-shadow:0 1px 3px #AAAAAA;line-height:180%;padding:0 15px 12px;width:500px;margin:50px auto;color:#555555;font-family:\'Century Gothic\',\'Trebuchet MS\',\'Hiragino Sans GB\',微软雅黑,\'Microsoft Yahei\',Tahoma,Helvetica,Arial,\'SimSun\',sans-serif;font-size:12px;">  \n' +
        '    <h2 style="border-bottom:1px solid #DDD;font-size:14px;font-weight:normal;padding:13px 0 10px 8px;"><span style="color: #12ADDB;font-weight: bold;">&gt; </span>「' +
        config.SITE_NAME +
        '」上有一条新评论，内容如下：<div style="padding:0 12px 0 12px;margin-top:18px"><p><strong>' +
        comment.get('nick') +
        '</strong>&nbsp;回复说：</p><div style="background-color: #f5f5f5;padding: 10px 15px;margin:18px 0;word-wrap:break-word;">' +
        comment.get('comment') +
        '</div><p><a style="text-decoration:none; color:#12addb" href="' +
        config.SITE_URL +
        comment.get('url') +
        '#comments" target="_blank">点击前往查看</a></p>  \n' +
        '    </div>  \n' +
        '</div>';

    let mailOptions = {
        from: '"' + config.SENDER_NAME + '" <' + config.SENDER_EMAIL + '>',
        to: config.SENDER_EMAIL,
        subject: emailSubject,
        html: emailContent
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('通知邮件发送成功！');
    });
}

exports.send = (currentComment, parentComment) => {
    let emailSubject = '👉 叮咚！「' + config.SITE_NAME + '」上有人@了你';
    let emailContent = '<div style="border-top:2px solid #12ADDB;box-shadow:0 1px 3px #AAAAAA;line-height:180%;padding:0 15px 12px;width:500px;margin:50px auto;font-size:12px;">  \n' +
        '    <h2 style="border-bottom:1px solid #DDD;font-size:14px;font-weight:normal;padding:13px 0 10px 8px;"><span style="color: #12ADDB;font-weight: bold;">&gt; \n' +
        '    </span>您(' +
        parentComment.get('nick') +
        ')在<a style="text-decoration:none;color: #12ADDB;" href="' + config.SITE_URL + currentComment.get('url') + '" target="_blank">《' + config.SITE_NAME + '》</a>上的评论有了新的回复</h2> ' +
        '你的评论' +
        '<div style="padding:0 12px 0 12px;margin-top:18px"><p>你的评论：</p><div style="background-color: #f5f5f5;padding: 10px 15px;margin:18px 0;word-wrap:break-word;">' +
        parentComment.get('comment') +
        '</div><p><strong>' +
        currentComment.get('nick') +
        '</strong>&nbsp;回复说：</p><div style="background-color: #f5f5f5;padding: 10px 15px;margin:18px 0;word-wrap:break-word;">' +
        currentComment.get('comment') +
        '</div>' +
        '<p>您可以点击 <a style="text-decoration:none; color:#12addb" href="' +
        config.SITE_URL + currentComment.get('url') +
        '#comments" target="_blank">查看回复的完整內容 </a>，欢迎再次光临 <a style="text-decoration:none; color:#12addb" href="' + config.SITE_URL + '" target="_blank">' + config.SITE_NAME + '</a>。<br>本邮件为系统自动发送，请勿直接回复。</p>  \n' +
        '    </div>  \n' +
        '</div>';

    let mailOptions = {
        from: '"' + config.SENDER_NAME + '" <' + config.SENDER_EMAIL + '>', // sender address
        to: parentComment.get('mail'),
        subject: emailSubject,
        html: emailContent
    };
    console.log(mailOptions);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('邮件 %s 成功发送: %s', info.messageId, info.response);
        currentComment.set('isNotified', true);
        currentComment.save();
    });
};
