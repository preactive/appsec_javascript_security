/***
 * Excerpted from "Secure Your Node.js Web Application",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/kdnodesec for more book information.
***/
'use strict';

// SETUP a in-memory DB with username:password lookup
// IMPORTANT: Please note that passwords should not be in plaintext
// No matter what type of DB is in use
var db = {
    1: { username: 'johann', password: 'pw', name: 'Johann', company: 'Mixo', age: 32},
    2: { username: 'andris', password: 'pw2', name: 'Andris', company: 'Apple', age: 22},
    3: { username: 'brian', password: 'pw3', name: 'Brian', company: 'Apple', age: 26},
    4: { username: 'jake', password: 'pw4', name: 'Jake', company: 'Shell', age: 53}
};

function validateUser(user, cb) {
    var username = user.username;
    var password = user.password;
    if(!username || !password) {
        setImmediate(cb, null, {success:false, error: 'Missing username or password'});
        return;
    }
    var userId;
    Object.keys(db).some(function (id) {
        if(db[id].username === username) {
            userId = id;
            return true;
        }
    });
    if(!userId || db[userId].password !== password) {
        setImmediate(cb, null, {success: false, error: 'Wrong username or password'});
        return;
    }
    setImmediate(cb, null, {success: true, userId: userId});
}

var easySession = require('easy-session');
var captchagen = require('captchagen');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(express.cookieParser());
app.use(express.session({secret: 'keyboard cat'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(easySession.main(session));

app.get('/', function(req, res){
    if(!req.session.isGuest()) { // if the user is logged in then redirect to their home
        res.redirect('/user/' + req.session.userId);
        return;
    }
    var form = '<form method="POST" action="/login">' +
        '<input type="text" name="username" placeholder="username" />' +
        '<input type="password" name="password" placeholder="password" />';
    if(req.session.captcha) {
        var captcha = captchagen.create();
        captcha.generate();
        req.session.captcha = captcha.text();
        form += '<input type="text" name="captcha" placeholder="Captcha" />';
    }
    form += '<input type="submit" value="Login" /></form>';
    if(req.session.captcha) {
        form += '<div><img src="' + captcha.uri() + '" /></div>';
    }
    if(req.session.error) { // If we had an error then show it
        form += '<div>' + req.session.error + '</div>';
    }
    req.session.error = null; // Delete error.
    res.send(form);
});

app.post('/login', function (req, res, next) {
    if(req.session.captcha && req.body.captcha !== req.session.captcha) {
        req.session.error = 'Invalid Captcha';
        res.redirect('/');
        return;
    }
    validateUser(req.body, function(err, valid) {
        if(err) {
            next(err);
            return;
        }
        if(valid.success) { // Validation success. Create authorized session.
            req.session.login({userId: valid.userId}, function () {
                res.redirect('/user/' + valid.userId);
            });
        } else {
            req.session.error = valid.error;
            // User was not valid, so delay before answering
            setTimeout(function () {
                res.redirect('/');
            }, 3000);
        }
    });
});

app.get('/logout', function (req, res) {
    req.session.logout(function () {
        res.redirect('/');
    });
});

// Middleware to validate that users are authenticated
app.all('*', function (req, res, next) {
    if(req.session.isGuest()) {
        res.send(401);
        return;
    }
    next();
});

app.get('/user/:id', function (req, res) {
    res.json(db[req.params.id]);
});

app.listen(3000);