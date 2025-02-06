let buttons = [];
let currentInput = "";
let oscillators = [];

function setup() {
  createCanvas(300, 400);
  textAlign(CENTER, CENTER);
  textSize(20);

  let labels = [
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "C", "0", "=", "+"
  ];

  for (let i = 0; i < labels.length; i++) {
    let x = (i % 4) * 75;
    let y = floor(i / 4) * 75 + 100;
    buttons.push(new Button(x, y, 75, 75, labels[i]));
  }

  let playButton = createButton('play');
  playButton.position(350, 250);
  playButton.mousePressed(play);
  playButton.mouseReleased(stopNote);

  let clearButton = createButton('clear');
  clearButton.position(350, 280);
  clearButton.mouseClicked(clearNotes);

  myImg = createImg('/static/just_intonation.png', 'just intonation');
  myImg.position(620, 10);
}

function draw() {
  background(200);

  // Draw the display area.
  fill(255);
  rect(0, 0, width, 100);
  fill(0);
  textSize(30);
  // Display the current expression (or "0" if empty).
  textAlign(RIGHT, CENTER);
  text(currentInput || "0", width - 10, 50);

  // Draw each button.
  for (let button of buttons) {
    button.show();
  }
}

function mousePressed() {
  // Check which button was clicked.
  for (let button of buttons) {
    if (button.contains(mouseX, mouseY)) {
      handleInput(button.label);
    }
  }
}

function handleInput(label) {
  if (label === "C") {
    // Clear the current input.
    currentInput = "";
  } else if (label === "=") {
    // Evaluate the full expression.
    try {
      // For example, if the user entered "3*1/2", eval returns 1.5.
      let result = eval(currentInput);
      currentInput = result.toString();

      // (Optional sound feature: create an oscillator with a frequency based on the result.)
      let osc = new p5.Oscillator(parseFloat(result));
      oscillators.push(osc);
    } catch (e) {
      currentInput = "Error";
    }
  } else {
    // Append the button’s label (digit or operator) to the current expression.
    currentInput += label;
  }
}

class Button {
  constructor(x, y, w, h, label) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
  }

  show() {
    fill(220);
    rect(this.x, this.y, this.w, this.h);
    fill(0);
    textSize(20);
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);
  }

  contains(px, py) {
    return px > this.x && px < this.x + this.w &&
           py > this.y && py < this.y + this.h;
  }
}

// Sound functions remain unchanged.
function stopNote() {
  for (let i = 0; i < oscillators.length; i++) {
    oscillators[i].amp(0, 0.01);
    oscillators[i].stop();
  }
}

function play() {
  for (let i = 0; i < oscillators.length; i++) {
    if (oscillators[i].started === false) {
      oscillators[i].start();
      oscillators[i].amp(1, 0.01);
    }
  }
}

function clearNotes() {
  for (let osc of oscillators) {
    osc.stop();
    osc.dispose();
  }
  oscillators = [];
}
