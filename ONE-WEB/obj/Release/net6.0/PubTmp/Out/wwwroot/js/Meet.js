var localCamStream, mediaRecorder, screen;
var localScreenStream, screenRecorder, recordedScreen;
var recordedBlobs;
var flagStreaming = false;
var mediaWrapperDiv = document.getElementById("mediaWrapper");

const codecPreferences = document.querySelector('#codecPreferences');

const errorMsgElement = document.querySelector('span#errorMsg');
const recordedVideo = document.querySelector('video#recorded');
const recordButton = document.querySelector('button#record');
recordButton.addEventListener('click', () => {
    if (recordButton.textContent.trim() === 'Start Recording') {
        startRecording();
    } else {
        stopRecording();
        recordButton.textContent = 'Start Recording';
        playButton.disabled = false;
        downloadButton.disabled = false;
        codecPreferences.disabled = false;
    }
});

const playButton = document.querySelector('button#play');
playButton.addEventListener('click', () => {
    const mimeType = codecPreferences.options[codecPreferences.selectedIndex].value.split(';', 1)[0];
    const superBuffer = new Blob(recordedBlobs, { type: mimeType });
    recordedVideo.src = null;
    recordedVideo.srcObject = null;
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
    recordedVideo.controls = true;
    recordedVideo.play();
});

const downloadButton = document.querySelector('button#download');
downloadButton.addEventListener('click', () => {
    const blob = new Blob(recordedBlobs, { type: 'video/webm' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
});

function handleDataAvailable(event) {
    //console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);

        //var stream = event.data;
        //counter = counter + 1;
        //var blob = new Blob(stream, { type: 'video/webm' });
        //var xhr = new XMLHttpRequest();
        //xhr.onload = function () {

        //}
        //xhr.open("POST", "/Meet/MultiUpload?id=" + counter.toString() + "&fileName=cam.mp4", false);
        //xhr.send(blob);
    }
}

function getSupportedMimeTypes() {
    const possibleTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm;codecs=h264,opus',
        'video/mp4;codecs=h264,aac',
        'video/webm;codecs=av01,opus',
    ];
    return possibleTypes.filter(mimeType => {
        return MediaRecorder.isTypeSupported(mimeType);
    });
}

var refreshIntervalMediaRecorder;

function startRecording() {
    startVideo = 0;
    recordedBlobs = [];
    const mimeType = codecPreferences.options[codecPreferences.selectedIndex].value;
    const options = { mimeType };

    try {
        mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
        console.error('Exception while creating MediaRecorder:', e);
        errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
        return;
    }

    //console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
    recordButton.textContent = 'Stop Recording';
    playButton.disabled = true;
    downloadButton.disabled = true;
    codecPreferences.disabled = true;
    mediaRecorder.onstop = (event) => {
        //console.log('Recorder stopped: ', event);
        //console.log('Recorded Blobs: ', recordedBlobs);
    };
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    //console.log('MediaRecorder started', mediaRecorder);

    refreshIntervalMediaRecorder = window.setInterval(function () {
        mediaRecorder.requestData();
        //StreamingStream(0, end);
        StreamingVideo();
    }, 100);

    counter = 0;
    flagStreaming = true;
    //StreamingStream(0, end);
}

function stopRecording() {
    flagStreaming = false;
    mediaRecorder.stop();
    clearInterval(refreshIntervalMediaRecorder);
    StreamingVideo();
}

function handleSuccess(stream) {
    recordButton.disabled = false;
    console.log('getUserMedia() got stream:', stream);
    window.stream = stream;

    const gumVideo = document.querySelector('video#gum');
    gumVideo.srcObject = stream;

    getSupportedMimeTypes().forEach(mimeType => {
        const option = document.createElement('option');
        option.value = mimeType;
        option.innerText = option.value;
        codecPreferences.appendChild(option);
    });
    codecPreferences.disabled = false;
}

async function init(constraints) {
    try {
        localCamStream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(localCamStream);
    } catch (e) {
        console.error('navigator.getUserMedia error:', e);
        errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
    }
}

