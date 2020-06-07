'use strict'

var http        = require("http");
var https       = require("https");
var fs          = require("fs");

var express     = require("express");
var serverIndex = require("serve-index");

var socketIo    = require("socket.io");

var log4js      = require("log4js");

log4js.configure({
    appenders: {
        file: {
            type: 'file',
            filename: 'app.log',
            layout: {
                type: 'pattern',
                pattern: '%r %p - %m',
            }
        }
    },
    categories: {
       default: {
          appenders: ['file'],
          level: 'debug'
       }
    }
});

var logger = log4js.logger();

var app = express();
app.use(serverIndex('./public'));
app.use(express.static('./public'));

var httpServer = http.createServer(app);
httpServer.listen(80, '0.0.0.0');

//TODO replace the key
var options = {
	key : fs.readFileSync('./cert/1557605_www.learningrtc.cn.key'),
	cert: fs.readFileSync('./cert/1557605_www.learningrtc.cn.pem')
}
var httpServer = https.createServer(options, app);

var httpSocketIo    = socketIo.listen(httpServer);
var httpsSocketIo   = socketIo.listen(httpServer);

httpsSocketIo.sockets.on("connection", (socket)=>{
    socket.on("message", (room, data)=>{
        socket.to(room).emit('message', room, data);
    });

    socket.on('join', (room)=>{
        socket.join(room);

        var myRoom  = io.sockets.adapter.rooms[room];
        var users   = Object.keys(myRoom.sockets).length;

        logger.log('the number of user in room is: ' + users);
 
        if (users < 3) {
            socket.emit('join', room, socket.id);
            if (users > 1) {
                socket.to(room).emit('otherjoin', room);
            }
        } else {
            socket.leave(room);
            socket.emit('full', room, socket.id);
        }
    });

})