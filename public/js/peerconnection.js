'use strict';

const callButton = document.getElementById('call');
const hangupButton = document.getElementById('hang');

callButton.disabled = false;
hangupButton.disabled = false;

callButton.addEventListener('click', call);
hangupButton.addEventListener('click', hang);


let pc1;
let pc2;

var remoteVideo = document.querySelector("video#remoteplayer");

const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
};

function getName(pc) {
    return (pc === pc1) ? 'pc1' : 'pc2';
  }
  
function getOtherPc(pc) {
    return (pc === pc1) ? pc2 : pc1;
}

async function onIceCandidate(pc, event) {
    try {
        await (getOtherPc(pc).addIceCandidate(event.candidate));
        onAddIceCandidateSuccess(pc);
    } catch (e) {
        onAddIceCandidateError(pc, e);
    }
    console.log(`${getName(pc)} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
}

function onAddIceCandidateSuccess(pc) {
    console.log(`${getName(pc)} addIceCandidate success`);
}
  
function onAddIceCandidateError(pc, error) {
    console.log(`${getName(pc)} failed to add ICE Candidate: ${error.toString()}`);
}

function onIceStateChange(pc, event) {
    if (pc) {
      console.log(`${getName(pc)} ICE state: ${pc.iceConnectionState}`);
      console.log('ICE state change event: ', event);
    }
}

function gotRemoteStream(e) {
    if (remoteVideo.srcObject !== e.streams[0]) {
      remoteVideo.srcObject = e.streams[0];
      console.log('pc2 received remote stream ' + e.streams.length);
    }
}

async function onCreateOfferSuccess(desc) {
    console.log(`Offer from pc1\n${desc.sdp}`);

    console.log('Set pc1 sdp start');
    try {
        await pc1.setLocalDescription(desc);
        console.log('Set sdp success pc1');
    } catch(e) {
        console.log('Set sdp failed pc1');
    }

    console.log('Set pc2 sdp start');
    try {
        await pc2.setRemoteDescription(desc);
        console.log('Set sdp success pc2');
    } catch(e) {
        console.log('Set sdp failed pc2');
    }

    console.log('Set pc2 offer start');
    try {
        const answer = await pc2.createAnswer();
        console.log('Create answer success pc2');

        await onCreateAnswerSuccess(answer);
    } catch(e) {
        console.log(`Create answer failed pc2: ${error.toString()}`);
    }
}

async function onCreateAnswerSuccess(desc) {
    console.log(`Answer from pc2:\n${desc.sdp}`);
    console.log('pc2 setLocalDescription start');
    try {
        await pc2.setLocalDescription(desc);
        console.log('Set local desc success pc2');
      } catch (e) {
        console.log('Set local desc failed pc2');
    }

    console.log('pc1 setRemoteDescription start');
    try {
        await pc1.setRemoteDescription(desc);
        console.log('Set remote desc success pc1');
    } catch (e) {
        console.log(`Set remote desc failed pc1: ${e.toString()}`);
    }
}

async function call() {
    console.log('Start call');

    pc1 = new RTCPeerConnection();
    pc1.addEventListener('icecandidate', e => onIceCandidate(pc1, e));
    pc1.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc1, e));
    console.log('New pc1 finish.');

    pc2 = new RTCPeerConnection();
    pc2.addEventListener('icecandidate', e => onIceCandidate(pc2, e));
    pc2.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc2, e));
    pc2.addEventListener('track', gotRemoteStream);
    console.log('New pc2 finish.');

    localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));

    try {
        console.log('pc1 createOffer start');
        const offer = await pc1.createOffer(offerOptions);
        await onCreateOfferSuccess(offer);
    } catch (e) {
        console.log(`pc1 createOffer failed: ${e.toString()}`);
    }
}

async function hang() {
    console.log('Start hang');
    pc1.close();
    pc2.close();
    pc1 = null;
    pc2 = null;
}