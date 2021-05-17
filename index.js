// The face detection does not work on all browsers and operating systems.
// If you are getting a `Face detection service unavailable` error or similar,
// it's possible that it won't work for you at the moment.

const video = document.querySelector('.webcam');
const canvas = document.querySelector('.video');
const context = canvas.getContext('2d');
const faceCanvas = document.querySelector('.face');
const faceContext = faceCanvas.getContext('2d');
const faceDetector = new window.FaceDetector();
const SIZE = 10;
const SCALE = 1.35;
// console.log(video, canvas, faceCanvas, faceDetector);

async function populateVideo() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 1280, height: 720}
    // video: { width: 1920, height: 1080}
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
  faces.forEach(censor);
  requestAnimationFrame(detectFace);
}

function drawFace(face) {
  const { width, height, top, left } = face.boundingBox;
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.strokeStyle = '#000000';
  context.lineWidth = 2;
  context.strokeRect(left, top, width, height);
}

function censor({ boundingBox: face }) {
  faceContext.imageSmoothingEnabled = false;
  faceContext.clearRect(0, 0, faceCanvas.width, faceCanvas.height)
  // decrease face size 
  faceContext.drawImage(
    video,    // Where source comes from
    face.x,   // Where to start source pull
    face.y,        
    face.width,
    face.height,  
    face.x,   // Where to start drawing
    face.y,       
    SIZE,   
    SIZE   
  );

  const width = face.width * SCALE;
  const height = face.width * SCALE;

  // scale small image back up
  faceContext.drawImage(
    faceCanvas,
    face.x,
    face.y,
    SIZE,
    SIZE,
    face.x - (width - face.width) / 2, 
    face.y - (height - face.height) / 2, 
    width,
    height
  );
}

populateVideo().then(detectFace);