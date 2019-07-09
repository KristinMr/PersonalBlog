var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var crypto = require('crypto');
var mysql = require('./database');
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
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: 'PersonalBlog',
    cookie: {maxAge: 1000 * 60 * 24 * 30},
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    if (req.session.user) {
        var query = 'select * from user where user_email = '
            + mysql.escape(req.session.user.user_email);
        mysql.query(query, function (err, user) {
            if (err) {
                res.render('forestage/err.ejs', {err: err});
                return;
            } else if (user) {
                req.user = user[0];
                delete req.user.user_password; // delete the password from the session
                req.session.user = req.user;  //refresh the session value
                res.locals.user = req.user;
                next();
            }
            // finishing processing the middleware and run the route
        });
    } else {
        next();
    }
});

app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
