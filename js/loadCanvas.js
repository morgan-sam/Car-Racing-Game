const trackColor = '#a9a9a9';
const dirtColor = '#98fb98';
const wallColor = '#708090';
const errorColor = '#d4af37';

(function loadCanvasElements() {
    //Background is loaded and appended to body as an img (not bg)
    var map = new Image();
    map.onload = function() {
        document.body.appendChild(map);
        map.setAttribute("id", "map");
        map.style.zIndex = "-2";
        map.style.left = `${-mapViewX}px`;
        map.style.top = `${-mapViewY}px`;
        map.style.position = "absolute";
    }

    var minimap = new Image();
    minimap.onload = function() {
        const miniMapWidth = mapWidth / 25;
        const miniMapHeight = mapHeight / 25;
        document.body.appendChild(minimap);
        minimap.setAttribute("id", "minimap");
        minimap.style.zIndex = "1";
        minimap.style.left = `${(screenWidth-miniMapWidth)}px`;
        minimap.style.top = `${(screenHeight-miniMapHeight)}px`;
        minimap.style.width = `${miniMapWidth}px`;
        minimap.style.height = `${miniMapHeight}px`;
        minimap.style.position = "absolute";

        const mmm = document.createElement('miniMapMarker');
        document.body.appendChild(mmm);
        mmm.setAttribute("id", "miniMapMarker");
        mmm.style.width = '5px';
        mmm.style.height = '5px';
        mmm.style.zIndex = '2'
        mmm.style.position = 'absolute';
        mmm.style.backgroundColor = "red";
        mmm.style.display = 'none';
        mmm.style.transform = 'translate(-50%,-50%)';
    }


    function tileArrayToCanvas(mw, mh, dim) {
        var canvas = document.createElement('canvas');
        canvas.id = "canvasMap";
        canvas.width = mw;
        canvas.height = mh;
        canvas.style.position = "absolute"
        canvas.style.left = '0px';
        canvas.style.top = '0px';
        canvas.style.display = 'none';
        //     document.body.appendChild(canvas)
        var context = canvas.getContext("2d");

        for (let i = 0; i < tileArray.length; i++) {
            context.beginPath();
            if (tileArray[i].type === 'finishline') {
                let checkers = 7;
                let ssd = dim / checkers; //small square dimension
                //fills out the black and white checkered finish line
                for (let a = 0; a < Math.pow(checkers, 2); a++) {
                    (a % 2) === 0 ? context.fillStyle = 'black' : context.fillStyle = 'white';
                    context.fillRect(tileArray[i].x * dim + ((a % checkers) + (Math.floor(a / checkers) % 2) * (checkers + 1) % 2) % checkers * ssd, tileArray[i].y * dim + Math.floor(a / checkers) * ssd, ssd, ssd);
                }
            } else if (tileArray[i].type === 'stand') {
                let x;
                let y;
                //create crowd effect
                let mod = 50;
                let box = dim / mod;
                for (let b = 0; b < 10; b++) {
                    let yShift = b * dim / 10;
                    let xShift = 10;
                    for (let f = 0; f < 500; f++) {
                        context.fillStyle = '#' + Math.random().toString(16).slice(2, 8);
                        x = f - xShift;
                        y = (f % mod * x % mod) + yShift;
                        if (x > 0 && y > 0 && x < dim - box && y < dim - box) {
                            context.fillRect(tileArray[i].x * dim + x, tileArray[i].y * dim + y, box, box);
                        }
                    }
                }

                let poleThin = 50;
                let poleAmount = 7;
                context.fillStyle = '#7c8288';
                //create vertical poles
                for (let c = 0; c < poleAmount; c++) {
                    x = ((dim / (poleAmount - 1)) * c) * (dim * (poleThin - 1)) / (dim * poleThin);
                    y = 0;
                    context.fillRect(tileArray[i].x * dim + x, tileArray[i].y * dim + y, dim / poleThin, dim);
                }
                //create top and bottom pole
                for (let d = 0; d < 2; d++) {
                    x = 0;
                    y = (d * dim) - d * (dim / poleThin);
                    context.fillRect(tileArray[i].x * dim + x, tileArray[i].y * dim + y, dim, dim / poleThin);
                }


            } else if (tileArray[i].type === 'track') {
                if (tileArray[i].corner && document.getElementById('cornersSelection').checked === true) {
                    context.fillStyle = dirtColor;
                    context.fillRect(tileArray[i].x * dim, tileArray[i].y * dim, dim, dim);
                    //corner values are stored in the tile array as following:

                    //top left = 1
                    //top right = 2
                    //bottom left = 3
                    //bottom right = 4

                    //This function uses the same order but with 0-3 as the numbers representing each corner, so 1 is subtracted
                    let corner = tileArray[i].corner - 1;

                    let pimod = (corner / 2) * -((Math.floor(corner / 2) * 2) - 1) + 0.5 * Math.floor(corner / 2);
                    context.strokeStyle = trackColor;

                    context.arc(tileArray[i].x * dim + dim * (corner % 2), tileArray[i].y * dim + dim * Math.floor(corner / 2), dim, pimod * Math.PI, (pimod + 0.5) * Math.PI, false);
                    context.lineTo(tileArray[i].x * dim + dim * (corner % 2), tileArray[i].y * dim + dim * Math.floor(corner / 2));

                    context.fillStyle = trackColor;
                    context.fill();
                } else {
                    context.fillStyle = trackColor;
                    context.fillRect(tileArray[i].x * dim, tileArray[i].y * dim, dim, dim);
                }

            } else {
                if (tileArray[i].type === 'dirt') {
                    context.fillStyle = dirtColor;
                }
                if (tileArray[i].type === 'wall') {
                    context.fillStyle = wallColor;
                }
                if (tileArray[i].type === 'error') {
                    context.fillStyle = errorColor;
                }
                context.fillRect(tileArray[i].x * dim, tileArray[i].y * dim, dim, dim);
            }
            context.stroke();
        }
        let image = canvas.toDataURL("image/png");
        //     canvas.remove();
        return image;
    };
    map.src = tileArrayToCanvas(mapWidth, mapHeight, tileDim);
    minimap.src = map.src;
})();