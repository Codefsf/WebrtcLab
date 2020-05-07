'use strict'

var constraints = {video: true};
var videoPlayer = document.querySelector("video#player");

function successCallback(stream){
    console.log("success");
    videoPlayer.srcObject = stream;
}

function errorCallback(stream){
    console.log("error");
}

navigator.getUserMedia(constraints, successCallback, errorCallback);