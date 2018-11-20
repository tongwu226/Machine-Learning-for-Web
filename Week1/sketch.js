// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam Image Classification using MobileNet and p5.js
This example uses a callback pattern to create the classifier
=== */

let classifier;
let video;

function setup() {
  noCanvas();
  // Create a camera input
  video = createCapture(VIDEO);
  // Initialize the Image Classifier method with MobileNet and the video as the second argument
  classifier = ml5.imageClassifier('MobileNet', video, modelReady);
}

function modelReady() {
  // Change the status of the model once its ready
  select('#status').html(' ');
  // Call the classifyVideo function to start classifying the video
  classifyVideo();
}

// Get a prediction for the current video frame
function classifyVideo() {
  classifier.predict(gotResult);
}

// When we get a result
// function gotResult(err, results) {
//   // The results are in an array ordered by probability.
//   select('#result').html(results[0].className);
//   select('#probability').html(nf(results[0].probability, 0, 2));
//   classifyVideo();
// }

function gotResult(err, results) {
  // The results are in an array ordered by probability.
  //select('#result').html(results[0].className);
  //select('#probability').html(nf(results[0].probability, 0, 2));

  if (results[0].className == "iPod") {
    console.log('It is a phone');
    select('#message').html('I am losing you.');
    zoom_small();


  } else {
    select('#message').html('I am glad you are focused.');
    zoom_big();

  }
  // select('#result').html(results[0].className);
  // select('#probability').html(nf(results[0].probability, 0, 2));
  classifyVideo();
}
var num = 1.0;

function zoom_small() {
  document.body.style.zoom = num;
  num = num * 0.93;
  console.log("smaller: "+num)
}
function zoom_big(){
  document.body.style.zoom = num;
  if (num <1){
  num = num * 1.03;}
  else {
    num = 1;
  }
  console.log("bigger: "+num);

}
