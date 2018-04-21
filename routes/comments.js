'use strict';
const router = require('express').Router();
const AV = require('leanengine');
const mail = require('../utilities/send-mail');
const config = require('../config');

const Comment = AV.Object.extend('Comment');

// Comment 列表
router.get('/', function (req, res, next) {
    if (req.currentUser) {
        let query = new AV.Query(Comment);
        query.descending('createdAt');
        query.limit(50);
        query.find().then(function (results) {
            res.render('comments', {
                title: config.SITE_NAME + '上的评论',
                comment_list: results
            });
        }, function (err) {
            if (err.code === 101) {
                res.render('comments', {
                    title: config.SITE_NAME + '上的评论',
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

router.get('/resend-email', function (req, res, next) {
    if (req.currentUser) {
    let query = new AV.Query(Comment);
    query.get(req.query.id).then(function (object) {
        query.get(object.get('rid')).then(function (parent) {
                mail.send(object, parent);
                res.redirect('/comments')
            }, function (err) {
            }
        ).catch(next);
    }, function (err) {
    }).catch(next);
    } else {
        res.redirect('/');
    }
});

router.get('/delete', function (req, res, next) {
    if (req.currentUser) {
        let query = new AV.Query(Comment);
        query.get(req.query.id).then(function (object) {
            object.destroy();
            res.redirect('/comments')
        }, function (err) {
        }).catch(next);
    } else {
        res.redirect('/');
    }
});

module.exports = router;
