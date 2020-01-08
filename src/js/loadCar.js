//General map variables used in the mapMovement section of app

var playerScreenX = screenWidth / 2;
var playerScreenY = screenHeight / 2;
var playerMapX = mapViewX + playerScreenX;
var playerMapY = mapViewY + playerScreenY;

//Car initialised
const carElement = document.getElementById('car');
const point = document.getElementById('point');


carElement.style.left = `${playerScreenX}px`;
carElement.style.top = `${playerScreenY}px`;
const carHeight = 50;
const carWidth = carHeight / 2;
carElement.style.height = carHeight + "px";
carElement.style.width = carWidth + "px";

//All 4 wheels initialised
const wheel = document.getElementsByClassName('wheel');
const wheelHeight = carHeight / 4;
const wheelWidth = carWidth / 8;

for (var i = 0; i < wheel.length; i++) {
    document.getElementById(wheel[i].id).style.height = `${wheelHeight}px`;
    document.getElementById(wheel[i].id).style.width = `${wheelWidth}px`;
    document.getElementById(wheel[i].id).style.display = 'block';
}