document.querySelector('button#start').addEventListener('click', async () => {
    document.querySelector('button#start').disabled = true;
    const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
    const constraints = {
        audio: {
            echoCancellation: { exact: hasEchoCancellation }
        },
        video: {
            width: 1280, height: 720
        }
    };
    console.log('Using media constraints:', constraints);
    await init(constraints);
});

async function startCamStream() {
    const constraints = {
        audio: {
            echoCancellation: { exact: true }
        },
        video: true
    };
    await init(constraints);
}

async function stopStreams() {
    recordButton.disabled = true;
    [
        ...(localCamStream ? localCamStream.getTracks() : [])
    ].map((track) => track.stop());
    localCamStream = null;
    document.querySelector('button#start').disabled = false;
    document.querySelector('video#gum').load();

    stopScreenShare();
}

async function startScreenShare() {
    localScreenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
    });

    screenRecorder = new MediaRecorder(localScreenStream);

    if (localScreenStream) {
        //screen = await attachToDOM("justScreenShare", localScreenStream);
        document.getElementById('justScreenShare').srcObject = localScreenStream;
    }
}

async function stopScreenShare() {
    //localScreenStream = null;

    // Stop the stream.
    localScreenStream.getTracks().forEach(track => track.stop());
    //video.srcObject = null;
    document.querySelector('video#justScreenShare').load();
}

function handleDataAvailable_ScreenShare(event) {
    if (event.data && event.data.size > 0) {
        recordedScreen.push(event.data);
    }
}

async function StartRecordingScreenShare() {
    recordedScreen = [];
    screenRecorder.ondataavailable = handleDataAvailable_ScreenShare;
    screenRecorder.start();

    //screenRecorder.start();
    //screenRecorder.addEventListener("dataavailable", async (event) => {
    //    // Write chunks to the file.
    //    await writable.write(event.data);
    //    if (recorder.state === "inactive") {
    //        // Close the file when the recording stops.
    //        await writable.close();
    //    }
    //});
}

