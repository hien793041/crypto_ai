const isDebugging = true;
var hubUrl = document.location.origin + '/ConnectionHub';
var wsconn = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, signalR.HttpTransportType.WebSockets)
    .configureLogging(signalR.LogLevel.None).build();

var dictConnections = []; // Create an empty array

//function uuidv4() {
//    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
//        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
//    );
//}

//var conOfUser = { "connectionid": uuidv4(), "Type": 1 };

//dictConnections.push({
//    key: uuidv4(),
//    value: [{ "connectionid": uuidv4(), "Type": 1 }, { "connectionid": uuidv4(), "Type": 2 }]
//});

//console.log("uuidv4: " + JSON.stringify(dictConnections));

var peerConnectionConfig = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
//    "iceServers": [
//        { "urls": "stun:stun.l.google.com:19302?transport=udp" },
//        { "urls": "stun:numb.viagenie.ca:3478?transport=udp" },
//        { "urls": "turn:numb.viagenie.ca:3478?transport=udp", "username": "shahzad@fms-tech.com", "credential": "P@ssw0rdfms" },
//        { "urls": "turn:turn-testdrive.cloudapp.net:3478?transport=udp", "username": "redmond", "credential": "redmond123" }
//    ]
//};

$(document).ready(function () {
    initializeSignalR();

    //// Add click handler to users in the "Users" pane
    //$(document).on('click', '.user', function () {
    //    console.log('calling user... ');
    //    // Find the target user's SignalR client id
    //    var targetConnectionId = $(this).attr('data-cid');

    //    // Make sure we are in a state where we can make a call
    //    //if ($('body').attr("data-mode") !== "idle") {
    //    //    alertify.error('Sorry, you are already in a call.  Conferencing is not yet implemented.');
    //    //    return;
    //    //}

    //    // Then make sure we aren't calling ourselves.
    //    if (targetConnectionId != myConnectionId) {
    //        // Initiate a call
    //        wsconn.invoke('callUser', { "connectionId": targetConnectionId });

    //        // UI in calling mode
    //        $('body').attr('data-mode', 'calling');
    //        $("#callstatus").text('Calling...');
    //    } else {
    //        alertify.error("Ah, nope.  Can't call yourself.");
    //    }
    //});

    //// Add handler for the hangup button
    //$('.hangup').click(function () {
    //    console.log('hangup....');
    //    // Only allow hangup if we are not idle
    //    //localStream.getTracks().forEach(track => track.stop());
    //    if ($('body').attr("data-mode") !== "idle") {
    //        wsconn.invoke('hangUp');
    //        closeAllConnections();
    //        $('body').attr('data-mode', 'idle');
    //        $("#callstatus").text('Idle');
    //    }
    //});
});

function CallingUser(cid, isVideo) {
    webrtcConstraints.video = isVideo;
    var targetConnectionId = cid;
    console.log('calling user... ' + cid);

    initializeUserMedia();

    //initializeUserMediaShareScreen();

    if (targetConnectionId != myConnectionId) {
        // Initiate a call
        wsconn.invoke('callUser', { "connectionId": targetConnectionId, "isVideo": isVideo });

        // UI in calling mode
        $("#callstatus").text('Calling...');
    } else {
        alertify.error("Ah, nope.  Can't call yourself.");
    }

    if (!isVideo) {
        localStream.getVideoTracks().map((track) => track.stop());
    }
}

function HangUp() {
    console.log('hangup....');
    wsconn.invoke('hangUp');
    closeAllConnections();
    $("#callstatus").text('');
    [
        ...(localStream ? localStream.getTracks() : [])
    ].map((track) => track.stop());
}

var webrtcConstraints = {
    audio: {
        echoCancellation: { exact: true }
    },
    /*video: true*/
    video: {
        width: 320, height: 240
    }
};
var streamInfo = { applicationName: WOWZA_APPLICATION_NAME, streamName: WOWZA_STREAM_NAME, sessionId: WOWZA_SESSION_ID_EMPTY };

var WOWZA_STREAM_NAME = null, connections = {}, localScreenStream = null, localStream = null;

function CallingAudio(isVideo) {
    webrtcConstraints.video = isVideo;
    navigator.getUserMedia(webrtcConstraints, callbackUserMediaSuccess, errorHandler);
}

