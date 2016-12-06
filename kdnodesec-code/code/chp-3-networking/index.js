/***
 * Excerpted from "Secure Your Node.js Web Application",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/kdnodesec for more book information.
***/
'use strict';

var cluster = require('cluster');
var http = require('http');

var server = http.createServer(function (req, res) {
    res.writeHead(200);
    res.end("hello world\n");
}).listen(3000);
