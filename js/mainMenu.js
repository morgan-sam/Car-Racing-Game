function setToActiveMenu(passedMenu) {
    hideMenus();
    var element = document.getElementById(passedMenu);
    element.classList.add("active");
}

function hideMenus() {
    var menus = document.getElementsByClassName("menu");
    for (let i = 0; i < menus.length; i++) {
        menus[i].classList.remove("active");
    }
}

function injectJavascript(path) {
    var ref = document.getElementsByTagName('script')[0];
    var script = document.createElement('script');
    script.src = path;
    script.type = "text/javascript";
    script.async = false;
    ref.parentNode.insertBefore(script, ref);
}

function loadGame() {
    hideMenus();
    let paths = [
        "./js/generateMap.js",
        "./js/loadCanvas.js",
        "./js/loadCar.js",
        "./js/intervals.js",
        "./js/playerInput.js",
        "./js/carMechanics.js",
        "./js/lapPosCheck.js",
        "./js/mapMovement.js",
        "./js/gameLogic.js",
        "./js/misc.js"
    ];

    for (let i = 0; i < paths.length; i++) {
        injectJavascript(paths[i]);
    }
}