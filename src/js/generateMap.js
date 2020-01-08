
 const tileDim = 500; //pixels tile takes up

 var tileArray = [];

 class tile {
     constructor(x, y, id, type) {
         this.x = x;
         this.y = y;
         this.id = id;
         this.type = type;
         // this.corner = corner;
     }
 }

 function addTileToArray(x, y, inputID, type) {
     tileArray.push(new tile(x, y, inputID, type));
 }

 function addTilesToArray(coordArray, type) {
     const delay = ms => new Promise(res => setTimeout(res, ms));
     for (let i = 0; i < coordArray.length; i++) {
         addTileToArray(coordArray[i][0], coordArray[i][1], 'obj' + tileArray.length, type);
     }
 }

 //returns random value between to inputs (including both)
 function rand(min, max) {
     return Math.floor((Math.random() * (max - min + 1)) + min);
 };

 function generateCrossTiles(amountOfCrosses) {
     let crossTileArray = [];

     function createCross(coordinate) {
         let singleCrossTile = [coordinate];
         for (let i = 0; i < 4; i++) {
             singleCrossTile.push([coordinate[0] + (i - 1) % 2, coordinate[1] + (i - 2) % 2]);
         }
         return singleCrossTile;
     }

     function diagonalCoordinates(cross) {
         // cross array order is; 0: centre, 1: left, 2: up, 3: right, 4: down
         let r = rand(1, 4); // picks either left/up/right/down
         let x = cross[r][0];
         let y = cross[r][1];
         let sign = Math.floor((r - 1) / 2);
         let axis = (r + 1) % 2;
         x = x + (rand(0, 1) * 2 - 1) * axis + ((axis + 1) % 2) * ((sign * 2) - 1);
         y = y + (rand(0, 1) * 2 - 1) * ((axis + 1) % 2) + axis * ((sign * 2) - 1);
         return [x, y];
     }

     crossTileArray.push(createCross([0, 0]));
     for (var i = 0; i < amountOfCrosses - 1; i++) {
         crossTileArray.push(createCross(diagonalCoordinates(crossTileArray[crossTileArray.length - 1])));
     }

     //flattens multi-dim-array of crosses to a single array of coordinates
     let flatArray = [].concat.apply([], crossTileArray);
     //removes duplicate coordinates
     let uniqueTiles = Array.from(new Set(flatArray.map(JSON.stringify)), JSON.parse)
     return uniqueTiles;
 }


 function createObjBorders() {

     function findFurthestObject(axis) {
         let currentCoord, edgeObj, edgeCoord = 0;
         for (let i = 0; i < tileArray.length; i++) {
             axis === 'x' ? currentCoord = tileArray[i].x : currentCoord = tileArray[i].y;
             if (edgeCoord < currentCoord) {
                 edgeCoord = currentCoord;
                 edgeObj = tileArray[i];
             }
         }
         return edgeObj;
     }

     //returns an object of the max/min x&y coordinates
     function outerObjCoordinates() {
         let coordinates = findObjCoords();
         var xArr = coordinates.map(function(arr) {
             return arr[0]
         });
         var yArr = coordinates.map(function(arr) {
             return arr[1]
         });
         return minMaxCoords = {
             xMin: Math.min.apply(null, xArr),
             yMin: Math.min.apply(null, yArr),
             xMax: Math.max.apply(null, xArr),
             yMax: Math.max.apply(null, yArr)
         }
     }

     function findObjCoords() {
         let objectCoords = []
         for (let i = 0; i < tileArray.length; i++) {
             objectCoords.push([tileArray[i].x, tileArray[i].y]);
         }
         return objectCoords;
     }

     //coordArrays is an array of 2d arrays
     function checkCoordExists(coordinate, coordArrays) {
         for (let a = 0; a < coordArrays.length; a++) {
             for (let b = 0; b < coordArrays[a].length; b++) {
                 if (coordinate[0] == coordArrays[a][b][0] && coordinate[1] == coordArrays[a][b][1]) return true;
             }
         }
         return false;
     }

     function mapBorder(startObj, objCoords) {
         let border = [];
         let mapHoles = [];
         let current, next, start = {
             x: (parseInt(startObj.x) + 1),
             y: parseInt(startObj.y),
             direction: 3
             // 0: left, 1: up, 2: right, 3: down  (always % 4)
         };
         current = start;

         //function has a facing direction
         //moves around turf clockwise

         //if there is a block in front of it turns counter clockwise and checks again
         //always checks that there is a block to the right of it, if so moves 1 forward
         //if there is no block to right turns facing direction 90 deg clockwise and moves forward 1

         function singleTileMove(x, y, direction) {

             // direction:
             //0: left, 1: up, 2: right, 3: down

             let sign = Math.floor(direction / 2);
             let axis = direction % 2;

             // 0 with y (up/down), 1 with x (left/right)
             let axisIn = (direction + 1) % 2;

             //-1 with left and down, 1 with up and right
             var urs = 2 * ((sign + axis) % 2) - 1

             //Check box directly in front exists
             //invert y axis with '-' as down > up in terms of coordinates (in either the cross section or the border)
             if (checkCoordExists([x + urs * axisIn, y - urs * axis], [objCoords, border])) {

                 //firstly check if box to the right exists, if not add a wall tile
                 if (!checkCoordExists([x + urs * axis, y + urs * axisIn], [objCoords, border])) {
                     mapHoles.push([x + urs * axis, y + urs * axisIn]);
                 }

                 //check if box in front is starting box
                 if (start.x === x + urs * axisIn && start.y === y - urs * axis) {
                     return true;
                 } else {
                     //if so turn 90 degrees counter-clockwise
                     direction--;
                 }
             } else {
                 //Check if box exists to the right of direction (in either the cross section or the border)
                 if (checkCoordExists([x + urs * axis, y + urs * axisIn], [objCoords, border])) {
                     //check if box to right is starting box
                     //(and that border length is greater 2 i.e. not the second block from start )
                     if (start.x === x + urs * axis && start.y === y + urs * axisIn && border.length > 2) {
                         return true;
                     } else {
                         //if so move forward
                         x = x + urs * axisIn;
                         y = y + urs * -1 * axis;
                     }
                 } else {
                     //if not turn 90 deg clockwise
                     direction++;
                 }
             }
             direction < 0 ? direction = 3 : direction;
             return {
                 x: x,
                 y: y,
                 direction: direction % 4
             };
         }

         function checkBorderSuccess() {
             //if function spins turns direction 4 times instead of moving means its hit a dead end
             let spin = 0;
             while (true) {
                 next = singleTileMove(current.x, current.y, current.direction);
                 if (next === true) {
                     border.push([current.x, current.y]);
                     return true;
                     //border completed
                 }

                 if (next.x === current.x && next.x === current.x && next.direction !== current.direction) {
                     spin++
                     if (spin >= 4) {
                         border.push([current.x, current.y]);
                         return false;
                         //border did not complete
                     }
                 } else {
                     spin = 0;
                     border.push([current.x, current.y]);
                 }
                 current = next;
             }
         }

         // if border hit dead end paint it red, if it completed paint it green
         if (checkBorderSuccess()) {
             addTilesToArray(border, 'track');
             fillMapHoles(mapHoles);
             return true;
         } else {
             addTilesToArray(border, 'dirt');
             checkIfEndBlocked(border);
             fillMapHoles(mapHoles);
             return false;
         }
     }

     //checkIfEndBlocked & fillMapHoles are both fairly similar functions as they add tiles to missed areas in the function. Where they differ is cIBP deals with the occasional case where the penultimate block has an empty block ahead of it but has to make a right turn to a dead end. The block ahead of the penultimate will be 'cut off' by the next border moving around it.

     //fMHs deals with the case where the border has an empty block to the right of it but has made a left turn. The block to the right often has more empty blocks behind it within the centre of the wall.

     //In the 2nd instance the block(s) will be inside the wall, so the function can recursively adds new blocks to any empty neighbouring block. This function cannot be used for the 1st instance, as the empty block is not inside the wall and sits next to the entire empty map. Thus the if fMHs is used on the first instance it will attempt to fill the entire map with blocks.

     //cIBP was created instead to place a single block in the position missed when the route makes a right turn.

     //0.12428999048407463

     function checkIfEndBlocked(bord) {
         let lastPos = bord[bord.length - 1];
         let penPos = bord[bord.length - 2];
         let dif = lastPos.map(function(num, idx) {
             return num - penPos[idx];
         }).reverse();
         //position to check if blocked by border
         let posTest = penPos.map(function(num, idx) {
             return num + dif[idx];
         });
         //if position is empty fill
         if (!checkCoordExists(posTest, [findObjCoords()])) {
             addTilesToArray([posTest], 'error');
         }
     }

     function fillMapHoles(mapHoles) {

         function fillSingleHole(mapHole) {
             addTilesToArray([mapHole], 'error');
             let x = mapHole[0];
             let y = mapHole[1];
             let objCoords = findObjCoords();
             //check left/up/right/down of hole for any other holes

             for (var dir = 0; dir < 4; dir++) {
                 //left 0, up 1, right 2, down 3
                 let sign = (Math.floor(dir / 2) * 2) - 1; //-1 left & up, 1 right & down
                 let axis = dir % 2; //0 left & right, 1 up & down
                 let axisIn = (dir + 1) % 2; //1 left & right, 0 up & down

                 if (!checkCoordExists([x + sign * axisIn, y + sign * axis], [objCoords])) {
                     fillSingleHole([x + sign * axisIn, y + sign * axis]);
                 };
             }
         }

         for (var i = 0; i < mapHoles.length; i++) {
             fillSingleHole(mapHoles[i]);
         }
     }

     function addTrackOuterTiles() {
         let {
             xMin,
             yMin,
             xMax,
             yMax
         } = outerObjCoordinates();
         let objs = findObjCoords();

         let dirtOuterBorder = [];
         for (var y = yMin; y <= yMax; y++) {
             for (var x = xMin; x <= xMax; x++) {
                 if (!checkCoordExists([x, y], [objs])) {
                     dirtOuterBorder.push([x, y]);
                 }
             }
         }
         addTilesToArray(dirtOuterBorder, 'dirt');

         let wallOuterBorder = [];
         for (var x = xMin - 1; x <= xMax + 1; x++) {
             wallOuterBorder.push([x, yMin - 1]);
             wallOuterBorder.push([x, yMax + 1]);
         }
         for (var y = yMin - 1; y <= yMax + 1; y++) {
             wallOuterBorder.push([xMin - 1, y]);
             wallOuterBorder.push([xMax + 1, y]);
         }
         //Removes outer corner duplicates
         let uniqueWallTiles = Array.from(new Set(wallOuterBorder.map(JSON.stringify)), JSON.parse)
         addTilesToArray(uniqueWallTiles, 'wall');

     }

     function addFinishLineTile() {
         let trackTileIndices = [];
         for (let i = 0; i < tileArray.length; i++) {
             if (tileArray[i].type === 'track') {
                 trackTileIndices.push(i);
             }
         }
         let finishLineIndex = trackTileIndices[rand(0, trackTileIndices.length - 1)];
         tileArray[finishLineIndex].type = 'finishline';
         addCrowdStands(finishLineIndex);

         return {
             x: tileArray[finishLineIndex].x,
             y: tileArray[finishLineIndex].y
         };

         //function creates crowd stands around finish line. Crowd stands act identically to walls so cars will bounce off them.
         //This is to encourage cars to drive through finishline so their lap is register.
         //Ultimately the quadrant is the true counter of lap completion, so if they miss the finishline but go round the next time both laps will be reigstered
         function addCrowdStands(fli) {
             let finishX = (tileArray[fli].x);
             let finishY = (tileArray[fli].y);

             //calculate coordinates of tiles around and including the finishline
             for (let i = 0; i < 9; i++) {
                 let x = finishX + ((i % 3) - 1);
                 let y = finishY + Math.floor(i / 3) - 1;
                 for (let a = 0; a < tileArray.length; a++) {
                     //if any of these tiles are dirt tiles convert them to stand tiles
                     if (tileArray[a].x === x && tileArray[a].y === y && tileArray[a].type === 'dirt') {
                         tileArray[a].type = 'stand';
                     }
                 }
             }
         }

     }

     function addTrackCorners() {
         let track = orderedTrackTiles();
         //determines the moves made by the track route
         let moves = []
         for (let i = 0; i < track.length; i++) {
             //compares first 2 track indexes
             moves.push([track[1].x - track[0].x, track[1].y - track[0].y]);
             //moves first track entry to end of array, so no crashes with array index being OOB
             track = track.slice(1).concat(track.slice(0, 1));
         }

         //function for comparing arrays
         function compare(a, b) {
             if (JSON.stringify(a) === JSON.stringify(b)) {
                 return true
             } else {
                 return false
             }
         }
         //adds finishline to end of track array (as well as start) for the last track tile comparison
         track = track.slice(0).concat(track.slice(0, 1));

         for (let i = 0; i < moves.length - 1; i++) {

             //checks if 2 moves are nonidentical, i.e. moving around a corner
             if (!compare(moves[0], moves[1])) {

                 //the order of each moves affects which corner the curve needs to be on
                 //i.e. right down would be corner = 3
                 //but down right would be corner = 2
                 //each move has been labelled below:

                 //down & left
                 if (compare(moves[0], [0, 1]) && compare(moves[1], [-1, 0])) {
                     tileArray[track[i + 1].index].corner = 1;
                 };
                 // right & up
                 if (compare(moves[0], [1, 0]) && compare(moves[1], [0, -1])) {
                     tileArray[track[i + 1].index].corner = 1;
                 };

                 //left & up
                 if (compare(moves[0], [-1, 0]) && compare(moves[1], [0, -1])) {
                     tileArray[track[i + 1].index].corner = 2;
                 };
                 //down & right
                 if (compare(moves[0], [0, 1]) && compare(moves[1], [1, 0])) {
                     tileArray[track[i + 1].index].corner = 2;
                 };

                 //right & down
                 if (compare(moves[0], [1, 0]) && compare(moves[1], [0, 1])) {
                     tileArray[track[i + 1].index].corner = 3;
                 };
                 //up & left
                 if (compare(moves[0], [0, -1]) && compare(moves[1], [-1, 0])) {
                     tileArray[track[i + 1].index].corner = 3;
                 };

                 //up & right
                 if (compare(moves[0], [0, -1]) && compare(moves[1], [1, 0])) {
                     tileArray[track[i + 1].index].corner = 4;
                 };
                 //left & down
                 if (compare(moves[0], [-1, 0]) && compare(moves[1], [0, 1])) {
                     tileArray[track[i + 1].index].corner = 4;
                 };

             }
             moves = moves.slice(1).concat(moves.slice(0, 1));
         }
     }

     function adjustToScreen() {
         //moves whole tilearray to start from [0,0]
         let {
             xMin,
             yMin,
             xMax,
             yMax
         } = outerObjCoordinates();
         for (let i = 0; i < tileArray.length; i++) {
             tileArray[i].x -= xMin;
             tileArray[i].y -= yMin;
         }
     }

     (function newBorder() {
         //if border hits dead end, makes a new border around it
         if (!mapBorder(findFurthestObject('x'), findObjCoords())) {
             newBorder();
         } else {
             //Add dirt all the way around
             addTrackOuterTiles();
             //Add finishline & stands around FL
             addFinishLineTile();
             //Adds curvature to track
             addTrackCorners();
             //Adjusts track to screen once border completes and then return
             adjustToScreen();
             return;
         }
     })();

     if (trackDirection === 'anticlockwise') {
         tileArray = tileArray.reverse();
     }

     //Export Completed Map Dimensions

     let {
         xMin,
         yMin,
         xMax,
         yMax
     } = outerObjCoordinates();
     return [(xMax + 1) * tileDim, (yMax + 1) * tileDim];
 }






 const numberOfCrosses = document.getElementById('levelSizeSlider').value;
 let d = document.getElementById("directionDropdown");
 let trackDirection = d.options[d.selectedIndex].value;
 addTilesToArray(generateCrossTiles(numberOfCrosses), 'wall');
 const [mapWidth, mapHeight] = createObjBorders();

 function orderedTrackTiles() {

     let finishIndex;
     let trackTiles = [];
     for (let i = 0; i < tileArray.length; i++) {
         if (tileArray[i].type === 'track' || tileArray[i].type === 'finishline') {
             trackTiles.push(tileArray[i]);
             if (tileArray[i].type === 'finishline') {
                 finishIndex = trackTiles.length - 1;
             }
             trackTiles[trackTiles.length - 1].index = i;
         }
     }
     return trackTiles.slice(finishIndex).concat(trackTiles.slice(0, finishIndex));
 }

 var finishCords = (function() {
     for (let i = 0; i < tileArray.length; i++) {
         if (tileArray[i].type === 'finishline') {
             return {
                 x: tileArray[i].x,
                 y: tileArray[i].y
             }
         }
     }
 })();







 var screenWidth = parseInt(document.documentElement.clientWidth);
 var screenHeight = parseInt(document.documentElement.clientHeight);


 var mapViewX = (finishCords.x * tileDim) - screenWidth / 3;
 var mapViewY = (finishCords.y * tileDim) - screenHeight / 4;
