const p5 = require("p5");

let faceapi;
let detections;
let width = 400;
let height = 300;

const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
    Mobilenetv1Model: 'models',
    FaceLandmarkModel: 'models',
    FaceRecognitionModel: 'models',
    FaceExpressionModel: 'models',
};

const p5draw = (p) => {

    let p5video;

    function drawBox(detections) {
        detections.forEach((detection) => {
            const alignedRect = detection.alignedRect;

            p.noFill();
            p.stroke(255, 255, 255);
            p.strokeWeight(2);
            p.rect(
                alignedRect._box._x,
                alignedRect._box._y,
                alignedRect._box._width,
                alignedRect._box._height,
            );
        });
    }

    function drawLandmarks(detections) {
        p.noFill();
        p.stroke(161, 95, 251)
        p.strokeWeight(2)

        for(let i = 0; i < detections.length; i++){
            const mouth = detections[i].parts.mouth; 
            const nose = detections[i].parts.nose;
            const leftEye = detections[i].parts.leftEye;
            const rightEye = detections[i].parts.rightEye;
            const rightEyeBrow = detections[i].parts.rightEyeBrow;
            const leftEyeBrow = detections[i].parts.leftEyeBrow;

            drawPart(mouth, true);
            drawPart(nose, false);
            drawPart(leftEye, true);
            drawPart(leftEyeBrow, false);
            drawPart(rightEye, true);
            drawPart(rightEyeBrow, false);

        }
    }

    function drawPart(feature, closed) {
        p.beginShape();
        for(let i = 0; i < feature.length; i++){
            const x = feature[i]._x
            const y = feature[i]._y
            p.vertex(x, y)
        }
        
        if(closed === true){
            p.endShape(p.CLOSE);
        } else {
            p.endShape();
        }
    }

    p.setup = () => {
        p.createCanvas(width, height);
        p.background(255);

        p5video = p.createCapture(p.VIDEO);
        p5video.size(width, height);
        p5video.hide();

        faceapi = ml5.faceApi(p5video, detection_options, modelReady);
    }

    p.draw = () => {
        p.image(p5video, 0, 0, p.width, p.height);

        if (detections) {
            drawBox(detections);
            drawLandmarks(detections);
        }
    }
}

function setup() {
    const myp5 = new p5(p5draw, "main");
}

function modelReady() {
    console.log("model ready!");
    faceapi.detect(gotResults);
}

function gotResults(err, results) {
    if (err) {
        console.log(err);
        return;
    }

    detections = results;
    faceapi.detect(gotResults);
}

// Calls the setup function when the page is loaded
window.addEventListener("DOMContentLoaded", setup);
