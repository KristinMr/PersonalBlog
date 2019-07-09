var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mysql = require('./../database');
var fs = require('fs');
var markdown = require('markdown');
var marked = require('marked');
var backstageHandler = require('./handler/backstageHandler.js');



/* GET admin listing. */
router.get('/', backstageHandler.index);

router.get('/content', backstageHandler.content);

router.get('/login', backstageHandler.login);
// Login
router.post('/doLogin', backstageHandler.doLogin);

router.get('/aboutme', backstageHandler.myInfo);

router.get('/adminList', backstageHandler.adminList);

router.get('/adminEdit/:user_id', backstageHandler.adminEdit);

router.post('/doAdminUpdate', backstageHandler.doAdminUpdate);



router.get('/articlesEdit', backstageHandler.articlesEdit);

router.post('/doArticleDelete', backstageHandler.doArticleDelete);

router.get('/doArticleEdit/:article_id', backstageHandler.doArticleEdit);

router.post('/updateArticlesEdit',backstageHandler.updateArticlesEdit);

router.get('/articleAdd', backstageHandler.articleAdd);

router.post('/doArticleAdd',backstageHandler.doArticleAdd);


router.get('/tagsEdit', backstageHandler.tagsEdit);
router.post('/doTagDelete', backstageHandler.doTagDelete);
router.get('/doTagEdit/:tag_id', backstageHandler.doTagEdit);
router.post('/updateTagsEdit/:tag_id',backstageHandler.updateTagsEdit);
router.get('/tagAdd',backstageHandler.tagAdd);

router.post('/doTagAdd',backstageHandler.doTagAdd);

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

module.exports = router;