function CallingVideo(isVideo) {
    webrtcConstraints.video = isVideo;
    navigator.getUserMedia(webrtcConstraints, callbackUserMediaSuccess, errorHandler);
}

attachMediaStream = (e, partnerClientId) => {
    console.log("OnPage: called attachMediaStream:" + partnerClientId);
    //var partnerAudio = document.querySelector('.audio.partner');
    //if (partnerAudio.srcObject !== e.stream) {
    //    partnerAudio.srcObject = e.stream;
    //    console.log("OnPage: Attached remote stream");
    //}

    //var partnerVideo = document.querySelector('.video.partner');
    //if (partnerAudio.srcObject !== e.stream) {
    //partnerVideo.srcObject = e.stream;
    //console.log("OnPage: Attached remote stream");
    //}

    if (ShareScreenUser.shareConnectionId == partnerClientId) {
        //console.log("OnPage: called attachMediaStream ShareScreenUser:" + partnerClientId);
        console.log("OnPage: called attachMediaStream stream ShareScreenUser:", e.stream);

        var videoScreenShare = document.querySelector('video#justScreenShare');
        videoScreenShare.srcObject = e.stream;

        console.log("OnPage: Attached remote stream ShareScreen:" + partnerClientId);
    } else {
        console.log("OnPage: called attachMediaStream stream:", e.stream);
        var videoPartner = document.querySelector('video#videoPartner');
        //if (videoPartner.srcObject !== e.stream) {
        videoPartner.srcObject = e.stream;
        console.log("OnPage: Attached remote stream:" + partnerClientId);
        //}
    }
    
};

const receivedCandidateSignal = (connection, partnerClientId, candidate) => {
    //console.log('candidate', candidate);
    //if (candidate) {
    console.log('WebRTC: adding full candidate: ', partnerClientId);
    connection.addIceCandidate(new RTCIceCandidate(candidate), () => console.log("WebRTC: added candidate successfully"), () => console.log("WebRTC: cannot add candidate"));
    //} else {
    //    console.log('WebRTC: adding null candidate');
    //   connection.addIceCandidate(null, () => console.log("WebRTC: added null candidate successfully"), () => console.log("WebRTC: cannot add null candidate"));
    //}
}

const receivedCandidateSignalShareScreen = (connection, partnerClientId, candidate) => {
    //console.log('candidate', candidate);
    if (candidate) {
    console.log('WebRTC: adding full candidate ShareScreen: ', partnerClientId);
    connection.addIceCandidate(new RTCIceCandidate(candidate), () => console.log("WebRTC: added candidate successfully ShareScreen"), () => console.log("WebRTC: cannot add candidate ShareScreen"));
    } else {
        console.log('WebRTC: adding null candidate ShareScreen');
        connection.addIceCandidate(null, () => console.log("WebRTC: added null candidate successfully ShareScreen"), () => console.log("WebRTC: cannot add null candidate ShareScreen"));
    }
}

// Process a newly received SDP signal
const receivedSdpSignal = (connection, partnerClientId, sdp) => {
    console.log('connection: ', connection);
    console.log('sdp', sdp);
    console.log('WebRTC: called receivedSdpSignal: ' + partnerClientId);
    console.log('WebRTC: processing sdp signal');
    connection.setRemoteDescription(new RTCSessionDescription(sdp), () => {
        console.log('WebRTC: set Remote Description');
        if (connection.remoteDescription.type == "offer") {
            console.log('WebRTC: remote Description type offer');
            if (localStream != null)
                connection.addStream(localStream);
            console.log('WebRTC: added stream');
            connection.createAnswer().then((desc) => {
                console.log('WebRTC: create Answer...');
                connection.setLocalDescription(desc, () => {
                    console.log('WebRTC: set Local Description...');
                    console.log('connection.localDescription: ', connection.localDescription);
                    setTimeout(() => {
                    sendHubSignal(JSON.stringify({ "sdp": connection.localDescription }), partnerClientId);
                    }, 1000);
                }, errorHandler);
            }, errorHandler);
        } else if (connection.remoteDescription.type == "answer") {
            console.log('WebRTC: remote Description type answer');
        }
    }, errorHandler);
}

