'use strict'

global.navigator={ userAgent: 'node.js', };

if(!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices){
    console.log("Not support");
} else {
    navigator.mediaDevices.enumerateDevices()
    .then(gotDevece)
    .catch(handleError);
}

function gotDevice(deviceInfos){
    deviceInfos.array.forEach(element => {
        console.log("---------------");
    });
}

function handleError(err){
    console.log("Error--------------" + err);
}