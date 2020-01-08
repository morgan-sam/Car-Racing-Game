//determines whether keys are enabled
var drivingEnabled = false;


//Interval created on keydown if opposite key is not pressed
//Pedal/Steer boolean is set to true on keydown
document.addEventListener('keydown', (e) => {
    if (!e.repeat) {
        switch (e.key) {
            case 'ArrowUp': //Up arrow key
                carStates[1].pedal = true;
                if (!carStates[2].pedal) {
                    createInterval('drive');
                }
                break;

            case 'ArrowDown': //down arrow keykey
                carStates[2].pedal = true;

                if (!carStates[1].pedal) {
                    createInterval('drive');
                }
                break;

            case ' ': //Spacebar
                driftPedal = true;
                createInterval('drift');
                break;

            case 'ArrowLeft': //left arrow key
                leftSteer = true;
                if (!rightSteer) {
                    createInterval('turn');
                }
                break;

            case 'ArrowRight': //right arrow key
                rightSteer = true;
                if (!leftSteer) {
                    createInterval('turn');
                }
                break;
        }
    }
    updateStats();
});

//Pedal/Steer boolean is negated on key release
//Turn and drift intervals are cleared on key release
//Drive intervals are cleared in carMechanics section once car rolls to a stop

document.addEventListener('keyup', (e) => {
    if (!e.repeat) {
        switch (e.key) {
            case 'ArrowUp': //Up arrow key
                carStates[1].pedal = false;
                break;

            case 'ArrowDown': //down arrow key
                carStates[2].pedal = false;
                break;

            case ' ': //Spacebar
                driftPedal = false;
                clearIntervals('drift');
                break;

            case 'ArrowLeft': //left arrow key
                leftSteer = false;
                clearIntervals('turn');
                break;

            case 'ArrowRight': //right arrow key
                rightSteer = false;
                clearIntervals('turn');
                break;
        }
    }
    updateStats();
});


window.addEventListener("resize", function() {
    //Reposition miniMap
    screenWidth = parseInt(document.documentElement.clientWidth);
    screenHeight = parseInt(document.documentElement.clientHeight);
    const miniMapWidth = (parseInt(document.getElementById("minimap").style.width));
    const miniMapHeight = (parseInt(document.getElementById("minimap").style.height));
    document.getElementById("minimap").style.left = `${(screenWidth-miniMapWidth)}px`;
    document.getElementById("minimap").style.top = `${(screenHeight-miniMapHeight)}px`;
    document.getElementById("raceText").style.left = `${(screenWidth/2)}px`;
    document.getElementById("raceText").style.top = `${(screenHeight/2)}px`;
});