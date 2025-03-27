/**
 * Record script.
 */


let mediaRecorder;
let audioChunks = [];
let timerInterval;
let secondsElapsed = 0;

const startButton = document.getElementById('startRecording');
const stopButton = document.getElementById('stopRecording');
const downloadButton = document.getElementById('downloadButton');
const status = document.getElementById('status');
const audioPlayback = document.getElementById('audioPlayback');
const timerDisplay = document.getElementById('timer');

/**
 * This function update the timer.
 */
function updateTimer() {
    secondsElapsed++;
    timerDisplay.textContent = "Duration: " + secondsElapsed + " second(s)";
}

startButton.addEventListener('click', async () => {
    audioChunks = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const options = {
        mimeType: 'audio/webm',
        bitsPerSecond: parseInt(document.getElementById('audioQuality').value)
    };
    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener('stop', () => {
        clearInterval(timerInterval);
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayback.src = audioUrl;
        downloadButton.disabled = false;

        downloadButton.onclick = () => {
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = audioUrl;
            a.download = 'recording.webm';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        status.textContent = "Recording finished. Click to listen or download.";
    });

    mediaRecorder.start();
    startButton.disabled = true;
    stopButton.disabled = false;
    downloadButton.disabled = true;
    status.textContent = "Recording in progress...";
    secondsElapsed = 0;
    timerDisplay.textContent = "Duration: 0 second(s)";
    timerInterval = setInterval(updateTimer, 1000);
});

stopButton.addEventListener('click', () => {
    mediaRecorder.stop();
    startButton.disabled = false;
    stopButton.disabled = true;
});
