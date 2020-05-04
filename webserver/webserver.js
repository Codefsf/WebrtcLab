'use strict'

var http    = require('http');
var https   = require('https');
var fs      = require('fs');

var express = require('express');
var serverInidex = require('serve-index');

var app = express();

//http
var http_server = http.createServer(app);
http_server.listen(80, '0.0.0.0');

//https
//var https_server = https.createServer(options, app);
//https_server.listen(443, '0.0.0.0');

