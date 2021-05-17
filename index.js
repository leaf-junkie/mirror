// The face detection does not work on all browsers and operating systems.
// If you are getting a `Face detection service unavailable` error or similar,
// it's possible that it won't work for you at the moment.

const video = document.querySelector('.webcam');
const canvas = document.querySelector('.video');
const context = canvas.getContext('2d');
const faceCanvas = document.querySelector('.face');
const faceContext = canvas.getContext('2d');
const faceDetector = new window.FaceDetector();
console.log(video, canvas, faceCanvas, faceDetector);

async function populateVideo() {
  const stream = await navigator.mediaDevices.getUserMedia({
    // video: { width: 1280, height: 720}
    video: { width: 1920, height: 1080}
  })
  video.srcObject = stream;
  await video.play();

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  faceCanvas.width = video.videoWidth;
  faceCanvas.height = video.videoHeight;
}

async function detectFace() {
  // pass ref to video, image, or canvas
  const faces = await faceDetector.detect(video);
  faces.forEach(drawFace);
  requestAnimationFrame(detectFace);
}

function drawFace(face) {
  const { width, height, top, left } = face.boundingBox;
  console.log({width, height, top, left});
}

populateVideo().then(detectFace);