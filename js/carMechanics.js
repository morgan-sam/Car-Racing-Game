//Object array to store each car state (turn is not a state)
var carStates = [{
    state: 'stationary',
    topSpeed: 0,
    pedal: null,
    turnSpeed: 0
}, {
    state: 'forward',
    topSpeed: 10,
    pedal: false,
    turnSpeed: 1,
}, {
    state: 'reverse',
    topSpeed: -2,
    pedal: false,
    turnSpeed: 3,
}, {
    state: 'stalled',
    topSpeed: 10,
    pedal: null,
    turnSpeed: 0
}];
carStates[0].altState = null;
carStates[1].altState = carStates[2];
carStates[2].altState = carStates[1];

//Variables to determine car mechanics
var currentState = carStates[0].state;
var driftPedal = false;
var leftSteer = false;
var rightSteer = false;
var wheelAngle = 0;
var carAngle = wheelAngle;
var acceleration = 0.1;
var currentSpeed = 0;
var terrainState;

//Movement values calculated that are sent to mapMovement function
var xmove = 0;
var ymove = 0;

//Prevents the car from spinning from having a difference between the car & wheel angle that is greater than 360
function resetWheelAngles() {
    if (Math.abs(carAngle) > 360) {
        Math.sign(carAngle) < 0 ? wheelAngle += 360 : wheelAngle -= 360;
        carAngle = carAngle % 360;
    }
}

//Drifting swings wheels and grinds car to a halt
function drift() {
    if (carStates[1].pedal) {
        if (leftSteer) {
            //exaggerates left turning
            wheelAngle *= 1.004;
            wheelAngle < carAngle - 90 ? wheelAngle = carAngle - 90 : wheelAngle;
        }
        if (rightSteer) {
            //exaggerates right turning
            wheelAngle *= 1.004;
            wheelAngle > carAngle + 90 ? wheelAngle = carAngle + 90 : wheelAngle;
        }
    }
    resetWheelAngles();
    currentSpeed -= acceleration * 1.2;
    currentSpeed <= 0.1 ? carStopped() : currentSpeed;
}

//Rotates car based on wheel angles at a speed calculated from inputs
function turnCar(cur, top, turnSpeed) {
    //Cannot use single tenary line as must not change if carAngle = wheelAngle
    carAngle < wheelAngle ? carAngle += (cur / top) * turnSpeed : carAngle;
    carAngle > wheelAngle ? carAngle -= (cur / top) * turnSpeed : carAngle;
    carElement.style.transform = `rotate(${carAngle}deg)`;
}

//Main function to calculate car movement
function drive() {

    let terrainMod;
    switch (terrainState) {
        case 'track':
            carStates[1].topSpeed = 10;
            break;
        case 'dirt':
            carStates[1].topSpeed = 5;
            break;
        default:
            carStates[1].topSpeed = 10;
    }
    if (currentState == 'contact') {
        currentState = 'stalled';
    }

    if (currentState == 'stationary') {
        // Start up car in right state if handbrake (drift) not on
        if (!driftPedal) {
            checkStart(carStates[1].pedal, carStates[1].state);
            checkStart(carStates[2].pedal, carStates[2].state);
        }
    } else if (currentState == 'stalled') {
        currentSpeed -= 0.2 * Math.sign(currentSpeed);
        if (Math.floor(currentSpeed) === 0) {
            carStopped();
        }
    }
    //Increases or decreases speed in given direction based on pedals that are on
    //Regardless of direction speed will roll towards 0 if no pedals are on
    else {
        currentState === 'forward' ? i = 1 : null;
        currentState === 'reverse' ? i = 2 : null;

        carStates[i].altState.pedal ? currentSpeed -= 0.05 * Math.sign(carStates[i].topSpeed) : currentSpeed;
        carStates[i].pedal && drivingEnabled ? currentSpeed += carStates[i].topSpeed / 100 : currentSpeed -= carStates[i].topSpeed / 100;
        Math.abs(currentSpeed) >= Math.abs(carStates[i].topSpeed) ? currentSpeed = carStates[i].topSpeed : currentSpeed;

        //if speed goes to 0 states changes to stationary
        if (currentSpeed * Math.sign(carStates[i].topSpeed) <= 0) {
            carStopped();
            checkStart(carStates[i].altState.pedal, carStates[i].altState.state);
        }
        turnCar(currentSpeed, carStates[i].topSpeed, carStates[i].turnSpeed);
    }

    // Check if a car pedal down, if so put into corresponding state
    function checkStart(pedal, state) {
        if (pedal && drivingEnabled) {
            state === 'foward' ? currentSpeed = +0.1 : null;
            state === 'reverse' ? currentSpeed = -0.1 : null;
            currentState = state;
        }
    }
    //Send calculated movement to mapMovement function
    xmove = currentSpeed * Math.sin(-wheelAngle * Math.PI / 180);
    ymove = currentSpeed * Math.cos(-wheelAngle * Math.PI / 180);

    //if either false collision has occured
    let xSuccess = mapMovement('x', xmove);
    let ySuccess = mapMovement('y', ymove);

    //if there was a collision AND speed is over 5 then fire car backwards
    //currentSpeed limit on collisions allow for (semi)realistic bouncing off walls and also prevent scenarios where the car gets stuck in the wall because the bounce back amount is too low
    if ((xSuccess === false || ySuccess === false) && currentSpeed > 5) {
        currentState = 'stalled';
        currentSpeed = -currentSpeed;
    }
    updateCarWheels();
    updateStats();
}

//Changes car to stationary state (briefly) before drive interval switches direction
function carStopped() {
    currentSpeed = 0;
    currentState = carStates[0].state;
    //If both pedals inactive end drive interval and stay in stationary state
    if (!carStates[1].pedal && !carStates[2].pedal) {
        clearIntervals('drive');
    }
    resetWheelAngles();
}

//Turns wheels based on player input, wheels will not turn more than 90 degrees either left or right from centre
function turnWheels() {
    if (leftSteer) carAngle - 90 < wheelAngle ? wheelAngle -= 1 : wheelAngle;
    if (rightSteer) carAngle + 90 > wheelAngle ? wheelAngle += 1 : wheelAngle;
    resetWheelAngles();
    updateCarWheels();
    updateStats();
}
