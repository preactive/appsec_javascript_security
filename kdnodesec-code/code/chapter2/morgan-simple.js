/***
 * Excerpted from "Secure Your Node.js Web Application",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/kdnodesec for more book information.
***/
'use strict';

var express = require('express');

var app = express();
// Require the morgan logger
var morgan = require('morgan');
app.use(morgan('combined'));
/*
Old way of doing things in v3
app.use(express.logger());
*/
app.get('/', function (req, res) {
    res.send('hello, world!')
});

app.listen(3000);