//Updates the position of the car wheels in relation to the current position of car and it's rotation

function updateCarWheels() {

  //Updates car centre point - used to calculate relative wheel positions
  const cw = parseInt(carElement.style.width);
  const ch = parseInt(carElement.style.height);
  point.style.left = parseInt(carElement.style.left) + cw / 2 + "px";
  point.style.top = parseInt(carElement.style.top) + ch / 2 + "px";

  //Each wheel is moved to the origin, the rotation is applied, and then they are moved back to their position on the car
  for (var i = 1; i <= 4; i++) {

    const cornerX = parseInt(carElement.style.left) + ((i - 1) % 2 * cw);
    const cornerY = parseInt(carElement.style.top) + Math.floor(((i - 1) / 2) % 2) * ch;

    const centreX = parseInt(point.style.left);
    const centreY = parseInt(point.style.top);

    var tempX = cornerX - centreX;
    var tempY = cornerY - centreY;

    const angleAdjust = 360 / (2 * Math.PI);

    var rotatedX = tempX * Math.cos(carAngle / angleAdjust) - tempY * Math.sin(carAngle / angleAdjust);
    var rotatedY = tempX * Math.sin(carAngle / angleAdjust) + tempY * Math.cos(carAngle / angleAdjust);

    var x = rotatedX + centreX;
    var y = rotatedY + centreY;

    const curwheel = document.getElementById('wheel' + i).style;
    curwheel.left = x + 'px';
    curwheel.top = y + 'px';
    curwheel.transform = `translate(-${wheelWidth/2}px,-${wheelHeight/2}px) rotate(${wheelAngle}deg)`;
  }

}

//Function to determine if map or player should move based on their position in relation to the map, screen and borders
function mapMovement(direction, movement) {


  const map = document.getElementById("map");
  var axis; //0 is x axis, 1 is Y axis
  var sign; //0 is - (left/down), 1 is + (right/up)
  var mapDimension, screenDimension, playerDimension;
  var playerMapAxis, mapViewAxis, playerScreenAxis;
  var screenBorder;
  switch (direction) {
    case 'x':
      axis = 0;
      movement > 0 ? sign = 1 : sign = 0;
      break;
    case 'y':
      axis = 1;
      movement < 0 ? sign = 1 : sign = 0;
      break;
  }

  //Is there a collision?
  let collisionTestX = playerMapX;
  let collisionTestY = playerMapY;
  if (axis === 0) {
    //positive values push the border to the left
    collisionTestX = playerMapX + movement + carHeight * sign - wheelHeight;
  }
  if (axis === 1) {
    //positive values push the border up
    collisionTestY = playerMapY + movement + carHeight * sign + carHeight * Math.sign(movement);
  }
  let colTileX = Math.floor(collisionTestX / tileDim);
  let colTileY = Math.floor(collisionTestY / tileDim);
  for (let i = 0; i < tileArray.length; i++) {
    if (tileArray[i].x === colTileX && tileArray[i].y === colTileY) {
      if (tileArray[i].type === 'wall' || tileArray[i].type === 'stand') {
        return false;
      }
    }
  }


  //DOWN RIGHT (SIGN)

  //0 with up and left,
  //1 with down and right
  var dr = (sign + axis) % 2

  //-1 with up and left,
  //1 with bottom and right
  var drs = 2 * ((sign + axis) % 2) - 1


  const xScreenBorder = (screenWidth / 2);
  const yScreenBorder = (screenHeight / 2);

  //At what part of the screen should the map begin scrolling
  axis ? screenBorder = yScreenBorder : screenBorder = xScreenBorder;

  //Maths.abs ensures that the movement is correctly added or taken away from axis variables (leaving it in allows incorrect double negatives)
  //Math.floor stops function from adding <1 to the playerMapAxis/playerScreenAxis variables when the carElement has not been moved
  movement = Math.abs(Math.floor(movement));


  axis ? mapDimension = mapHeight : mapDimension = mapWidth;
  axis ? screenDimension = screenHeight : screenDimension = screenWidth;
  axis ? playerDimension = carHeight : playerDimension = carWidth;

  axis ? playerMapAxis = playerMapY : playerMapAxis = playerMapX;
  axis ? mapViewAxis = mapViewY : mapViewAxis = mapViewX;
  axis ? playerScreenAxis = playerScreenY : playerScreenAxis = playerScreenX;

  //Check if player going out of map bounds
  if (playerMapAxis * drs >= (mapDimension - playerDimension) * dr) {
    //cancel movement if OOB
    return;
  } else {
    //if not move player on world map
    axis ? playerMapAxis += movement * -(sign * 2 - 1) : playerMapAxis -= movement * -(sign * 2 - 1);
  }
  //Check if player going out of screen bounds and map still moveable
  if (playerScreenAxis * -drs < (screenBorder) + screenDimension * -dr && mapViewAxis * drs < (mapDimension - screenDimension) * dr) {
    //    if so move screen instead of player
    mapViewAxis += movement * drs;

    //if player movement goes beyond mapView variable limit, transfer remaining movement to playerScreen variable movement
    if (mapViewAxis * -drs < -(mapDimension - screenDimension) * dr) {
      axis ? carElement.style.top = parseInt(carElement.style.top) + drs * (drs * mapViewAxis - dr * (mapDimension - screenDimension)) + 'px' : carElement.style.left = parseInt(carElement.style.left) + drs * (drs * mapViewAxis - dr * (mapDimension - screenDimension));
      playerScreenAxis += drs * (drs * mapViewAxis - (mapDimension - screenDimension) * dr);
      mapViewAxis = (mapDimension - screenDimension) * dr;
    }
    axis ? map.style.top = -mapViewAxis + 'px' : map.style.left = -mapViewAxis + 'px';

    //else move player only
  } else {
    playerScreenAxis += movement * drs;
    axis ? carElement.style.top = parseInt(carElement.style.top) + movement * -(sign * 2 - 1) + 'px' : carElement.style.left = parseInt(carElement.style.left) + movement * (sign * 2 - 1) + 'px';
  }

  axis ? playerMapY = playerMapAxis : playerMapX = playerMapAxis;
  axis ? mapViewY = mapViewAxis : mapViewX = mapViewAxis;
  axis ? playerScreenY = playerScreenAxis : playerScreenX = playerScreenAxis;

  var objects = [...document.getElementsByClassName("object")];
  objects.forEach(function(el) {
    el.style.left = `${el.getAttribute('x')*tileDim-mapViewX}px`;
    el.style.top = `${el.getAttribute('y')*tileDim-mapViewY}px`;
    el.style.display = `block`;
  });

  //update minimap marker (red-dot)
  const mmm = document.getElementById('miniMapMarker');
  const miniMapWidth = (parseInt(document.getElementById("minimap").style.width));
  const miniMapHeight = (parseInt(document.getElementById("minimap").style.height));
  mmm.style.display = 'block';
  mmm.style.left = `${(miniMapWidth*playerMapX/mapWidth)+(screenWidth-miniMapWidth)}px`;
  mmm.style.top = `${(miniMapHeight*playerMapY/mapHeight)+(screenHeight-miniMapHeight)}px`;

  //find terrain of current tile
  let curTileX = Math.floor(playerMapX / tileDim);
  let curTileY = Math.floor(playerMapY / tileDim);
  for (let i = 0; i < tileArray.length; i++) {
    if (tileArray[i].x === curTileX && tileArray[i].y === curTileY) {
      terrainState = tileArray[i].type;
    }
  }

  calculateLapCompletion();

  return true;
}