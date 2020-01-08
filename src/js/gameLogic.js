function initGame() {

    (function positionCar() {
        let trackTiles = orderedTrackTiles();
        let x = trackTiles[1].x - trackTiles[0].x;
        let y = trackTiles[1].y - trackTiles[0].y;
        let initDegree;
        if (y) {
            initDegree = 180 * (y - 1) / 2;
        }
        if (x) {
            initDegree = 90 * -x;
        }
        carElement.style.transform = `rotate(${initDegree}deg)`;
        carAngle += initDegree;
        wheelAngle += initDegree;
        updateCarWheels();
    })();

    (function showRaceElemsAndUI() {
        //reveal player elements
        document.getElementById('car').style.display = 'block';
        document.getElementById('point').style.display = 'block';
        const wheel = document.getElementsByClassName('wheel');
        for (var i = 0; i < wheel.length; i++) {
            document.getElementById(wheel[i].id).style.display = 'block';
        }
        document.getElementById('laps').style.display = 'block';
    })();


    (function raceStartCountdown() {
        var countdownText = document.getElementById('raceText');
        countdownText.style.left = `${screenWidth / 2}px`;
        countdownText.style.top = `${screenHeight / 2}px`;

        let countNum = 3;
        let getReadyTextDur = 2;
        let goTextDur = 1;

        (() => {
            for (let i = (countNum + getReadyTextDur); i >= -goTextDur; i--) {
                setTimeout(() => {
                    if (i > countNum) {
                        countdownText.innerHTML = 'GET READY';
                    } else if (i > 0) {
                        countdownText.innerHTML = i;
                    } else if (i > -goTextDur) {
                        countdownText.innerHTML = 'GO!';
                        drivingEnabled = true;
                    } else {
                        countdownText.innerHTML = '';
                    }
                }, (countNum - i + getReadyTextDur) * 1000)
            }
        })();

    })();


};

function raceFinish() {
    var countdownText = document.getElementById('raceText');
    countdownText.innerHTML = 'YOU WIN!';
    drivingEnabled = false;
};

initGame();