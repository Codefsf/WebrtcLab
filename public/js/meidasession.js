'use strict'

var btnConnect = document.querySelector('button#connect');
var btnLeave = document.querySelector('button#leave');
var inputRoom = document.querySelector('input#room');
var btnSend	  = document.querySelector('button#send');
var inputMessage = document.querySelector('input#message');

var socket;
var room;

function connectServer(){
	btnLeave.disabled = false;
	btnConnect.disabled = true;

	socket = io('http://47.91.230.7:80');
	
	socket.on('joined', function(room, id){
		console.log('The User(' + id + ') have joined into ' + room);	
	});

	socket.on('leaved', function(room, id){ 
		console.log('The User(' + id + ') have leaved from ' + room);
	});

	socket.on('bye', (room, id, message)=>{
		console.log("The user say bye from room:" + room + " " + id + " " + message);
	});

	room = inputRoom.value;
	if(room !== ''){
		socket.emit('join', room);	
	}
}

btnConnect.onclick = ()=> {
	connectServer();
}

btnLeave.onclick = ()=> {
	if(room !== ''){
		socket.emit('leave', room);
		btnLeave.disabled = true;
		btnConnect.disabled = false;
		socket.disconnect(); 
	}
}

btnSend.onclick = ()=>{
	var message = inputMessage.value;
	socket.emit("message", message);
}
