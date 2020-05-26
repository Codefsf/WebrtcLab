'use strict'

var audioSource = document.querySelector('select#audioSource');
var audioOutput = document.querySelector('select#audioOutput');
var videoSource = document.querySelector('select#videoSource');

var divConstraints = document.querySelector('div#constraints');
var constraints = {video: true};
var videoPlayer = document.querySelector("video#player");

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

//Start capture
start();