const receivedSdpSignalShareScreen = (connection, partnerClientId, sdp) => {
    console.log('connection ShareScreen: ', connection);
    console.log('sdp ShareScreen', sdp);
    console.log('WebRTC: called receivedSdpSignal ShareScreen: ' + partnerClientId);
    console.log('WebRTC: processing sdp signal ShareScreen');
    connection.setRemoteDescription(new RTCSessionDescription(sdp), () => {
        console.log('WebRTC: set Remote Description ShareScreen');
        if (connection.remoteDescription.type == "offer") {
            console.log('WebRTC: remote Description type offer ShareScreen');
            console.log('localScreenStream ShareScreen: ', localScreenStream);
            if (localScreenStream != null)
                connection.addStream(localScreenStream);
            console.log('WebRTC: added stream ShareScreen');
            connection.createAnswer().then((desc) => {
                console.log('WebRTC: create Answer ShareScreen...');
                connection.setLocalDescription(desc, () => {
                    console.log('WebRTC: set Local Description ShareScreen...');
                    console.log('connection.localDescription ShareScreen: ', connection.localDescription);
                    setTimeout(() => {
                        sendHubSignalShareScreen(JSON.stringify({ "sdp": connection.localDescription }), partnerClientId);
                    }, 1000);
                }, errorHandler);
            }, errorHandler);
        } else if (connection.remoteDescription.type == "answer") {
            console.log('WebRTC: remote Description type answer ShareScreen');
        }
    }, errorHandler);
}

// Hand off a new signal from the signaler to the connection
const newSignal = (partnerClientId, data) => {
    console.log('WebRTC: called newSignal: ', partnerClientId);
    //console.log('connections: ', connections);

    var signal = JSON.parse(data);
    var connection = getConnection(partnerClientId);
    console.log("signal: ", signal);
    //console.log("signal: ", signal.sdp || signal.candidate);
    //console.log("partnerClientId: ", partnerClientId);
    console.log("connection: ", connection);

    // Route signal based on type
    if (signal.sdp) {
        console.log('WebRTC: sdp signal');
        receivedSdpSignal(connection, partnerClientId, signal.sdp);
    } else if (signal.candidate) {
        console.log('WebRTC: candidate signal');
        receivedCandidateSignal(connection, partnerClientId, signal.candidate);
    } else {
        console.log('WebRTC: adding null candidate');
        connection.addIceCandidate(null, () => console.log("WebRTC: added null candidate successfully"), () => console.log("WebRTC: cannot add null candidate"));
    }
}

const newSignalShareScreen = (partnerClientId, data) => {
    console.log('WebRTC: called newSignal ShareScreen: ', partnerClientId);
    //console.log('connections: ', connections);

    var signal = JSON.parse(data);
    var connection = getConnectionShareScreen(partnerClientId);
    console.log("signal ShareScreen: ", signal);
    //console.log("signal: ", signal.sdp || signal.candidate);
    //console.log("partnerClientId: ", partnerClientId);
    console.log("connection ShareScreen: ", connection);

    // Route signal based on type
    if (signal.sdp) {
        console.log('WebRTC: sdp signal ShareScreen');
        receivedSdpSignalShareScreen(connection, partnerClientId, signal.sdp);
    } else if (signal.candidate) {
        console.log('WebRTC: candidate signal ShareScreen');
        receivedCandidateSignalShareScreen(connection, partnerClientId, signal.candidate);
    } else {
        console.log('WebRTC: adding null candidate ShareScreen');
        connection.addIceCandidate(null, () => console.log("WebRTC: added null candidate successfully ShareScreen"), () => console.log("WebRTC: cannot add null candidate ShareScreen"));
    }
}

const onReadyForStream = (connection) => {
    console.log("WebRTC: called onReadyForStream");
    // The connection manager needs our stream
    //console.log("onReadyForStream connection: ", connection);
    connection.addStream(localStream);
    console.log("WebRTC: added stream");
}

const onStreamRemoved = (connection, streamId) => {
    console.log("WebRTC: onStreamRemoved -> Removing stream: ");
    //console.log("Stream: ", streamId);
    //console.log("connection: ", connection);
}
// Close the connection between myself and the given partner
const closeConnection = (partnerClientId) => {
    console.log("WebRTC: called closeConnection ");
    var connection = connections[partnerClientId];

    if (connection) {
        // Let the user know which streams are leaving
        // todo: foreach connection.remoteStreams -> onStreamRemoved(stream.id)
        onStreamRemoved(null, null);

        // Close the connection
        connection.close();
        delete connections[partnerClientId]; // Remove the property
    }
}
// Close all of our connections
const closeAllConnections = () => {
    console.log("WebRTC: call closeAllConnections ");
    for (var connectionId in connections) {
        closeConnection(connectionId);
    }
}

