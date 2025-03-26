let frequencies = [440, 110, 220];
let phase = 0;

function setup() {
  createCanvas(800, 400);
  noFill();
}

function draw() {
  background(255);
  stroke(0);
  beginShape();
  // Loop over horizontal pixels
  for (let x = 0; x < width; x++) {
    // Map the x position to a time value (adjust the time scale as needed)
    let t = map(x, 0, width, 0, 1);
    let ySum = 0;
    // Sum sine waves for all frequencies
    for (let i = 0; i < frequencies.length; i++) {
      // For a sine wave: y = sin(2 * PI * frequency * time + phase)
      ySum += sin(TWO_PI * frequencies[i] * (t + phase));
    }
    // Normalize the sum (if you want the composite wave to stay within -1 to 1)
    ySum /= frequencies.length;
    // Map the y value to canvas coordinates
    let y = map(ySum, -1, 1, height, 0);
    vertex(x, y);
  }
  endShape();
  // Update phase to animate the waveform
  phase += 0.01;
}
