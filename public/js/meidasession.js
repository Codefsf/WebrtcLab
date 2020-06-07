'use strict'

var btnConnect = document.querySelector('button#connect');
var btnLeave = document.querySelector('button#leave');
var inputRoom = document.querySelector('input#room');

function connectServer(){

	socket = io.connect();

	btnLeave.disabled = false;
	btnConnect.disabled = true;

	socket.on('joined', function(room, id){
		console.log('The User(' + id + ') have joined into ' + room);	
	});

	socket.on('leaved', function(room, id){ 
		console.log('The User(' + id + ') have leaved from ' + room);
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