const getConnection = (partnerClientId) => {
    console.log("WebRTC: called getConnection: ", partnerClientId);
    if (connections[partnerClientId]) {
        console.log("WebRTC: connections partner client exist: " + partnerClientId);
        return connections[partnerClientId];
    }
    else {
        console.log("WebRTC: initialize new connection: " + partnerClientId);
        return initializeConnection(partnerClientId)
    }
}

const getConnectionShareScreen = (partnerClientId) => {
    console.log("WebRTC: called getConnection ShareScreen: ", partnerClientId);
    if (connections[partnerClientId]) {
        console.log("WebRTC: connections partner client exist ShareScreen: " + partnerClientId);
        return connections[partnerClientId];
    }
    else {
        console.log("WebRTC: initialize new connection ShareScreen: " + partnerClientId);
        return initializeConnectionShareScreen(partnerClientId)
    }
}

const initiateOffer = (partnerClientId, stream) => {
    console.log('WebRTC: called initiateoffer: ', partnerClientId);
    var connection = getConnection(partnerClientId); // // get a connection for the given partner
    //console.log('initiate Offer stream: ', stream);
    //console.log("offer connection: ", connection);
    connection.addStream(stream);// add our audio/video stream
    console.log("WebRTC: Added local stream");

    connection.createOffer().then(offer => {
        console.log('WebRTC: created Offer: ');
        console.log('WebRTC: Description after offer: ', offer);
        connection.setLocalDescription(offer).then(() => {
            console.log('WebRTC: set Local Description: ');
            console.log('connection before sending offer ', connection);
            setTimeout(() => {
                console.log('sendHubSignal: ', partnerClientId);
                sendHubSignal(JSON.stringify({ "sdp": connection.localDescription }), partnerClientId);
            }, 1000);
        }).catch(err => console.error('WebRTC: Error while setting local description', err));
    }).catch(err => console.error('WebRTC: Error while creating offer', err));

    //connection.createOffer((desc) => { // send an offer for a connection
    //    console.log('WebRTC: created Offer: ');
    //    console.log('WebRTC: Description after offer: ', JSON.stringify(desc));
    //    connection.setLocalDescription(desc, () => {
    //        console.log('WebRTC: Description after setting locally: ', JSON.stringify(desc));
    //        console.log('WebRTC: set Local Description: ');
    //        console.log('connection.localDescription: ', JSON.stringify(connection.localDescription));
    //        sendHubSignal(JSON.stringify({ "sdp": connection.localDescription }), partnerClientId);
    //    });
    //}, errorHandler);
}

const callbackUserMediaSuccess = (stream) => {
    console.log("WebRTC: got media stream");
    
    localStream = stream;

    var videoMySelf = document.querySelector('video#videoMySelf');
    if (stream !== null) {
        videoMySelf.srcObject = stream;
        window.stream = stream;
        console.log("OnPage: Attached remote stream");
    }

    const audioTracks = localStream.getAudioTracks();
    if (audioTracks.length > 0) {
        console.log(`Using Audio device: ${audioTracks[0].label}`);
    }
};

const callbackUserMediaSuccessShareScreen = async (stream) => {
    console.log("WebRTC: got media stream ShareScreen");

    //stream = await navigator.mediaDevices.getDisplayMedia({
    //    video: true,
    //    audio: false
    //});

    //stream = await navigator.mediaDevices.getUserMedia(webrtcConstraints);

    localScreenStream = stream;

    var videoMySelf = document.querySelector('video#videoMySelf');
    if (stream !== null) {
        videoMySelf.srcObject = localScreenStream;
        window.stream = localScreenStream;
        console.log("OnPage: Attached remote stream ShareScreen");
    }

    const audioTracks = localScreenStream.getAudioTracks();
    if (audioTracks.length > 0) {
        console.log(`Using Audio device ShareScreen: ${audioTracks[0].label}`);
    }
};