async function DownloadScreenShare() {
    const blob = new Blob(recordedScreen, { type: 'video/webm' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'ScreenShare.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}

//let localCamStream,
//    localScreenStream,
//    localOverlayStream,
//    rafId,
//    cam,
//    screen,
//    mediaRecorder,
//    audioContext,
//    audioDestination;
//let mediaWrapperDiv = document.getElementById("mediaWrapper");
//let startWebcamBtn = document.getElementById("startWebcam");
//let startScreenShareBtn = document.getElementById("startScreenShare");
//let mergeStreamsBtn = document.getElementById("mergeStreams");
//let startRecordingBtn = document.getElementById("startRecording");
//let stopRecordingBtn = document.getElementById("stopRecording");
//let stopAllStreamsBtn = document.getElementById("stopAllStreams");
//let canvasElement = document.createElement("canvas");
//let canvasCtx = canvasElement.getContext("2d");
//let encoderOptions = { mimeType: " video/ webm; codecs = vp9" };
//let recordedChunks = [];
//let audioTracks = [];

//startWebcamBtn.addEventListener("click", startWebcamFn);

//async function startWebcamFn() {
//    localCamStream = await navigator.mediaDevices.getUserMedia({
//        video: true,
//        audio: {
//            deviceId: { ideal: " communications" }
//        }
//    });
//    if (localCamStream) {
//        cam = await attachToDOM("justWebcam", localCamStream);
//    }
//}

async function attachToDOM(id, stream) {
    let videoElem = document.createElement("video");
    videoElem.id = id;
    videoElem.width = 640;
    videoElem.height = 360;
    videoElem.autoplay = true;
    videoElem.setAttribute("playsinline", true);
    videoElem.srcObject = new MediaStream(stream.getTracks());
    mediaWrapperDiv.appendChild(videoElem);
    return videoElem;
}

const leftVideo = document.getElementById('gum');

var bytesPerChunk = 1048576;
var counter = 0;
var end = bytesPerChunk;

function StreamingWebcam() {
    StreamingStream(0, end);
}

var startVideo = 0;

function StreamingVideo() {
    const blob = new Blob(recordedBlobs, { type: 'video/webm' });
    var size = blob.size;
    if (size > 0) {
        
        var end = startVideo + bytesPerChunk;
        if (end > size) {
            end = size;
        }

        if (end > startVideo) {
            counter = counter + 1;

            var chunk = blob.slice(startVideo, end);
            startVideo = end;

            var xhr = new XMLHttpRequest();
            xhr.onload = function () {

            }
            xhr.open("POST", "/Meet/MultiUpload?id=" + counter.toString() + "&fileName=cam.mp4", false);
            xhr.send(chunk);
        }
        
    }
}

function StreamingStream(start, end) {
    counter = counter + 1;
    //let stream;
    //const fps = 0;
    //if (leftVideo.captureStream) {
    //    stream = leftVideo.captureStream(fps);
    //} else if (leftVideo.mozCaptureStream) {
    //    stream = leftVideo.mozCaptureStream(fps);
    //} else {
    //    console.log('Stream capture is not supported');
    //    stream = null;
    //}
    //console.log(stream);
    const blob = new Blob(recordedBlobs, { type: 'video/webm' });
    var size = blob.size;
    console.log('blob.size: ', size);
    //console.log('start 1: ', start);
    //console.log('end 1: ', end);
    //var end = bytesPerChunk;
    //if (end > size) {
    //    end = size;
    //}

    //console.log('start 2: ', start);
    //console.log('end 2: ', end);

    //var chunk = blob.slice(start, end);

    //if (end > 0) {
    //    //var chunk = blob;
    //    var xhr = new XMLHttpRequest();
    //    xhr.onload = function () {

    //    }
    //    xhr.open("POST", "/Meet/MultiUpload?id=" + counter.toString() + "&fileName=cam.mp4", false);
    //    xhr.send(chunk);
    //}

    //if (flagStreaming)//(size > end)
    //{
    //    //console.log('blob.size: ', size);
    //    //console.log('end: ', end);
    //    start = end;
    //    end = end + bytesPerChunk;
    //    StreamingStream(start, end);
    //}
}

var progressBarStart = function () {
    $("#progressbar_container").show();
}

var progressBarUpdate = function (percentage) {
    $('#progressbar_label').html(percentage + "%");
    $("#progressbar").width(percentage + "%");
}

var progressBarComplete = function () {
    $("#progressbar_container").fadeOut(500);
}

var file;

$('#fileInput').change(function (e) {
    file = e.target.files[0];
});

var uploadCompleted = function () {
    var formData = new FormData();
    formData.append('fileName', file.name);
    formData.append('completed', true);

    var xhr2 = new XMLHttpRequest();
    xhr2.onload = function () {
        progressBarUpdate(100);
        progressBarComplete();
    }
    xhr2.open("POST", "/Meet/UploadComplete?fileName=" + file.name + "&complete=" + 1, true);
    xhr2.send(formData);
}

var multiUpload = function (count, counter, blob, completed, start, end, bytesPerChunk) {
    counter = counter + 1;
    if (counter <= count) {
        var chunk = blob.slice(start, end);
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            start = end;
            end = start + bytesPerChunk;
            if (count == counter) {
                uploadCompleted();
            } else {
                var percentage = Math.floor((counter / count) * 100);
                progressBarUpdate(percentage);
                multiUpload(count, counter, blob, completed, start, end, bytesPerChunk);
            }
        }
        xhr.open("POST", "/Meet/MultiUpload?id=" + counter.toString() + "&fileName=" + file.name, true);
        xhr.send(chunk);
    }
}

$("#VideoDiv").on("click", "#btnUpload", function () {
    var blob = file;
    var bytesPerChunk = 1048576;
    var size = blob.size;

    var start = 0;
    var end = bytesPerChunk;
    var completed = 0;
    var count = size % bytesPerChunk == 0 ? size / bytesPerChunk : Math.floor(size / bytesPerChunk) + 1;
    var counter = 0;
    progressBarStart();
    multiUpload(count, counter, blob, completed, start, end, bytesPerChunk);
});

app.controller('myController', function ($scope, $filter, $http, $timeout, Notification) {
    
});