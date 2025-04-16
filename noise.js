// Noise tends to look smoother with coordinates that are very close together
// These values will be multiplied by the x and y coordinates to make the
// resulting values very close together


// let backgroundSketch = function(p) {
//     let xScale = 0.015;
//     let yScale = 0.02;
//     let gap;

//     p.setup = function() {
//         p.createCanvas(p.windowWidth, p.windowHeight);
//         p.dotGrid();  // Use the exposed function to draw the grid initially
//     };

//     // Exposed method: now dotGrid is accessible externally as p.dotGrid
//     p.dotGrid = function() {
//         p.background(255);
//         p.noStroke();
//         p.fill(0);
//         gap = 4; // Alternatively, read from a slider or control
        
//         for (let x = gap / 2; x < p.width; x += gap) {
//             for (let y = gap / 2; y < p.height; y += gap) {
//                 let noiseValue = p.noise(x * xScale, y * yScale);
//                 let diameter = noiseValue * gap;
//                 p.circle(x, y, diameter);
//             }
//         }
//     };
// };

// // Create and store the instance in a global variable
// let myBackground = new p5(backgroundSketch);