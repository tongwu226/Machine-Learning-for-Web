// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
KNN Classification on Webcam Images with mobileNet. Built with p5.js
=== */
let video;
// Create a KNN classifier
const knnClassifier = ml5.KNNClassifier();
// Create a featureExtractor that can extract the already learned features from MobileNet
const featureExtractor = ml5.featureExtractor('MobileNet', modelReady);

// = p5.side
let capture;
let xloc, yloc;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create a video element
  capture = createCapture(VIDEO);
  // Append it to the videoContainer DOM element
  capture.parent('videoContainer');
  //locate video
  xloc = width/2;
  yloc = height/2;

  // Create the UI buttons
  createButtons();
}
function draw(){
  background(255);
  push();
  translate(xloc, yloc); // move to far corner
  image(capture, 0,0,width/5, width * capture.height / capture.width/5);
  pop();
}
function modelReady(){
  select('#status').html('FeatureExtractor(mobileNet model) Loaded')
}

// Add the current frame from the video to the classifier
function addExample(label) {
  // Get the features of the input video
  const features = featureExtractor.infer(capture);
  // You can also pass in an optional endpoint, defaut to 'conv_preds'
  // const features = featureExtractor.infer(video, 'conv_preds');
  // You can list all the endpoints by calling the following function
  // console.log('All endpoints: ', featureExtractor.mobilenet.endpoints)

  // Add an example with a label to the classifier
  knnClassifier.addExample(features, label);
  updateExampleCounts();
}

// Predict the current frame.
function classify() {
  // Get the total number of classes from knnClassifier
  const numClasses = knnClassifier.getNumClasses();
  if (numClasses <= 0) {
    console.error('There is no examples in any class');
    return;
  }
  // Get the features of the input video
  const features = featureExtractor.infer(capture);

  // Use knnClassifier to classify which class do these features belong to
  // You can pass in a callback function `gotResults` to knnClassifier.classify function
  knnClassifier.classify(features, gotResults);
  // You can also pass in an optional K value, K default to 3
  // knnClassifier.classify(features, 3, gotResults);

  // You can also use the following async/await function to call knnClassifier.classify
  // Remember to add `async` before `function predictClass()`
  // const res = await knnClassifier.classify(features);
  // gotResults(null, res);
}

// A util function to create UI buttons
function createButtons() {
  // When the A button is pressed, add the current frame
  // from the video with a label of "Left" to the classifier
  buttonA = select('#addClassLeft');
  buttonA.mousePressed(function() {
    addExample('Left');
  });

  // When the B button is pressed, add the current frame
  // from the video with a label of "Right" to the classifier
  buttonB = select('#addClassRight');
  buttonB.mousePressed(function() {
    addExample('Right');
  });

  // When the C button is pressed, add the current frame
  // from the video with a label of "Up" to the classifier
  buttonC = select('#addClassUp');
  buttonC.mousePressed(function() {
    addExample('Up');
  });

  // When the D button is pressed, add the current frame
  // from the video with a label of "Down" to the classifier
  buttonD = select('#addClassDown');
  buttonD.mousePressed(function() {
    addExample('Down');
  });

  // When the E button is pressed, add the current frame
  // from the video with a label of "Down" to the classifier
  buttonE = select('#addClassStop');
  buttonE.mousePressed(function() {
    addExample('Stop');
  });

  // Reset buttons
  resetBtnA = select('#resetLeft');
  resetBtnA.mousePressed(function() {
    clearClass('Left');
  });

  resetBtnB = select('#resetRight');
  resetBtnB.mousePressed(function() {
    clearClass('Right');
  });

  resetBtnC = select('#resetUp');
  resetBtnC.mousePressed(function() {
    clearClass('Up');
  });

  resetBtnD = select('#resetDown');
  resetBtnD.mousePressed(function() {
    clearClass('Down');
  });

  resetBtnE = select('#resetStop');
  resetBtnE.mousePressed(function() {
    clearClass('Stop');
  });

  // Predict button
  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(classify);

  // Clear all classes button
  buttonClearAll = select('#clearAll');
  buttonClearAll.mousePressed(clearAllClasses);

  // Load saved classifier dataset
  buttonSetData = select('#load');
  buttonSetData.mousePressed(loadDataset);

  // Get classifier dataset
  buttonGetData = select('#save');
  buttonGetData.mousePressed(saveDataset);
}

// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }

  if (result.confidencesByLabel) {
    const confideces = result.confidencesByLabel;
    // result.label is the label that has the highest confidence
    if (result.label) {
      select('#result').html(result.label);
      select('#confidence').html(`${confideces[result.label] * 100} %`);
      if(result.label == "Left"){
        xloc = xloc- 5 ;
      }
      else if (result.label =="Right"){
        xloc = xloc + 5;
      }
      else if (result.label =="Up"){
        yloc = yloc-5;
      }
      else if (result.label == "Down"){
        yloc = yloc + 5;
      }
      else if (result.label == "Stop"){
        xloc = width/2;
        yloc = height/2;
      }
    }

    select('#confidenceLeft').html(`${confideces['Left'] ? confideces['Left'] * 100 : 0} %`);
    select('#confidenceRight').html(`${confideces['Right'] ? confideces['Right'] * 100 : 0} %`);
    select('#confidenceUp').html(`${confideces['Up'] ? confideces['Up'] * 100 : 0} %`);
    select('#confidenceDown').html(`${confideces['Down'] ? confideces['Down'] * 100 : 0} %`);
    select('#confidenceStop').html(`${confideces['Stop'] ? confideces['Stop'] * 100 : 0} %`);
  }

  classify();
}

// Update the example count for each class
function updateExampleCounts() {
  const counts = knnClassifier.getClassExampleCountByLabel();

  select('#exampleLeft').html(counts['Left'] || 0);
  select('#exampleRight').html(counts['Right'] || 0);
  select('#exampleUp').html(counts['Up'] || 0);
  select('#exampleDown').html(counts['Down'] || 0);
    select('#exampleStop').html(counts['Stop'] || 0);
}

// Clear the examples in one class
function clearClass(classLabel) {
  knnClassifier.clearClass(classLabel);
  updateExampleCounts();
}

// Clear all the examples in all classes
function clearAllClasses() {
  knnClassifier.clearAllClasses();
  updateExampleCounts();
}

// Save dataset as myKNNDataset.json
function saveDataset() {
  knnClassifier.saveDataset('myKNNDataset');
}

// Load dataset to the classifier
function loadDataset() {
  knnClassifier.loadDataset('./myKNNDataset.json', updateExampleCounts);
}
