
let video = document.getElementById("myVideo");
let canvas = document.getElementById("myCanvas");

let canvasWidth = 1000;
let canvasHeight = 1000;

let particels = [];


let faktor_x = 1;
let faktor_y = 1;

let singlePose = undefined;


let setupPoseNet = () => {

    if (video == undefined) {
        video = document.getElementById("myVideo");
    }

    faktor_x = canvas.clientWidth / video.clientWidth
    faktor_y = canvas.clientHeight / video.clientHeight;


    if (navigator.mediaDevices.getUserMedia) {

        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                video.srcObject = stream;

                let options = {

                }

                posenet = ml5.poseNet(video, modelLOADED);
                posenet.on('pose', recievedPoses);
            })
            .catch(function (error) {
                console.log("could not access video from webcam!");
                console.error(error);
            });
    }
}

let recievedPoses = (poses) => {

    if (poses.length > 0) {
        singlePose = poses[0].pose;
        skeleton = poses[0].skeleton;

        console.log(singlePose);
    }

    // for (let i = 0; i < p.pose.keypoints.length; i++) {


    //     for (let i = 0; i < p.pose.keypoints.length; i++) {

    //         let point = p.pose.keypoints[i];

    //         if (point.position.x > 0 && point.position.y > 0) {

    //             console.log({
    //                 position: {
    //                     x: point.position.x,
    //                     y: point.position.y
    //                 }
    //             });

    //             particels.push({
    //                 position: {
    //                     x: point.position.x * faktor_x,
    //                     y: point.position.y * faktor_y
    //                 },
    //                 color: "red",
    //                 pose: true

    //             });
    //         }
    //     }

    // }

}

let modelLOADED = () => {
    console.log("model has loaded");
}


// ### PAPER


let setupPaper = () => {

    if (canvas == undefined) {
        console.warn("canvas undefined");
        canvas = document.getElementById("myCanvas");

        // return;
    }

    console.log(canvas);

    console.log("setting up paper");

    canvasWidth = canvas.offsetWidth;
    canvasHeight = canvas.offsetHeight;

    paper.setup(canvas);

    paper.project.view.onFrame = onFrame;

}

let onFrame = (count, time, delta) => {

    for (let i = 0; i < 10; i++) {
        particels.push({
            position: {
                x: Math.floor(Math.random() * canvasWidth),
                y: Math.floor(Math.random() * canvasHeight)
            },
            color: paper.Color.random(),

        });
    }


    if (singlePose) {

        // console.log(singlePose);


        for (let i = 0; i < singlePose.keypoints.length; i++) {
            let rect = new paper.Path.Rectangle(new paper.Point(singlePose.keypoints[i].position.x * faktor_x, singlePose.keypoints[i].position.y * faktor_y), 50);
            rect.fillColor = new paper.Color("red");
        }
    }


    particels.forEach((source, index) => {

        if (source.pose) {
            if (source.circle == undefined) {
                source.circle = new paper.Path.Rectangle(new paper.Point(source.position.x, source.position.y), 50);
                source.circle.fillColor = source.color;
            }
        } else {
            if (source.circle == undefined) {
                source.circle = new paper.Path.Circle(new paper.Point(source.position.x, source.position.y), 10);
                source.circle.fillColor = source.color;
            }
        }


        source.circle.opacity = source.circle.opacity - 0.01;


        if (source.circle.opacity < 0) {
            source.circle.remove();

        }
    });
}



function setup() {
    setupPaper();
    setupPoseNet();
}





/*
function getRandomArbitrary(min, max) { // generate random num
    return Math.random() * (max - min) + min;
}
*/
function draw() { // this function code runs in infinite loop



    let faktor_x = window.innerWidth / capture.width;
    let faktor_y = window.innerHeight / capture.height;

    // images and video(webcam)
    image(capture, 0, 0, window.innerWidth, window.innerHeight);
    fill(255, 0, 0);


    if (singlePose) {

        // console.log(singlePose);


        for (let i = 0; i < singlePose.keypoints.length; i++) {


            ellipse(singlePose.keypoints[i].position.x * faktor_x, singlePose.keypoints[i].position.y * faktor_y, 20);
        }

        stroke(255, 255, 255);
        strokeWeight(5);

        for (let j = 0; j < skeleton.length; j++) {
            line(skeleton[j][0].position.x * faktor_x, skeleton[j][0].position.y * faktor_y, skeleton[j][1].position.x * faktor_x, skeleton[j][1].position.y * faktor_y);
        }

        // Apply specs and cigar
        // image(specs, singlePose.nose.x-40, singlePose.nose.y-70, 125, 125);
        // image(smoke, singlePose.nose.x-35, singlePose.nose.y+28, 50, 50);
    }
}




window.onload = () => {

    console.log("window on load")

    setup();
}