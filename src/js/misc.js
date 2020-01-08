function updateStats() {

    function r(num) {
        return Math.round(num);
    }
    const stats = document.getElementById('stats');
    stats.innerHTML = ('');
    stats.innerHTML += (`playerScreenX: ${r(playerScreenX)}/${r(screenWidth)}<br>`);
    stats.innerHTML += (`playerScreenY: ${r(playerScreenY)}/${r(screenHeight)}<br>`);
    stats.innerHTML += (`playerMapX: ${r(playerMapX)}/${r(mapWidth)}<br>`);
    stats.innerHTML += (`playerMapY: ${r(playerMapY)}/${r(mapHeight)}<br>`);
    stats.innerHTML += (`mapViewX: ${r(mapViewX)}/${r(mapWidth-screenWidth)}<br>`);
    stats.innerHTML += (`mapViewY: ${r(mapViewY)}/${r(mapHeight-screenHeight)}<br>`);
    stats.innerHTML += (`xmove: ${xmove.toFixed(2)}<br>`);
    stats.innerHTML += (`ymove: ${ymove.toFixed(2)}<br>`);
    stats.innerHTML += (`carAngle: ${carAngle.toFixed(2)}<br>`);
    stats.innerHTML += (`wheelAngle: ${wheelAngle.toFixed(2)}<br>`);
    stats.innerHTML += (`currentState: ${currentState}<br>`);
    stats.innerHTML += (`Gas Pedal: ${carStates[1].pedal}<br>`);
    stats.innerHTML += (`Reverse Pedal: ${carStates[2].pedal}<br>`);
    stats.innerHTML += (`driftPedal: ${driftPedal}<br>`);
    stats.innerHTML += (`currentSpeed: ${currentSpeed}<br>`);
    stats.innerHTML += (`<br>`);
    stats.innerHTML += (`Active Interval Timers: ${Object.keys(window.timers.intervals.active).length}<br>`);
    stats.innerHTML += (`<br>`);
    stats.innerHTML += (`Terrain State: ${terrainState}<br>`);
    stats.innerHTML += (`<br>`);


    //    stats.innerHTML = ('');
}

window.setInterval = function (window, setInterval) {
    if (!window.timers) {
        window.timers = {};
    }
    if (!window.timers.intervals) {
        window.timers.intervals = {};
    }
    if (!window.timers.intervals.active) {
        window.timers.intervals.active = {};
    }
    return function (func, interval) {
        var id = setInterval(func, interval);
        window.timers.intervals.active[id] = func;
        return id;
    }
}(window, window.setInterval);

window.clearInterval = function (window, clearInterval) {
    if (!window.timers) {
        window.timers = {};
    }
    if (!window.timers.intervals) {
        window.timers.intervals = {};
    }
    if (!window.timers.intervals.inactive) {
        window.timers.intervals.inactive = {};
    }
    return function (id) {
        if (window.timers.intervals.active && window.timers.intervals.active[id]) {
            window.timers.intervals.inactive[id] = window.timers.intervals.active[id];
            clearInterval(id);
            delete window.timers.intervals.active[id];
        }
    }
}(window, window.clearInterval);
