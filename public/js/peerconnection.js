let pc1;
let pc2;

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

async function onIceCandidata(pc, event) {
    try {
        await (getOtherPc(pc).addIceCandidate(event.candidate));
        onAddIceCandidateSuccess(pc);
    } catch (e) {
        onAddIceCandidateError(pc, e);
    }
}

function gotRemoteStream(e) {
    if (remoteVideo.srcObject !== e.streams[0]) {
      remoteVideo.srcObject = e.streams[0];
      console.log('pc2 received remote stream');
    }
}

async function onCreateAnswerSuccess(desc) {
    console.log('Create answer pc2');
    try {
        await pc2.setLocalDescription(desc);
      } catch (e) {

    }

    console.log('pc1 setRemoteDescription start');
    try {
        await pc1.setRemoteDescription(desc);
    } catch (e) {

    }
}

async function onCreateOfferSuccess(desc) {
    console.log('Create offer success from pc1');

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
        const answer = pc2.createAnswer();
        await onCreateAnswerSuccess(answer);
    } catch(e) {
        console.log('Create answer failed pc2');
    }
}

async function call() {
    console.log('Start call');

    const videoTracks = localStream.getVideoTracks;
    const audioTracks = localStream.getAudioTracks;

    if (videoTracks.length > 0) {
        console.log(`Using video device: ${videoTracks[0].label}`);
    }
    if (audioTracks.length > 0) {
        console.log(`Using audio device: ${audioTracks[0].label}`);
    }

    const sdpConfiguration = 'Default';
    console.log('RTCPeerConnection configuration:', sdpConfiguration);

    pc1 = new RTCPeerConnection(sdpConfiguration);
    pc1.addEventListener('icecandidate', e=>onIceCandidata(pc1, e));
    pc1.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc1, e));
    console.log('New pc1.');

    pc2 = new RTCPeerConnection(sdpConfiguration);
    pc2.addEventListener('icecandidate', e=>onIceCandidata(pc2, e));
    pc2.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc2, e));
    pc2.addEventListener('track', gotRemoteStream);

    console.log('New pc2.');

    localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));

    try {
        console.log('pc1 createOffer start');
        const offer = await pc1.createOffer(offerOptions);
        await onCreateOfferSuccess(offer);
    } catch (e) {
        onCreateSessionDescriptionError(e);
    }
}

async function hung() {

}