let capture;
let posenet;
let noseX, noseY;
let reyeX, reyeY;
let leyeX, leyeY;
let poses = [];
let actor_img;
let specs, smoke;
let faktor_x = 1;
let faktor_y = 1;


let particels = [];

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    let constraints = {
        video: {
            mandatory: {
                minWidth: window.innerWidth,
                minHeight: window.innerHeight
            },
            optional: [{ maxFrameRate: 30 }]
        },
        audio: false
    };
    capture = createCapture(constraints);

    capture.hide();
    posenet = ml5.poseNet(capture, modelLOADED);
    posenet.on('pose', recievedPoses);


    faktor_x = window.innerWidth / capture.width;
    faktor_y = window.innerHeight / capture.height;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function recievedPoses(p) {
    poses = p;
}

function modelLOADED() {
    console.log("model has loaded");
}

function draw() {

    for (let i = 0; i < 15; i++) {
        particels.push({
            position: {
                x: Math.floor(Math.random() * window.innerWidth),
                y: Math.floor(Math.random() * window.innerHeight)
            },
            color: {
                r: 120 + Math.floor(Math.random() * 120),
                g: 120 + Math.floor(Math.random() * 120),
                b: 120 + Math.floor(Math.random() * 120)
            },
            opacity: 255
        });
    }

    background(0, 0, 0)

    // image(video, 0, 0, window.innerWidth, window.innerHeight);

    for (pi = 0; pi < poses.length; pi++) {

        let singlePose = poses[pi].pose;
        let skeleton = poses[pi].skeleton;

        for (let i = 0; i < singlePose.keypoints.length; i++) {
            particels.push({
                position: {
                    x: singlePose.keypoints[i].position.x * faktor_x,
                    y: singlePose.keypoints[i].position.y * faktor_y
                },
                color: {
                    r: 200 + Math.floor(Math.random() * 50),
                    g: 200 + Math.floor(Math.random() * 50),
                    b: 200 + Math.floor(Math.random() * 510)
                },
                opacity: 255
            });
        }

        stroke(150, 150, 150, 100);
        strokeWeight(30);

        for (let j = 0; j < skeleton.length; j++) {
            line(skeleton[j][0].position.x * faktor_x, skeleton[j][0].position.y * faktor_y, skeleton[j][1].position.x * faktor_x, skeleton[j][1].position.y * faktor_y);
        }

        stroke(0, 0, 0);
    }

    particels.forEach(particle => {
        fill(particle.color.r, particle.color.g, particle.color.b, particle.opacity);
        ellipse(particle.position.x, particle.position.y, 80);
        particle.opacity = particle.opacity - 5;
    });

    particels = particels.filter(m => m.opacity > 0);

}
