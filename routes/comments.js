/*
 * @Author: ihoey 
 * @Date: 2018-04-27 10:55:43 
 * @Last Modified by: ihoey
 * @Last Modified time: 2018-04-27 11:28:45
 */

const router = require('express').Router();
const AV = require('leanengine');
const mail = require('../utilities/send-mail');
const config = require('../config');
const Comment = AV.Object.extend('Comment');

// Comment 列表
router.get('/', (req, res, next) => {
    if (req.currentUser) {
        let query = new AV.Query(Comment);
        query.descending('createdAt');
        query.limit(50);
        query.find().then(results => {
            res.render('comments', {
                title: config.SITE_NAME + '上的评论',
                domain: config.SITE_URL,
                comment_list: results
            });
        }, err => {
            if (err.code === 101) {
                res.render('comments', {
                    title: config.SITE_NAME + '上的评论',
                    domain: config.SITE_URL,
                    comment_list: []
                });
            } else {
                next(err);
            }
        }).catch(next);
    } else {
        res.redirect('/login');
    }
});

router.get('/resend-email', (req, res, next) => {
    if (req.currentUser) {
        let query = new AV.Query(Comment);
        query.get(req.query.id).then(object => {
            query.get(object.get('rid')).then(parent => {
                if (parent.get('mail')) {
                    mail.send(object, parent);
                    res.redirect('/comments')                    
                    console.log("这条评论 @ 了其他人, 已提醒至对方邮箱:" + parent.get('mail'));
                } else {
                    console.log("这条 @ 了其他人， 但被 @ 的人没留邮箱... 无法通知");
                }
            }).catch(next);
        }).catch(next);
    } else {
        res.redirect('/');
    }
});

router.get('/delete', (req, res, next) => {
    if (req.currentUser) {
        let query = new AV.Query(Comment);
        query.get(req.query.id).then(object => {
            object.destroy();
            res.redirect('/comments')
        }).catch(next);
    } else {
        res.redirect('/');
    }
});

module.exports = router;
