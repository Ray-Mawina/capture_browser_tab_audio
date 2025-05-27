let mediaRecorder;
let recordedChunks = [];
let webmUrl = null;

async function startCapture() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      alert("No audio track found. Be sure to select a tab with audio.");
      return;
    }

    const audioStream = new MediaStream(audioTracks);
    mediaRecorder = new MediaRecorder(audioStream);
    recordedChunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "audio/webm" });
      webmUrl = URL.createObjectURL(blob);

      // Enable playback
      document.getElementById("audioPlayer").src = webmUrl;
      document.getElementById("playBtn").disabled = false;

      // Trigger download
    };

    mediaRecorder.start();
    document.getElementById("stopBtn").disabled = false;
    document.getElementById("startBtn").disabled = true;
    console.log("Recording started...");
  } catch (err) {
    alert("Error: " + err.message);
    console.error(err);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    document.getElementById("stopBtn").disabled = true;
    document.getElementById("startBtn").disabled = false;
  }
}

function playRecording() {
  if (webmUrl) {
    const audio = document.getElementById("audioPlayer");
    audio.src = webmUrl;
    audio.play();
  }
}
