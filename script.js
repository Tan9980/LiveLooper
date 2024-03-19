let mediaRecorder;
let recordedChunks = [];
let isRecording = false;
let audioContext = new AudioContext();
let audioTracks = [];

document.getElementById('recordButton').addEventListener('click', () => {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
});

document.getElementById('playAllButton').addEventListener('click', () => {
    audioTracks.forEach(audio => {
        if (audio.loop) {
            audio.play();
        }
    });
});

function startRecording() {
    isRecording = true;
    recordedChunks = [];
    document.getElementById('recordButton').innerText = "Stop";
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = (e) => {
                recordedChunks.push(e.data);
            };
            mediaRecorder.onstop = () => {
                isRecording = false;
                document.getElementById('recordButton').innerText = "Record";
                const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const audioElement = new Audio(audioUrl);
                audioElement.controls = true;
                audioElement.classList.add('audioItem');
                const loopCheckbox = document.createElement('input');
                loopCheckbox.type = "checkbox";
                loopCheckbox.classList.add('loopCheckbox');
                loopCheckbox.addEventListener('change', () => {
                    audioElement.loop = loopCheckbox.checked;
                });
                const loopLabel = document.createElement('label');
                loopLabel.innerText = "Enable Loop";
                loopLabel.appendChild(loopCheckbox);
                const audioContainer = document.createElement('div');
                audioContainer.classList.add('audioContainer');
                audioContainer.appendChild(audioElement);
                audioContainer.appendChild(loopLabel);
                document.getElementById('audioSection').appendChild(audioContainer);
                audioTracks.push(audioElement);
            };
            mediaRecorder.start();
        })
        .catch(err => console.error('Error starting recording:', err));
}

function stopRecording() {
    mediaRecorder.stop();
}
