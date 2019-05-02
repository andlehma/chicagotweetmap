let tweets;

// read old tweets
let xhr = new XMLHttpRequest();
xhr.open('GET', 'tweets.json');
xhr.onload = function() {
  if (xhr.status === 200){
    tweets = JSON.parse(xhr.responseText);
    drawDots();
  }
  else {
    console.error(xhr.status);
    tweets = [];
  }
};
xhr.send();

const canvas = document.getElementById("map-canvas");
const ctx = canvas.getContext('2d');

// width/height of the map img is 1884/2300 = 0.8191304347
var iW = window.innerWidth;
var iH = window.innerHeight;
if (iH > iW * (2300/1884)){
  canvas.width = iW;
  canvas.height = (2300/1884) * iW;
} else {
  canvas.height = iH;
  canvas.width = (1884/2300) * iH;
}

var background = new Image();
background.src = "img/map.png";

// Make sure the image is loaded first otherwise nothing will draw.
background.onload = function(){
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  drawDots();
}

let chicagoMinX = 87.523333;
let chicagoMaxX = 87.939444;
let deltaX = chicagoMaxX - chicagoMinX;
let chicagoMinY = 41.644583;
let chicagoMaxY = 42.022778;
let deltaY = chicagoMaxY - chicagoMinY;

function drawDots(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(244, 48, 48, 0.3)";
  tweets.forEach(tweet => {
    let tweetX = (1 - (Math.abs(tweet[0]) - chicagoMinX) / deltaX) * canvas.width;
    let tweetY = (1 - (Math.abs(tweet[1]) - chicagoMinY) / deltaY) * canvas.height;
    ctx.beginPath();
    ctx.arc(tweetX, tweetY, 3, 0, 2 * Math.PI);
    ctx.fill();
  });
}
