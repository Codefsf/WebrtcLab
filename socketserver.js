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

var logger = log4js.getLogger();

var app = express();
app.use(serverIndex('./public'));
app.use(express.static('./public'));

var httpServer = http.createServer(app);
httpServer.listen(80, '0.0.0.0');

var httpSocketIo = socketIo.listen(httpServer);

httpSocketIo.sockets.on("connection", (socket)=>{
    logger.debug('------------------------Connection start--------------------------');
    logger.debug('Connection socket id: ' + socket.id);

    socket.on("message", (room, data)=>{
        socket.to(room).emit('message', room, data);
    });

    socket.on('join', (room)=>{
        logger.debug('Join room: ' + room);

        socket.join(room);

        var myRoom  = httpSocketIo.sockets.adapter.rooms[room];
        var users   = Object.keys(myRoom.sockets).length;

	logger.debug('Join room user num: ' + users);
 
        if (users < 3) {
            socket.emit('joined', room, socket.id);
            if (users > 1) {
                socket.to(room).emit('otherjoin', room);
            }
        } else {
            socket.leave(room);
            socket.emit('full', room, socket.id);
        }
    });

    socket.on('leave', (room)=>{
        logger.debug('User leave room id: ' + room);
	    var myRoom = httpSocketIo.sockets.adapter.rooms[room];
	    var user   = (myRoom) ? Object.keys(myRoom.sockets).length : 0;
	    socket.to(room).emit('bye', room, socket.id, "bye to room");
	    socket.emit('bye', room, socket.id, "bye to socket");
    });
})



//TODO replace the key
/*var options = {
	key : fs.readFileSync('./cert/1557605_www.learningrtc.cn.key'),
	cert: fs.readFileSync('./cert/1557605_www.learningrtc.cn.pem')
}
var httpsServer = https.createServer(options, app);
var httpsSocketIo   = socketIo.listen(httpsServer);
*/
