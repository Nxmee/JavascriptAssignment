//Written by Chris Hart

// functions

//mouse interaction
function getMouseXY(e) {
  var boundingRect = canvas.getBoundingClientRect();
  var offsetX = boundingRect.left;
  var offsetY = boundingRect.top;
  var w = (boundingRect.width-canvas.width)/2;
  var h = (boundingRect.height-canvas.height)/2;
  offsetX += w;
  offsetY += h;
  // use clientX and clientY as getBoundingClientRect is used above
  var mx = Math.round(e.clientX-offsetX);
  var my = Math.round(e.clientY-offsetY);
  return {x: mx, y: my};
}

function whenClick(evt) {
  var pos = getMouseXY(evt);
  if (pos.y < (HEIGHT / 3)) {
    if (head.hair > 2) {
      head.hair = 0;
    }
    else {
      head.hair += 1;
    }
  }

  if (Math.pow(pos.x - (head.center[0]),2) + Math.pow(pos.y - head.center[1],2) > Math.pow(head.headRad,2)) { //clicking outside head
    var lVec = [pos.x - (head.center[0] - head.eyeWidth),pos.y - head.center[1]] //vector that holds the left eye's direction
    var RVec = [pos.x - (head.center[0] + head.eyeWidth),pos.y - head.center[1]]
    head.leftEyeball =  [7 * Math.cos(Math.atan(lVec[1]/lVec[0])),7 * Math.sin(Math.atan(lVec[1]/lVec[0]))] //using trig to extract the direction from each vector...
    head.rightEyeball = [7 * Math.cos(Math.atan(RVec[1]/RVec[0])),7 * Math.sin(Math.atan(RVec[1]/RVec[0]))] //...to set the offset for each eyeball

    //if looking to left, reflect offsets
    if (lVec[0] < 1) {
      head.leftEyeball[0] = -head.leftEyeball[0]
      head.leftEyeball[1] = -head.leftEyeball[1]
    }
    if (RVec[0] < 1) {
      head.rightEyeball[0] = -head.rightEyeball[0]
      head.rightEyeball[1] = -head.rightEyeball[1]
    }

  }
  else { //clicking inside head
    head.leftEyeball = [0,0]
    head.rightEyeball = [0,0]

    //test if clicking left eye
    if (Math.pow(pos.x - (head.center[0] - head.eyeWidth),2) + Math.pow(pos.y - head.center[1],2) <= Math.pow(head.eyeRad,2)) {
      if(head.expression == 2 && head.leftTearCount < 3) {
        head.leftTearCount += 1;
      }
    }
    //test if clicking right eye
    if (Math.pow(pos.x - (head.center[0] + head.eyeWidth),2) + Math.pow(pos.y - head.center[1],2) <= Math.pow(head.eyeRad,2)) {
      if(head.expression == 2 && head.rightTearCount < 3) {
        head.rightTearCount += 1;
      }
    }
  }
  switch(head.expression) {
    case 0:
    drawNeutral(context);break;
    case 1:
    drawHappy(context);break;
    case 2:
    drawSad(context);break;
    case 3:
    drawAngry(context);break;
  }
}

//canvas functions
function clearCanvas(context) {
  context.clearRect(0, 0, WIDTH, HEIGHT);
}

function drawNeutral(context) {
  head.expression = 0;
  head.eyebrowOffsetY = [-30,-30]
  head.mouthOffset = 50;
  head.mouthWidth = 150;
  head.mouthHeight = 0;
  head.faceCol = "#FFFF00";
  head.leftTearCount = 0;
  head.rightTearCount = 0;
  drawFace(context)
}
function drawHappy(context) {
  head.expression = 1;
  head.eyebrowOffsetY = [-40,-40]
  head.mouthOffset = 50;
  head.mouthWidth = 150;
  head.mouthHeight = 70;
  head.leftTearCount = 0;
  head.faceCol = "#FFFF00";
  head.leftTearCount = 0;
  head.rightTearCount = 0;
  drawFace(context)

}
function drawSad(context) {
  head.expression = 2;
  head.eyebrowOffsetY = [-30,-40]
  head.mouthOffset = 100;
  head.mouthWidth = 150;
  head.mouthHeight = -70;
  head.faceCol = "#FFFF00";
  drawFace(context)
}
function drawAngry(context) {
  head.expression = 3;
  head.eyebrowOffsetY = [-50,-40]
  head.mouthOffset = 100;
  head.mouthWidth = 150;
  head.mouthHeight = -70;
  head.faceCol = "#FF0000";
  head.leftTearCount = 0;
  head.rightTearCount = 0;
  drawFace(context)
}