const initializeUserMedia = async () => {
    console.log('WebRTC: InitializeUserMedia: ');
    console.log('WebRTC: InitializeUserMedia - webrtcConstraints: ', webrtcConstraints);
    navigator.getUserMedia(webrtcConstraints, callbackUserMediaSuccess, errorHandler);
    //localStream = await navigator.mediaDevices.getUserMedia(webrtcConstraints);
};

const initializeUserMediaShareScreen = async () => {
    console.log('WebRTC: InitializeUserMedia ShareScreen: ');
    console.log('WebRTC: InitializeUserMedia - webrtcConstraints ShareScreen: ', webrtcConstraints);
    await navigator.getUserMedia(webrtcConstraints, callbackUserMediaSuccessShareScreen, errorHandler);
};

const stopUserMedia = () => {
    [
        ...(localStream ? localStream.getTracks() : [])
    ].map((track) => track.stop());
    localStream = null;
};

// stream removed
const callbackRemoveStream = (connection, evt) => {
    console.log('WebRTC: removing remote stream from partner window');
    // Clear out the partner window
    var otherAudio = document.querySelector('.audio.partner');
    otherAudio.src = '';
}

const callbackAddStream = (connection, evt, partnerClientId) => {
    console.log('WebRTC: called callbackAddStream 1: ' + partnerClientId);
    console.log(connection);
    console.log(evt);
    console.log('WebRTC: called callbackAddStream 2');

    // Bind the remote stream to the partner window
    //var otherVideo = document.querySelector('.video.partner');
    //attachMediaStream(otherVideo, evt.stream); // from adapter.js
    attachMediaStream(evt, partnerClientId);
}

const callbackNegotiationNeeded = (connection, evt) => {
    console.log("WebRTC: Negotiation needed...");
    //console.log("Event: ", evt);
}

const callbackIceCandidate = (evt, connection, partnerClientId) => {
    console.log("WebRTC: Ice Candidate callback: ", partnerClientId);
    console.log("evt.candidate: ", evt.candidate);
    if (evt.candidate) {// Found a new candidate
        console.log('WebRTC: new ICE candidate');
        console.log("evt.candidate: ", evt.candidate);
        sendHubSignal(JSON.stringify({ "candidate": evt.candidate }), partnerClientId);
    } else {
        // Null candidate means we are done collecting candidates.
        console.log('WebRTC: ICE candidate gathering complete');
        sendHubSignal(JSON.stringify({ "candidate": null }), partnerClientId);
    }
}

const initializeConnection = (partnerClientId) => {
    console.log('WebRTC: Initializing connection...');
    console.log("Received Param for connection: ", partnerClientId);

    var connection = new RTCPeerConnection(peerConnectionConfig);
    //connection.iceConnectionState = evt => console.log("WebRTC: iceConnectionState", evt); //not triggering on edge
    //connection.iceGatheringState = evt => console.log("WebRTC: iceGatheringState", evt); //not triggering on edge
    //connection.ondatachannel = evt => console.log("WebRTC: ondatachannel", evt); //not triggering on edge
    //connection.oniceconnectionstatechange = evt => console.log("WebRTC: oniceconnectionstatechange", evt); //triggering on state change
    //connection.onicegatheringstatechange = evt => console.log("WebRTC: onicegatheringstatechange", evt); //triggering on state change
    //connection.onsignalingstatechange = evt => console.log("WebRTC: onsignalingstatechange", evt); //triggering on state change
    //connection.ontrack = evt => console.log("WebRTC: ontrack", evt);
    //connection.ontrack = event => {
    //    const track = event.track;
    //    const mid = event.transceiver.mid;
    //    console.log("WebRTC: ontrack", evt);
    //}
    connection.onicecandidate = evt => callbackIceCandidate(evt, connection, partnerClientId); // ICE Candidate Callback
    //connection.onnegotiationneeded = evt => callbackNegotiationNeeded(connection, evt); // Negotiation Needed Callback
    connection.onaddstream = evt => callbackAddStream(connection, evt, partnerClientId); // Add stream handler callback
    connection.onremovestream = evt => callbackRemoveStream(connection, evt); // Remove stream handler callback

    connections[partnerClientId] = connection; // Store away the connection based on username
    console.log('connection: ', connection); 
    //console.log('connection: ', JSON.stringify(connection));
    return connection;
}

