const codecPreferences = document.querySelector('#codecPreferences');
let recordedBlobs = [];
let mediaRecorder;
var refreshIntervalMediaRecorder;
let screenRecorder, recordedScreen;

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

function handleDataAvailable(event) {
    //console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

async function startScreenShare() {
    console.log('startScreenShare: ');
    //localScreenStream = await navigator.mediaDevices.getDisplayMedia({
    //    video: true,
    //    audio: false
    //});

    webrtcConstraints.video = true;
    //localScreenStream = await navigator.mediaDevices.getUserMedia(webrtcConstraints);
    //screenRecorder = new MediaRecorder(localScreenStream);

    initializeUserMediaShareScreen();

    setTimeout(() => {
        if (localScreenStream) {
            //document.getElementById('justScreenShare').srcObject = localScreenStream;
            console.log('SetShareScreen...');
            SetShareScreen(true);
        }
    }, 5000);

    //localScreenStream.getVideoTracks()[0].addEventListener('ended', () => {
    //    console.log('The user has ended sharing the screen');
    //    SetShareScreen(false);
    //});
}

app.controller('myController', function ($scope, $filter, $http, $timeout, Notification) {
    $scope.PartnerUser = {};
    $scope.IsCalling = false;
    $scope.MySelf = MySelf;
    $scope.CallingUser = {};

    $scope.PlayRing = function () {
        const audio = document.querySelector("audio");
        audio.volume = 0.5;
        audio.play();
    };

    $scope.StopRing = function () {
        const audio = document.querySelector("audio");
        audio.pause();
    };

    $scope.ChooseUser = function (x) {
        $scope.PartnerUser = x;
    };

    $scope.CallUser = function (isVideo) {
        //initializeUserMedia();
        console.log("Calling User...");
        console.log("PartnerUser: " + JSON.stringify($scope.PartnerUser));
        console.log("$scope.PartnerUser.connectionId: " + $scope.PartnerUser.connectionId);
        
        var cid = $scope.PartnerUser.connectionId;
        $scope.IsCalling = true;
        CallingUser(cid, isVideo);
    };

    $scope.HangUp = function (cid) {
        $scope.IsCalling = false;
        HangUp();
        document.querySelector('video#videoMySelf').load();
        document.querySelector('video#videoPartner').load();
    };

    $scope.IncomingCall = function (callingUser) {
        
        $scope.PartnerUser = $scope.Users.find(o => o.UserName === callingUser.username); 

        $scope.CallingUser = callingUser;
        $("#Popup_CallingUser").toggle();
        $scope.PlayRing();

        if (!$scope.$$phase) { $scope.$apply(); }
    };

    $scope.AnswerCall = function (acceptCall) {
        $("#Popup_CallingUser").hide();
        if (acceptCall)
            $scope.IsCalling = true;

        AnswerCall($scope.CallingUser, acceptCall);
        $scope.StopRing();
    };

    $scope.StopCall = function () {
        $("#Popup_CallingUser").modal('toggle');
        stopUserMedia();
        document.querySelector('video#videoMySelf').load();
        document.querySelector('video#videoPartner').load();
    };

    var refreshIntervalTime;
    $scope.StartTime = function () {
        document.getElementById("timer").textContent = "00:00:00";
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        
        refreshIntervalTime = setInterval(function () {
            if (seconds < 59) {
                seconds++;
                document.getElementById("timer").textContent =
                    ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
            } else if (minutes < 59) {
                seconds = 0;
                minutes++;
                document.getElementById("timer").textContent =
                    ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
            } else {
                hours++;
                document.getElementById("timer").textContent =
                    ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
            }
        }, 1000);
    };

    $scope.StopTime = function () {
        document.getElementById("timer").textContent = "";
        clearInterval(refreshIntervalTime);
    };

    $scope.ClearTime = function () {
        document.getElementById("timer").textContent = "";
    };

    $scope.FlagStartRecording = false;
    $scope.IsDownload = false;

    $scope.StartRecording = function () {
        if (!$scope.FlagStartRecording) {
            $scope.IsDownload = false;
            getSupportedMimeTypes().forEach(mimeType => {
                const option = document.createElement('option');
                option.value = mimeType;
                option.innerText = option.value;
                codecPreferences.appendChild(option);
            });

            $scope.FlagStartRecording = true;
            $scope.StartTime();

            recordedBlobs = [];
            const mimeType = codecPreferences.options[codecPreferences.selectedIndex].value;
            const options = { mimeType };

            try {
                mediaRecorder = new MediaRecorder(window.stream, options);
            } catch (e) {
                console.error('Exception while creating MediaRecorder:', e);
                return;
            }

            //console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
            
            codecPreferences.disabled = true;
            mediaRecorder.onstop = (event) => {
                //console.log('Recorder stopped: ', event);
                //console.log('Recorded Blobs: ', recordedBlobs);
                $scope.IsDownload = true;
                if (!$scope.$$phase) { $scope.$apply(); }
            };
            mediaRecorder.ondataavailable = handleDataAvailable;
            mediaRecorder.start();
            //console.log('MediaRecorder started', mediaRecorder);

            refreshIntervalMediaRecorder = window.setInterval(function () {
                mediaRecorder.requestData();
            }, 100);
        }
        else {
            $scope.FlagStartRecording = false;
            $scope.StopTime();
            mediaRecorder.stop();
            clearInterval(refreshIntervalMediaRecorder);
        }
        
    };

    $scope.DownloadCam = function () {
        const blob = new Blob(recordedBlobs, { type: 'video/mp4' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.mp4';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    };

    $scope.GetUsers = function (page) {
        
        var input =
        {
            Page: page, PageSize: 1000, Status: -1
        };

        $.ajax({
            type: 'POST',
            url: '/User/GetUsers',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                $scope.Users = data;
                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.Users = [];
            }
        });

    };

    $scope.GetUsers(1);
});