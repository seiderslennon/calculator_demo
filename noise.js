// Noise tends to look smoother with coordinates that are very close together
// These values will be multiplied by the x and y coordinates to make the
// resulting values very close together


let backgroundSketch = function(p) {
    let xScale = 0.015;
    let yScale = 0.02;
    let gap;

    p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight);
        // Draw the grid
        dotGrid();
    };

    // function checkChanged() {
    //   if (gap !== ) {
    //     dotGrid();
    //   }
    //   if (xScale !== ) {
    //     dotGrid();
    //   }
    //   if (yScale !== ) {
    //     dotGrid();
    //   }
    // }

    function dotGrid() {
        p.background(255);
        p.noStroke();
        p.fill(0);

        // Get the current gap and offset values from the sliders
        gap = 4;
        //   xScale = ;
        //   yScale = ;
        // Loop through x and y coordinates, at increments set by gap
        for (let x = gap / 2; x < p.width; x += gap) {
            for (let y = gap / 2; y < p.height; y += gap) {
                // Calculate noise value using scaled and offset coordinates
                let noiseValue = p.noise((x) * xScale, (y) * yScale);
                // Since noiseValue will be 0-1, multiply it by gap to set diameter to
                // between 0 and the size of the gap between circles
                let diameter = noiseValue * gap;
                p.circle(x, y, diameter);
            }
        }
    }

}
new p5(backgroundSketch);