const callbackIceCandidateShareScreen = (evt, connection, partnerClientId) => {
    console.log("WebRTC: Ice Candidate callback ShareScreen: ", partnerClientId);
    console.log("evt.candidate ShareScreen: ", evt.candidate);
    if (evt.candidate) {// Found a new candidate
        console.log('WebRTC: new ICE candidate ShareScreen');
        console.log("evt.candidate ShareScreen: ", evt.candidate);
        sendHubSignalShareScreen(JSON.stringify({ "candidate": evt.candidate }), partnerClientId);
    } else {
        // Null candidate means we are done collecting candidates.
        console.log('WebRTC: ICE candidate gathering complete ShareScreen');
        sendHubSignalShareScreen(JSON.stringify({ "candidate": null }), partnerClientId);
    }
}

const initializeConnectionShareScreen = (partnerClientId) => {
    console.log('WebRTC: Initializing connection ShareScreen...');
    console.log("Received Param for connection ShareScreen: ", partnerClientId);

    var connection = new RTCPeerConnection(peerConnectionConfig);
    //connection.iceConnectionState = evt => console.log("WebRTC: iceConnectionState", evt); //not triggering on edge
    //connection.iceGatheringState = evt => console.log("WebRTC: iceGatheringState", evt); //not triggering on edge
    //connection.ondatachannel = evt => console.log("WebRTC: ondatachannel", evt); //not triggering on edge
    //connection.oniceconnectionstatechange = evt => console.log("WebRTC: oniceconnectionstatechange", evt); //triggering on state change
    //connection.onicegatheringstatechange = evt => console.log("WebRTC: onicegatheringstatechange", evt); //triggering on state change
    //connection.onsignalingstatechange = evt => console.log("WebRTC: onsignalingstatechange", evt); //triggering on state change
    //connection.ontrack = evt => console.log("WebRTC: ontrack", evt);
    //connection.ontrack = event => {
    //    const track = event.track;
    //    const mid = event.transceiver.mid;
    //    console.log("WebRTC: ontrack", evt);
    //}
    connection.onicecandidate = evt => callbackIceCandidateShareScreen(evt, connection, partnerClientId); // ICE Candidate Callback
    //connection.onnegotiationneeded = evt => callbackNegotiationNeeded(connection, evt); // Negotiation Needed Callback
    connection.onaddstream = evt => callbackAddStream(connection, evt, partnerClientId); // Add stream handler callback
    connection.onremovestream = evt => callbackRemoveStream(connection, evt); // Remove stream handler callback

    connections[partnerClientId] = connection; // Store away the connection based on username
    console.log('connection ShareScreen: ', connection);
    //console.log('connection ShareScreen: ', JSON.stringify(connection));
    return connection;
}

sendHubSignal = (candidate, partnerClientId) => {
    console.log('candidate', candidate);
    console.log('SignalR: called sendhubsignal ', partnerClientId);
    wsconn.invoke('sendSignal', candidate, partnerClientId).catch(errorHandler);
};

wsconn.onclose(e => {
    if (e) {
        console.log("SignalR: closed with error.");
        console.log(e);
    }
    else {
        console.log("Disconnected");
    }
});

function SetShareScreen(isShare) {
    console.log('SetShareScreen....');
    wsconn.invoke('SetShareScreen', isShare);
}

// Hub Callback: Update User List
wsconn.on('updateUserList', (userList) => {
    $("#usersLength").text(userList.length);
    $('#usersdata li.user').remove();

    console.log('userList: ' + JSON.stringify(userList));

    $.each(userList, function (index) {
        var userIcon = '', status = '';
        if (userList[index].username === MySelf) {
            myConnectionId = userList[index].connectionId;
            userIcon = 'icon-employee';
            status = 'Me';
        }

        if (!userIcon) {
            userIcon = userList[index].inCall ? 'icon-smartphone-1' : 'icon-smartphone-1';
        }
        status = userList[index].inCall ? 'In Call' : 'Available';

        var listString = '<li class="list-group-item user" data-cid=' + userList[index].connectionId + ' data-username=' + userList[index].username + '>';
        listString += '<a href="#"><div class="username"> ' + userList[index].username + '</div>';
        listString += '<span class="helper ' + userIcon + '" data-callstatus=' + userList[index].inCall + '></span></a></li>';
        $('#usersdata').append(listString);

        var indexUser = angular.element(document.getElementById('kt_content')).scope().Users.findIndex(record => record.UserName === userList[index].username);

        if (indexUser >= 0) {
            if (angular.element(document.getElementById('kt_content')).scope().Users[indexUser].connectionId != undefined) {
                angular.element(document.getElementById('kt_content')).scope().Users[indexUser].connectionId = userList[index].connectionId;
            }
            else {
                var obj = { connectionId: '' };
                angular.forEach(angular.element(document.getElementById('kt_content')).scope().Users, function (eachObj) {
                    eachObj.connectionId = '';
                });
                //angular.element(document.getElementById('kt_content')).scope().Users[indexUser].push(obj);
                angular.element(document.getElementById('kt_content')).scope().Users[indexUser].connectionId = userList[index].connectionId;
            }
            if (!angular.element(document.getElementById('kt_content')).scope().$$phase) { angular.element(document.getElementById('kt_content')).scope().$apply(); }
        }
    });
});

