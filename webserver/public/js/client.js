'use strict'

console.log(navigator.appName + " " + navigator.appVersion);

if(!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices){
    console.log("This browser not support.");
} else {
    navigator.mediaDevices.enumerateDevices()
    .then(gotDevice)
    .catch(handleError);
}

function gotDevice(deviceInfos){
    deviceInfos.forEach(function(deviceInfo){
        console.log(deviceInfo.kind + 
            " " + deviceInfo.deviceId +
            " " + deviceInfo.label +
            " " + deviceInfo.groupId);
    })
}

function handleError(err){
    console.log("Error->" + err);
}