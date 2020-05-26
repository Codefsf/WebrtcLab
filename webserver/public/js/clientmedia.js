'use strict'

var audioSource = document.querySelector('select#audioSource');
var audioOutput = document.querySelector('select#audioOutput');
var videoSource = document.querySelector('select#videoSource');

var divConstraints = document.querySelector('div#constraints');

var btnRecord = document.querySelector('button#record');
var btnPlay = document.querySelector('button#recplay');
var btnDownload = document.querySelector('button#download');
var recvideo = document.querySelector('video#recplayer');

var constraints = {video: true/*, audio:true*/};
var videoPlayer = document.querySelector("video#player");

var buffer;
var mediaRecorder;

function gotMediaStream(stream){
    var videoTrack = stream.getVideoTracks()[0];
	var videoConstraints = videoTrack.getSettings();
	
	divConstraints.textContent = JSON.stringify(videoConstraints, null, 2);

	window.stream = stream;
	videoPlayer.srcObject = stream;

    return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(devicesInfos) {
    devicesInfos.forEach(function(deviceinfo){

		var option = document.createElement('option');
		option.text = deviceinfo.label;
		option.value = deviceinfo.deviceId;
        
        console.log("--->" + deviceinfo.label + deviceinfo.deviceId + deviceinfo.kind);

		if(deviceinfo.kind === 'audioinput'){
			audioSource.appendChild(option);
		}else if(deviceinfo.kind === 'audiooutput'){
			audioOutput.appendChild(option);
		}else if(deviceinfo.kind === 'videoinput'){
			videoSource.appendChild(option);
		}
	})
}

function handleError(error){
    console.log("Get user media error:" + err);
}

function start() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log("This browser not support meidadevices");
        return;
    } else {
        var deviceId = videoSource.value;
        var constraints = {
            video : {
                width : 100,
                height : 80,
                frameRate : 15,
                facingMode : 'enviroment',
                deviceId : deviceId ? {exact:deviceId} : undefined //TODO
            },

            audio : false
        }

        navigator.mediaDevices.getUserMedia(constraints)
                        .then(gotMediaStream)
                        .then(gotDevices)
                        .catch(handleError);

    }
}

function handleDataAvailable(e){
	if(e && e.data && e.data.size > 0){
	 	buffer.push(e.data);			
	}
}

function startRecord()
{
    buffer = [];
    var options = {
        mimeType : "video/webm;codecs=vp8"
    }

    if(!MediaRecorder.isTypeSupported(options.mimeType)){
		console.error(`${options.mimeType} is not supported!`);
		return;	
    }
    
    try{
		mediaRecorder = new MediaRecorder(window.stream, options);
	}catch(e){
		console.error('Failed to create MediaRecorder:', e);
		return;	
	}

	mediaRecorder.ondataavailable = handleDataAvailable;
	mediaRecorder.start(10);
}

function stopRecord(){
	mediaRecorder.stop();
}

btnRecord.onclick = ()=>{

	if(btnRecord.textContent === 'Start Record'){
		startRecord();	
		btnRecord.textContent = 'Stop Record';
		btnPlay.disabled = true;
		btnDownload.disabled = true;
	}else{
		stopRecord();
		btnRecord.textContent = 'Start Record';
		btnPlay.disabled = false;
		btnDownload.disabled = false;
	}
}

btnPlay.onclick = ()=> {
	var blob = new Blob(buffer, {type: 'video/webm'});
	recvideo.src = window.URL.createObjectURL(blob);
	recvideo.srcObject = null;
	recvideo.controls = true;
	recvideo.play();
}

btnDownload.onclick = ()=> {
	var blob = new Blob(buffer, {type: 'video/webm'});
	var url = window.URL.createObjectURL(blob);
	var a = document.createElement('a');

	a.href = url;
	a.style.display = 'none';
	a.download = 'aaa.webm';
	a.click();
}


//Start capture
start();