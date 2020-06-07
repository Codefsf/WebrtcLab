'use strict'

var http    = require('http');
var https   = require('https');
var fs      = require('fs');

var express = require('express');
var serverIndex = require('serve-index');

var app = express();
app.use(serverIndex('./public'));
app.use(express.static('./public'));

var http_server = http.createServer(app);
http_server.listen(80, '0.0.0.0');

