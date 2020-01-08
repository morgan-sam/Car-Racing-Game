/*
function findCurrentTrack() {
    let currentTrack;
    let curTileX = Math.floor(playerMapX / tileDim);
    let curTileY = Math.floor(playerMapY / tileDim);
    for (let i = 0; i < trackTiles.length; i++) {
        if (trackTiles[i].x === curTileX && trackTiles[i].y === curTileY) {
            currentTrack = i;
        }
    }

    return currentTrack;
}
*/


var finishLineOffset = findAngle(finishCords.x * tileDim, finishCords.y * tileDim, 0);

function findAngle(px, py, offset) {
    var dx = px - mapWidth / 2;
    var dy = py - mapHeight / 2;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    let angle = ((theta + 540 - offset) % 360);
    return angle;
}


function updateLaps() {
    const lapDisplay = document.getElementById('laps');
    lapDisplay.innerHTML = ('');
    lapDisplay.innerHTML += (`Laps: ${lapsElapsed}/${totalLaps}<br>`);
    lapDisplay.innerHTML += (`${percentageRoundTrack}%<br>`);
    lapDisplay.innerHTML += (`<br>`);
}

var lapsElapsed = 0;
var totalLaps = parseInt(document.getElementById('lapsSlider').value);
var trackQuadrantProgression = 0;
var percentageRoundTrack;
var testTQ;
var curTQ = 0;
var prevTQ = 3;
var quadOffset = 0;
updateLaps();

function findQuad(inputX, inputY) {

    //returns what quadrant the input coordinate is in

    let x, y;
    (inputX > (mapWidth / 2)) ? x = 1: x = -1;
    (inputY > (mapHeight / 2)) ? y = 1: y = -1;

    let res = ((x + y + 2) / 2) % 2 + (y + 1);

    if (trackDirection === 'anticlockwise') {
        res = 4 - res;
    }
    //quadOffset refers to where the finishline is, so quadrant will always start at 0
    //Fn is run initially to find the finishline offset, before being used to determine the player quadrant
    res = (4 + res - quadOffset) % 4;
    return res;
}
//plus 1 to account for the actual tile itself as coords start in top left corner
quadOffset = findQuad((finishCords.x + 1) * tileDim, (finishCords.y + 1) * tileDim);

function calculateLapCompletion() {

    function trackPercent() {
        let percent = Math.round(100 * findAngle(playerMapX, playerMapY, finishLineOffset) / 360);
        if (trackDirection === 'anticlockwise') {
            percent = 100 - percent;
        }
        return percent;
    }

    percentageRoundTrack = trackPercent();

    testTQ = findQuad(playerMapX, playerMapY);

    //if TQ has changed
    if (testTQ != curTQ) {
        prevTQ = curTQ;
        curTQ = testTQ;
        if (prevTQ < curTQ) {
            if (prevTQ === 0 && curTQ === 3) {
                trackQuadrantProgression--;
            } else {
                trackQuadrantProgression++;
            }
        }
        if (prevTQ > curTQ) {
            if (prevTQ === 3 && curTQ === 0) {
                trackQuadrantProgression++;
            } else {
                trackQuadrantProgression--;
            }
        }
    }

    if (terrainState === 'finishline') {
        if (Math.floor(trackQuadrantProgression / 4) > lapsElapsed) {
            lapsElapsed++;
        }
    }
    updateLaps();


    if (lapsElapsed === totalLaps) {
        raceFinish();
    }
};