// Hub Callback: Call Accepted
wsconn.on('callAccepted', (acceptingUser) => {
    console.log('SignalR: call accepted from: ' + JSON.stringify(acceptingUser) + '.  Initiating WebRTC call and offering my stream up...');

    // Callee accepted our call, let's send them an offer with our video stream
    initiateOffer(acceptingUser.connectionId, localStream); // Will use driver email in production
    // Set UI into call mode
    $('body').attr('data-mode', 'incall');
    $("#callstatus").text('In Call');
});

// Hub Callback: Call Declined
wsconn.on('callDeclined', (decliningUser, reason) => {
    // Back to an idle UI
    $("#callstatus").text('idle');

    console.log('SignalR: call declined from: ' + decliningUser.connectionId);

    // Let the user know that the callee declined to talk
    alertify.error(reason);
});

function AnswerCall(callingUser, acceptCall) {
    console.log('AnswerCall: ' + JSON.stringify(callingUser));
    //if (acceptCall)
    //    initializeUserMedia();
    wsconn.invoke('AnswerCall', acceptCall, callingUser).catch(err => console.log(err));
}

// Hub Callback: Incoming Call
wsconn.on('incomingCall', (callingUser) => {
    console.log('SignalR: incoming call from: ' + JSON.stringify(callingUser));


    // Ask if we want to talk
    angular.element(document.getElementById('kt_content')).scope().IncomingCall(callingUser);

    //alertify.confirm('Incoming Call', callingUser.username + ' is calling.  Do you want to chat?', function () {
    //    wsconn.invoke('AnswerCall', true, callingUser).catch(err => console.log(err));

    //    // So lets go into call mode on the UI
    //    $('body').attr('data-mode', 'incall');
    //    $("#callstatus").text('In Call');
    //}
    //, function () {
    //    wsconn.invoke('AnswerCall', false, callingUser).catch(err => console.log(err));
    //});

});

// Hub Callback: WebRTC Signal Received
wsconn.on('receiveSignal', (signalingUser, signal) => {
    console.log('WebRTC: receive signal ' + JSON.stringify(signalingUser));
    console.log(signalingUser);
    console.log('NewSignal', signal);
    newSignal(signalingUser.connectionId, signal);
});

wsconn.on('receiveSignalShareScreen', (signalingUser, signal) => {
    console.log('WebRTC: receive signal ShareScreen ' + JSON.stringify(signalingUser));
    console.log(signalingUser);
    console.log('NewSignal ShareScreen', signal);
    newSignalShareScreen(signalingUser.shareConnectionId, signal);
});

// Hub Callback: Call Ended
wsconn.on('callEnded', (signalingUser, signal) => {
    //console.log(signalingUser);
    //console.log(signal);

    console.log('SignalR: call with ' + signalingUser.connectionId + ' has ended: ' + signal);

    // Let the user know why the server says the call is over
    alertify.error(signal);

    // Close the WebRTC connection
    closeConnection(signalingUser.connectionId);

    // Set the UI back into idle mode
    $('body').attr('data-mode', 'idle');
    $("#callstatus").text('Idle');
});

sendHubSignalShareScreen = (candidate, partnerClientId) => {
    console.log('candidate ShareScreen', candidate);
    console.log('SignalR: called sendhubsignal ShareScreen: ' + partnerClientId);
    wsconn.invoke('sendSignalShareScreen', candidate, partnerClientId).catch(errorHandler);
};

