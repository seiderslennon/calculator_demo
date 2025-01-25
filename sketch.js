let buttons = [];
let currentInput = "";
let previousInput = "";
let operator = null;
let oscillators = [];

function setup() {
  createCanvas(300, 400);
  textAlign(CENTER, CENTER);
  textSize(20);

  // Create buttons
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

  let playButton = createButton('play')
  playButton.position(350, 250);
  playButton.mousePressed(play);
  playButton.mouseReleased(stopNote);

  let clearButton = createButton('clear')
  clearButton.position(350, 280);
  clearButton.mouseClicked(clearNotes);
}

function draw() {
  background(200);

  // Draw display
  fill(255);
  rect(0, 0, width, 100);
  fill(0);
  textSize(30);
  text(currentInput || "0", width - 10, 50); // display text


  // Draw buttons
  for (let button of buttons) {
    button.show();
  }
}

function mousePressed() {
  for (let button of buttons) {
    if (button.contains(mouseX, mouseY)) {
      handleInput(button.label);
    }
  }
}

function handleInput(label) {
  if (!isNaN(label)) {
    // Number input
    currentInput += label;
  } else if (label === "C") {
    // Clear
    currentInput = "";
    previousInput = "";
    operator = null;
  } else if (label === "=") {
    // Calculate
    if (previousInput && currentInput && operator) {
      currentInput = calculate(previousInput, currentInput, operator);
      previousInput = "";
      operator = null;

      osc = new p5.Oscillator(parseInt(currentInput));
      oscillators.push(osc);
    }
  } else {
    // Operator input
    if (currentInput) {
      previousInput = currentInput;
      currentInput = "";
    }
    operator = label;
  }
}

function calculate(a, b, op) {
  a = float(a);
  b = float(b);
  switch (op) {
    case "+":
      return (a + b).toString();
    case "-":
      return (a - b).toString();
    case "*":
      return (a * b).toString();
    case "/":
      return b !== 0 ? (a / b).toString() : "Error";
  }
  return "";
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
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);
  }

  contains(px, py) {
    return px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h;
  }
}

// Stops playing the note.
function stopNote() {
  for (let i = 0; i < oscillators.length; i++) {
    oscillators[i].amp(0, 0.01);
    oscillators[i].stop();
  }
}

// Plays the notes in a melody.
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
    osc.stop();      // Stop the oscillator
    osc.dispose();   // Dispose of the oscillator (frees resources)
  }
  oscillators = [];
}