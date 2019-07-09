var forestageHandler = {};

var crypto = require('crypto');
var mysql = require('./../../database');
var fs = require('fs');
// var markdown = require('markdown');
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

forestageHandler.index = function (req, res) {
    console.log(req.session.user);
    res.render('forestage/index', {user: req.session.user});
}

forestageHandler.main = function (req, res) {
    var query = 'select * from user where user_rank = 2';
    mysql.query(query, function (err, admin) {
        if (err) {
            res.render('error', {message: err});
            return;
        } else {
            var query0 = 'select article.*, user.user_name from article, user where article.user_id = user.user_id';
            mysql.query(query0, function (err, rows) {
                if (err) {
                    res.render('error', {message: err});
                    return;
                } else {
                    var query1 = 'select * from tag';
                    mysql.query(query1, function (err, tags) {
                        if (err) {
                            res.render('error', {message: err});
                            return;
                        } else {
                            res.render('forestage/main.ejs', {admin:admin[0], article: rows, tag: tags});
                            return;
                        }
                    })

                }
            })
        }
    })
}

forestageHandler.about = function (req, res) {
    var query = 'select * from user where user_rank = 2';
    mysql.query(query, function (err, admin) {
        if (err) {
            res.render('error', {message: err});
            return;
        } else {
            res.render('forestage/about.ejs', {admin: admin[0], user: req.session.user});
            return;
        }
    })
}

forestageHandler.detail = function (req, res) {
    var articleID = req.params.article_id;
    // var query = 'select article.*, user.* from article, user where article_id=' + mysql.escape(article_id) + 'and article.user_id = user.user_id';
    var query = 'select * from article where article_id=' + mysql.escape(articleID);
    mysql.query(query, function (err, articles) {
        if (err) {
            res.render('error', {message: err});
            return;
        } else {
            console.log(articles[0].user_id);
            var query = 'select * from user where user_id=' + mysql.escape(articles[0].user_id);
            mysql.query(query, function (err, user) {
                if (err) {
                    res.render('error', {message: err});
                    return;
                } else {
                    // var query = 'select tag.tag_name from tag inner join article_tag on article_tag.tag_id = tag.tag_id inner join article on article.article_id ='
                    //     + mysql.escape(articleID) + ' and article.article_id = article_tag.article_id';

                    var query = 'select tag_name from tag, (select tag_id from article_tag where article_tag.article_id='
                        + mysql.escape(articles[0].article_id) + ') tag_id where tag_id.tag_id = tag.tag_id';
                    mysql.query(query, function (err, tags) {
                        if (err) {
                            res.render('error', {message: err});
                            return;
                        } else {
                            delete user.user_password;
                            res.render('forestage/detail.ejs', {article: articles[0], tag: tags, user: user[0]});

                        }
                    })
                }
            })



        }
    })

}


forestageHandler.ITShare = function (req, res) {

    res.render('forestage/ITShare.ejs');
}

forestageHandler.life = function (req, res) {
    var query = 'select * from user where user_rank = 2';
    mysql.query(query, function (err, admin) {
        if (err) {
            res.render('error', {message: err});
            return;
        } else {
            var query1 = 'select * from article where sort_id = 2';
            mysql.query(query1, function (err, articles) {
                if (err) {
                    res.render('error', {message: err});
                    return;
                } else {
                    var query2 = 'select * from tag';
                    mysql.query(query2, function (err, tags) {
                        if (err) {
                            res.render('error', {message: err});
                            return;
                        } else {
                            res.render('forestage/life.ejs', {admin:admin[0], article:articles, tag: tags});
                            return;
                        }
                    })
                }
            })

        }
    })

}

forestageHandler.album = function (req, res) {
    res.render('forestage/album.ejs');
}

forestageHandler.pictureList = function (req, res) {
    res.render('forestage/pictureList.ejs');
}

forestageHandler.time = function (req, res) {
    var query = 'select article.*, user.user_name from article, user where article.user_id = user.user_id';
    mysql.query(query, function (err, rows) {
        if (err) {
            res.render('error', {message: err});
            return;
        } else {
            res.render('forestage/time.ejs', {article: rows, user: req.session.user});
            return;
        }
    });
}

forestageHandler.message = function (req, res) {
    res.render('forestage/message.ejs');
}

forestageHandler.userArticleList = function (req,res) {
    var query = 'select * from article where user_id=' + mysql.escape(req.session.user.user_id);
    mysql.query(query, function (err, rows) {
        if (err) {
            res.render('error', {message: err});
            return;
        } else {
            res.render('forestage/userArticleList.ejs', {article: rows});
        }
    })
}

forestageHandler.userAlbum = function (req,res) {
    res.render('forestage/userAlbum.ejs');
}

forestageHandler.userInfo = function (req,res) {
    res.render('forestage/userInfo.ejs');
}
forestageHandler.updateUser = function (req,res) {

    res.render('forestage/userInfo.ejs');
}
forestageHandler.updateUserPassword = function (req,res) {

    res.render('forestage/updateUserPassword.ejs');
}


forestageHandler.login = function (req, res) {
    res.render('forestage/login.ejs', {user: req.session.user});
}