const initiateOfferShareScreen = (partnerClientId, stream) => {
    console.log('WebRTC: called initiateoffer ShareScreen: ', partnerClientId);
    var connection = getConnectionShareScreen(partnerClientId); // // get a connection for the given partner
    console.log('initiate Offer stream ShareScreen: ', stream);
    //console.log("offer connection: ", connection);
    connection.addStream(stream);// add our audio/video stream
    console.log("WebRTC: Added local stream ShareScreen");

    connection.createOffer().then(offer => {
        console.log('WebRTC: created Offer ShareScreen: ');
        console.log('WebRTC: Description after offer ShareScreen: ', offer);
        connection.setLocalDescription(offer).then(() => {
            console.log('WebRTC: set Local Description ShareScreen: ');
            console.log('connection before sending offer ShareScreen ', connection);
            setTimeout(() => {
                console.log('sendHubSignalShareScreen: ', partnerClientId);
                sendHubSignalShareScreen(JSON.stringify({ "sdp": connection.localDescription }), partnerClientId);
            }, 10000);
        }).catch(err => console.error('WebRTC: Error while setting local description ShareScreen', err));
    }).catch(err => console.error('WebRTC: Error while creating offer ShareScreen', err));
}

var ShareScreenUser = {};

wsconn.on('NotifyShareScreen', (signalingUser, isShare) => {

    ShareScreenUser = signalingUser;
    console.log('NotifyShareScreen: call with ' + JSON.stringify(signalingUser));

    console.log('NotifyShareScreen: call with ' + signalingUser.connectionId + ' - myConnectionId: ' + myConnectionId);

    if (signalingUser.connectionId == myConnectionId) {
        console.log('NotifyShareScreen: call with ' + signalingUser.shareConnectionId + ' has share: ' + isShare);
        initiateOfferShareScreen(signalingUser.shareConnectionId, localScreenStream); // Will use driver email in production
    }
    else {
        console.log('NotifyShareScreen: call with ' + signalingUser.connectionId + ' has share: ' + isShare);
        initiateOfferShareScreen(signalingUser.connectionId, localScreenStream); // Will use driver email in production
    }
});

const initializeSignalR = () => {
    //wsconn.start().then(() => { console.log("SignalR: Connected"); askUsername(); }).catch(err => console.log(err));
    wsconn.start().then(() => { console.log("SignalR: Connected"); joinToChannel(); }).catch(err => console.log(err));
};

const joinToChannel = () => {
    wsconn.invoke("Join", MySelf).catch((err) => {
        consoleLogger(err);
        alertify.alert('<h4>Failed SignalR Connection</h4> We were not able to connect you to the signaling server.<br/><br/>Error: ' + JSON.stringify(err));
        //viewModel.Loading(false);
    });
};

const setUsername = (username) => {
    consoleLogger('SingnalR: setting username...');
    wsconn.invoke("Join", username).catch((err) => {
        consoleLogger(err);
        alertify.alert('<h4>Failed SignalR Connection</h4> We were not able to connect you to the signaling server.<br/><br/>Error: ' + JSON.stringify(err));
        //viewModel.Loading(false);
    });
    //WOWZA_STREAM_NAME = username;
    $("#upperUsername").text(username);
    $('div.username').text(username);
    initializeUserMedia();
};

const askUsername = () => {
    consoleLogger('SignalR: Asking username...');
    Username = MySelf;
    setUsername(Username);

    //alertify.prompt('Select a username', 'What is your name?', '', (evt, Username) => {
    //    if (Username !== '')
    //        setUsername(Username);
    //    else
    //        generateRandomUsername();

    //}, () => {
    //    generateRandomUsername();
    //});
};

const generateRandomUsername = () => {
    consoleLogger('SignalR: Generating random username...');
    let username = 'User ' + Math.floor((Math.random() * 10000) + 1);
    alertify.success('You really need a username, so we will call you... ' + username);
    setUsername(username);
};

const errorHandler = (error) => {
    //if (error.message)
    //    alertify.alert('<h4>Error Occurred</h4></br>Error Info: ' + JSON.stringify(error.message));
    //else
    //    alertify.alert('<h4>Error Occurred</h4></br>Error Info: ' + JSON.stringify(error));

    consoleLogger(error);
};

const consoleLogger = (val) => {
    if (isDebugging) {
        console.log(val);
    }
};
