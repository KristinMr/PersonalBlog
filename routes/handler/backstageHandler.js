var backstageHandler = {};
var crypto = require('crypto');
var mysql = require('./../../database');
var fs = require('fs');
var markdown = require('markdown');
var marked = require('marked');


backstageHandler.index = function (req, res) {
    if (!req.session.user) {
        res.redirect('/admin/login');
    }
    res.render('backstage/index');
}

backstageHandler.content = function (req, res) {
    res.render('backstage/content');
}

backstageHandler.login = function (req, res) {
    res.render('backstage/login',{error:null});
}

backstageHandler.doLogin = function (req, res) {
    var name = req.body.name;
    var password = req.body.password;
    var hash = crypto.createHash('md5');
    hash.update(password);
    password = hash.digest('hex');
    var query = 'select * from user where user_name=' + mysql.escape(name) + 'and user_password=' + mysql.escape(password);
    mysql.query(query, function (err, rows, fields) {
        if (err) {
            console.log(err);
            return;
        }
        var user = rows[0];
        if (!user) {
            res.render('backstage/login', {message:'用户名或者密码错误'});
            return;
        }
        req.session.user = user;
        // req.session.userSign = true;
        // req.session.userID = user.user_id;
        res.redirect('/admin');
    });
}

backstageHandler.myInfo = function (req, res) {
    fs.readFile('./public/aboutme.md', function(err, data){
        if(err){
            console.log("文件不存在！");
            res.send("文件不存在！");
        }else{
            console.log(data);
            htmlStr = marked(data.toString());
            res.render('backstage/myInfo', {doc: htmlStr});
        }
    });

    // res.render('backstage/28.md');
}

backstageHandler.adminList = function (req, res) {
    var query = 'select * from user';
    mysql.query(query, function (err, rows, fields) {
        if (err) {
            console.log(err);
            return;
        }
        res.render('backstage/adminList',{user: rows});
        return;
    });
}

backstageHandler.adminEdit = function (req, res) {
    var user_id = req.params.user_id;
    var query = 'select * from user where user_id=' + user_id;
    mysql.query(query, function (err,rows) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.render('backstage/adminEdit', {user:rows[0]});
            return;
        }
    });

}

backstageHandler.doAdminUpdate = function (req, res) {
    if (req.body.newUserName && req.body.newUserPassword && req.body.newUserPasswordAgain) {
        if (req.body.newUserPassword === req.body.newUserPasswordAgain) {
            var newUserPassword = req.body.newUserPassword;
            var newUserPassword = crypto.createHash('md5').update(newUserPassword).digest('hex');
            console.log("新密码："+ newUserPassword);

            var query = 'update user set user_name = ? , user_password = ?';
            mysql.query(query, [req.body.newUserName, newUserPassword],function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    return;
                }
                res.redirect('/admin/adminList');
                return;
            });
        } else {
            res.send("密码不一样");
            return;
        }
    } else {
        console.log("空");
        res.redirect('/admin/adminList');
        return;
    }

}

backstageHandler.articlesEdit = function (req, res) {
    var query = 'select * from article';
    mysql.query(query, function (err, rows, fields) {
        if (err) {
            console.log(err);
            return;
        }
        // rows[0].article_date = rows[0].article_date.toLocaleDateString();
        res.render('backstage/articlesEdit', {article: rows});
        return;
    });
}

backstageHandler.doArticleDelete = function (req, res) {
    var query = 'delete from article where article_id =' + req.param("id");
    mysql.query(query, function (err, rows, fields) {
        if (err) {
            console.log(err);
            return;
        }
        res.redirect('/admin/articlesEdit');
        return;
    });
}

backstageHandler.doArticleEdit = function (req, res) {
    var article_id = req.params.article_id;
    var query = 'select * from article where article_id=' + mysql.escape(article_id);
    mysql.query(query, function (err, rows, fields) {
        if (err) {
            console.log(err);
            return;
        } else {
            var articleName = './public/articles/' + article_id + '.md';
            console.log("这是ID" + articleName);
            fs.readFile(articleName, function(err, data){
                if(err){
                    console.log("文件不存在！");
                    res.send("文件不存在！");
                }else{
                    console.log(data);
                    htmlStr = marked(data.toString());
                    res.render('backstage/articleEdit', {doc: htmlStr,article: rows[0]});
                    return;
                }
            });
        }
    });

    // res.redirect('/admin/articleAdd');
}

backstageHandler.updateArticlesEdit = function (req, res) {
    // var query = 'insert into article(article_title) values(article_title)';
    res.redirect('/admin/articlesEdit');
    return;
}

backstageHandler.articleAdd = function (req, res) {
    res.render('backstage/articleAdd');
}

backstageHandler.doArticleAdd = function (req, res) {
    var title = req.body.title;
    var author = req.body.author;
    var query = 'insert into article set article_title=' + mysql.escape(title) + ',article_date=CURDATE(),author_name=' + mysql.escape(author);
    mysql.query(query,function (err, rows, fields) {
        if (err) {
            console.log(err);
            return;
        }
        res.redirect('/admin/articlesEdit');
    });
}



backstageHandler.tagsEdit = function (req, res) {
    var query = 'select * from tag';
    mysql.query(query, function (err, rows, fields) {
        if (err) {
            console.log(err);
            return;
        }
        res.render('backstage/tagsEdit', {tag: rows});
        return;
    });
}

backstageHandler.doTagDelete = function (req, res) {
    var query = 'delete from tag where tag_id =' + req.param("id");
    mysql.query(query, function (err, rows, fields) {
        if (err) {
            console.log(err);
            return;
        }
        res.redirect('/admin/tagsEdit');
        return;
    });
}

backstageHandler.doTagEdit = function (req, res) {
    var tag_id = req.params.tag_id;
    var query = 'select * from tag where tag_id=' + mysql.escape(tag_id);
    mysql.query(query, function (err, rows, fields) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.render('backstage/tagEdit', {tag: rows[0]});
            return;
        }
    });

    // res.redirect('/admin/articleAdd');
}

backstageHandler.updateTagsEdit = function (req, res) {
    var id = req.params.tag_id;
    var name = req.body.name;
    var query = 'update tag set tag_name=' + mysql.escape(name) + 'where tag_id=' + mysql.escape(id);
    mysql.query(query,function (err, rows, fields) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/admin/TagsEdit');
            return;
        }
    });
}

backstageHandler.tagAdd = function (req, res) {
    res.render('backstage/tagAdd');
}

backstageHandler.doTagAdd = function (req, res) {
    var name = req.body.name;
    var query = 'insert into tag set tag_name=' + mysql.escape(name);
    mysql.query(query,function (err, rows, fields) {
        if (err) {
            console.log(err);
            return;
        }
        res.redirect('/admin/tagsEdit');
    });
}

module.exports = backstageHandler;