forestageHandler.doLogin = function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var hash = crypto.createHash('md5');
    hash.update(password);
    password = hash.digest('hex');
    var query = 'select * from user where user_email=' + mysql.escape(email) + 'and user_password=' + mysql.escape(password);
    mysql.query(query, function (err, rows) {
        if (err) {
            res.render('error', {message: err});
            return;
        } else {
            var user = rows[0];
            if (!user) {
                res.render('forestage/login.ejs', {message:'邮箱或者密码错误'});
                return;
            } else {
                req.session.user = rows[0];
                delete req.session.user.user_password;

                // req.session.userSign = true;
                // req.session.userID = user.user_id;
                res.redirect('/');
            }
        }
    })
}

forestageHandler.doRegister = function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var rePassword = req.body.rePassword;
    if (name && email && password && rePassword) {
        var query = 'select user_email from user where user_email=' + mysql.escape(email);
        mysql.query(query, function (err, rows) {
            if (err) {
                res.render('error', {message: err});
                return;
            } else {
                var user = rows[0];
                if (user) {

                    console.log("用户已存在");
                    res.redirect('/login');
                } else if (password != rePassword) {

                    console.log("密码不一样");
                    return;
                } else {
                    var hash = crypto.createHash('md5');
                    hash.update(password);
                    password = hash.digest('hex');
                    var query = 'insert user set user_name=' + mysql.escape(name)
                        + ',user_email=' + mysql.escape(email)
                        + ',user_password=' + mysql.escape(password)
                        + ',user_time=CURDATE()' + ',user_rank=0';
                    mysql.query(query, function (err, rows) {
                        if (err) {
                            res.render('error', {message: err});
                            return;
                        } else {
                            res.render('forestage/index', {user: req.session.user});
                        }
                    })
                }
            }
        })
    } else {
        console.log("空空空");
        res.render('error', {message: "不能为空"})
        return;
    }

}

forestageHandler.addArticle = function (req, res) {
    var query = 'select * from sort';
    mysql.query(query, function (err, sorts) {
        if (err) {
            res.render('error', {message: err});
            return;
        } else {
            var query = 'select * from tag';
            mysql.query(query, function (err, tags) {
                if (err) {
                    res.render('error', {message: err});
                    return;
                } else {
                    res.render('forestage/addArticle.ejs', {sort: sorts, tag: tags});
                }
            })
        }
    })

}

forestageHandler.doAddArticle = function (req, res) {
    var article_title = req.body.article_title;
    var sort_id = req.body.sort_id;
    var article_content = req.body.article_content;
    var article_content_html = marked(req.body.article_content.toString());
    var query = 'insert article set article_title=' + mysql.escape(article_title)
        + ',article_time=CURDATE(), article_content=' + mysql.escape(article_content)
        + ',article_content_html=' + mysql.escape(article_content_html)
        + ',sort_id=' + mysql.escape(sort_id) + ',user_id='
        + mysql.escape(req.session.user.user_id)
        + ',click_number=0,comment_number=0,clloect_number=0';
    mysql.query(query, function (err, rows) {
        if (err) {
            res.render('error', {message: err});
            return;
        } else {
            res.redirect('/userArticleList');
        }
    })
}

forestageHandler.updateArticle = function (req, res) {
    var article_id = req.params.article_id;
    var query = 'select * from article where article_id=' + mysql.escape(article_id);
    mysql.query(query, function (err, article) {
        if (err) {
            res.render('error', {message: err});
            return;
        } else {
            var query = 'select * from sort';
            mysql.query(query, function (err, sorts) {
                if (err) {
                    res.render('error', {message: err});
                    return;
                } else {
                    var query = 'select * from tag';
                    mysql.query(query, function (err, tags) {
                        if (err) {
                            res.render('error', {message: err});
                            return;
                        } else {
                            res.render('forestage/updateArticle.ejs', {article: article[0], sort: sorts, tag: tags});
                        }
                    })
                }
            })
        }
    })
}

forestageHandler.doUpdateArticle = function (req, res) {
    var article_id = req.params.article_id;
    var article_title = req.body.article_title;
    var sort_id = req.body.sort_id;
    var article_content = req.body.article_content;
    var article_content_html = marked(req.body.article_content.toString());
    var query = 'update article set article_title=' + mysql.escape(article_title)
        + ', sort_id=' + mysql.escape(sort_id)
        + ',update_time=CURDATE(), article_content=' + mysql.escape(article_content)
        + ',article_content_html=' + mysql.escape(article_content_html)
        + 'where article_id=' + mysql.escape(article_id);
    mysql.query(query, function (err, rows) {
        if (err) {
            res.render('error', {message: err});
            return;
        } else {
            res.redirect('/userArticleList');
        }
    })
}

forestageHandler.doDeleteArticle = function (req, res) {
    var article_id = req.param("id");
    var query = 'delete from article where article_id =' + mysql.escape(article_id);
    mysql.query(query, function (err, rows, fields) {
        if (err) {
            console.log(err);
            return;
        }
        res.redirect('/userArticleList');
        return;
    });
}

forestageHandler.logout = function (req, res) {
    delete req.session.user;
    res.redirect('/');
}

module.exports = forestageHandler;