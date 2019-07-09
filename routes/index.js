var express = require('express');
var router = express.Router();

var crypto = require('crypto');
var mysql = require('./../database');
var fs = require('fs');
var marked = require('marked');
var multiparty = require('multiparty');
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

var forestageHandler = require('./handler/forestageHandler.js');


/* GET home page. */
router.get('/', forestageHandler.index);
router.get('/main', forestageHandler.main);

router.get('/detail/:article_id', forestageHandler.detail);

router.get('/about', forestageHandler.about);

router.get('/ITShare', forestageHandler.ITShare);

router.get('/life', forestageHandler.life);

router.get('/album', forestageHandler.album);
router.get('/pictureList', forestageHandler.pictureList);

router.get('/time', forestageHandler.time);

router.get('/message', forestageHandler.message);

router.get('/userArticleList', forestageHandler.userArticleList);
router.get('/userAlbum', forestageHandler.userAlbum);
router.get('/userInfo', forestageHandler.userInfo);
router.get('/updateUser', forestageHandler.updateUser);
router.get('/updateUserPassword', forestageHandler.updateUserPassword);



router.get('/login', forestageHandler.login);
router.post('/doLogin', forestageHandler.doLogin);
router.post('/doRegister', forestageHandler.doRegister);
router.get('/addArticle', forestageHandler.addArticle);
router.post('/doAddArticle', forestageHandler.doAddArticle);
router.get('/updateArticle/:article_id', forestageHandler.updateArticle);
router.post('/doUpdateArticle/:article_id', forestageHandler.doUpdateArticle);
router.post('/doDeleteArticle', forestageHandler.doDeleteArticle);


router.get('/logout', forestageHandler.logout);


module.exports = router;