function drawFace(context) {
  clearCanvas(context);
  //head
  context.beginPath();
  context.arc(head.center[0],head.center[1],head.headRad,0,2*Math.PI);;
  context.fillStyle = head.faceCol;
  context.lineWidth=4;
  context.fill();
  context.stroke();
  //left eye
  context.beginPath();
  context.arc(head.center[0] - head.eyeWidth,head.center[1],head.eyeRad,0,2*Math.PI);
  context.fillStyle = "white";
  context.lineWidth=4;
  context.fill();
  context.stroke();
  //right eye
  context.beginPath();
  context.arc(head.center[0] + head.eyeWidth,head.center[1],head.eyeRad,0,2*Math.PI);
  context.fillStyle = "white";
  context.lineWidth=4;
  context.fill();
  context.stroke();

  //left eyeball
  context.beginPath();
  context.arc(head.center[0] - head.eyeWidth + head.leftEyeball[0],head.center[1] + head.rightEyeball[1],3,0,2*Math.PI);
  context.fillStyle = "black";
  context.fill();
  //right eyeball
  context.beginPath();
  context.arc(head.center[0] + head.eyeWidth + head.rightEyeball[0],head.center[1]+ head.rightEyeball[1],3,0,2*Math.PI);
  context.fillStyle = "black";
  context.fill();

  //left eyebrow
  context.beginPath();
  context.lineWidth=5;
  context.moveTo(head.center[0] - head.eyeWidth + head.eyebrowOffsetX,head.center[1] + head.eyebrowOffsetY[0]);
  context.lineTo(head.center[0] - head.eyeWidth - head.eyebrowOffsetX,head.center[1] + head.eyebrowOffsetY[1]);
  context.stroke();
  //Right eyebrow
  context.beginPath();
  context.lineWidth=5;
  context.moveTo(head.center[0] + head.eyeWidth - head.eyebrowOffsetX,head.center[1] + head.eyebrowOffsetY[0]);
  context.lineTo(head.center[0] + head.eyeWidth + head.eyebrowOffsetX,head.center[1] + head.eyebrowOffsetY[1]);
  context.stroke();
  //mouth
  context.beginPath();
  context.lineWidth=6;
  context.moveTo(head.center[0] - (head.mouthWidth/2),head.center[1] + head.mouthOffset);
  context.bezierCurveTo(head.center[0] - (head.mouthWidth/2),head.center[1] + head.mouthOffset + head.mouthHeight,
                        head.center[0] + (head.mouthWidth/2),head.center[1] + head.mouthOffset + head.mouthHeight,
                        head.center[0] + (head.mouthWidth/2),head.center[1] + head.mouthOffset);

  context.stroke();

  drawExtras(context)
}

function drawExtras(context) {
  //draws tears
  if (head.leftTearCount > 0) {
    for(var i = 0; i < head.leftTearCount;i++){
      context.beginPath();
      context.fillStyle = "blue";
      context.arc(head.center[0] - head.eyeWidth,head.center[1] + 10 + (15 * (i + 1)),5,0,2*Math.PI);
      context.fill()
    }
  }
  if (head.rightTearCount > 0) {
    for(var i = 0; i < head.rightTearCount;i++){
      context.beginPath();
      context.fillStyle = "blue";
      context.arc(head.center[0] + head.eyeWidth,head.center[1] + 10 + (15 * (i + 1)),5,0,2*Math.PI);
      context.fill()
    }
  }
  if (head.hair > 0) {
    switch (head.hair) {
      case 1:
        context.drawImage(hairs[0],0,0);
      break;
      case 2:
      context.drawImage(hairs[1],0,0);
      break;
      case 3:
      context.drawImage(hairs[2],0,0);
      break;
    }
  }
}



function face() {
  this.expression = 0; // 0=neutral, 1=happy, 2=sad, 3=angry
  this.center = [200,200] //center of the face - everything relative
  this.headRad = 150; //radius of the head
  this.eyeWidth = 100; //how far apart the eyes are
  this.eyeRad = 20; //radius of the eyes
  this.eyebrowOffsetX = -20;//how wide the eyebrows are
  this.eyebrowOffsetY = [-30,-30] //how far from the center the left/right side of the eyebrows is
  this.mouthOffset = 50; //how far down from the center the mouth is
  this.mouthWidth = 100;//how wide the mouth is
  this.mouthHeight = 50;//how big the smile is, negative for a frown
  this.faceCol = "#FFFF00"
  this.leftTearCount = 0;
  this.rightTearCount = 0;
  this.hair = 0; //hair id, 0=no hair
  this.leftEyeball = [0,0]; //offset of the left eyeball from the left eye
  this.rightEyeball = [0,0];
}

// main program body
var canvas = document.getElementById('facecanvas');
var context = canvas.getContext('2d');
var head = new face();
var hairs = [new Image(), new Image(), new Image()]
hairs[0].src = "./img/hair1.png";
hairs[1].src = "./img/hair2.png";
hairs[2].src = "./img/hair3.png";
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

drawNeutral(context)

var resetButton = document.getElementById("resetbutton");
var happyButton = document.getElementById("happybutton");
var angryButton = document.getElementById("angrybutton");
var sadButton = document.getElementById("sadbutton");

resetButton.addEventListener("click", function() { drawNeutral(context) });
happyButton.addEventListener("click", function() { drawHappy(context) });
angryButton.addEventListener("click", function() { drawAngry(context) });
sadButton.addEventListener("click", function() { drawSad(context) });
canvas.addEventListener('click', whenClick);
