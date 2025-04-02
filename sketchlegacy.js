let buttons = [];
let currentInput = "";
let oscillators = [];
let lastFrequency = null;

let centsMode = false;     // true when we are in cents entry mode
let downCentsMode = false; // true if we are inserting a "cents down" template
let centsInput = "";       // holds the digits entered for the cents value
let baseFrequencyStr = ""; // stores the base frequency (as a string) before entering cents mode

let secondaryMode = false;  // toggled by the "2nd" button

let currentWaveform = 'sine';  // default oscillator waveform
let waveButton;                // button to toggle waveform

let backspaceButton;           // button for backspace / remove oscillator

const placeholder = "<n>";

function setup() {
  let canvasWidth = 300;
  let canvasHeight = 475;
  let canvas = createCanvas(canvasWidth, canvasHeight);
  // Center the canvas by positioning it at ( (windowWidth - canvasWidth)/2, (windowHeight - canvasHeight)/2 )
  canvas.position((windowWidth - canvasWidth) / 2, (windowHeight - canvasHeight) / 2);


  textAlign(CENTER, CENTER);
  textSize(20);

  let labels = [
    "2nd", "play", "Wave", "Del",
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

  // myImg = createImg('static/just_intonation.png', 'just intonation');
  // myImg.position(1000, 10);
  // myImg.size(200, 300);
}

function draw() {
  background(200);

  fill(255);
  rect(0, 0, width, 150);
  fill(0);
  textSize(30);

  textAlign(RIGHT, CENTER);
  text(currentInput || "0", width - 20, 50);

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

function mouseReleased() {
  if (buttons[1].contains(mouseX, mouseY)) {
    stopNote();
  }
}

function handleInput(label) {
  if (label === '2nd') {
    toggleSecondary();
    return;
  } else if (label === 'play') {
    play();
    return;
  } else if (label === 'Wave') {
    toggleWaveform();
    return;
  } else if (label === 'Del') {
    handleBackspace();
    return;
  }


  if (secondaryMode) {
    if (label === '+') {
      insertCentsFormula();  // secondary function of '+' : insert cents formula for raising frequency
      secondaryMode = false;
      return;
    } else if (label === '-') {
      insertDownCentsFormula();  // secondary function of '-' : insert cents formula for lowering frequency
      secondaryMode = false;
      return;
    } else if (label === 'C') {
      // Secondary function of 'C': clear audio
      clearNotes();
      secondaryMode = false;
      return;
    } else {
      // Any other key cancels secondary mode.
      secondaryMode = false;
    }
  }

  if (label === "C") {
    currentInput = "";
    lastFrequency = null;
    centsMode = false;
    centsInput = "";
    baseFrequencyStr = "";
    return;
  }

  if (centsMode) {
    // remove the placeholder
    if (currentInput.indexOf(placeholder) !== -1) {
      centsInput = "";
      if (downCentsMode) {
        currentInput = baseFrequencyStr + "*2^(-";
      } else {
        currentInput = baseFrequencyStr + "*2^(";
      }
    }
    if (/^[0-9.]$/.test(label) || (label === '-' && centsInput === "" && !downCentsMode)) {
      centsInput += label;
      if (downCentsMode) {
        currentInput = baseFrequencyStr + "*2^(-" + centsInput + "/1200)";
      } else {
        currentInput = baseFrequencyStr + "*2^(" + centsInput + "/1200)";
      }
      return;
    } else {
      if (downCentsMode) {
        currentInput = baseFrequencyStr + "*2^(-" + (centsInput || "0") + "/1200)";
      } else {
        currentInput = baseFrequencyStr + "*2^(" + (centsInput || "0") + "/1200)";
      }
      centsMode = false;
      downCentsMode = false;
    }
  }

  if (label === "=") {
    // If cents mode is still active, finalize it.
    if (centsMode) {
      if (downCentsMode) {
        currentInput = baseFrequencyStr + "*2^(-" + (centsInput || "0") + "/1200)";
      } else {
        currentInput = baseFrequencyStr + "*2^(" + (centsInput || "0") + "/1200)";
      }
      centsMode = false;
      downCentsMode = false;
    }
    // Process cents formula
    if (currentInput.includes("*2^(")) {
      let regex = /^(.*?)\*2\^\((-?)(.*?)\/1200\)$/;
      let match = currentInput.match(regex);
      if (match) {
        let baseExpr = match[1].trim();
        let sign = match[2]; // Either "-" or ""
        let centsExpr = match[3].trim();
        let baseValue = evaluateRightAssociative(baseExpr);
        let centsValue = evaluateRightAssociative(sign + centsExpr);
        let result = baseValue * Math.pow(2, centsValue / 1200);
        result = Number(result.toFixed(2));
        currentInput = result.toString();
        lastFrequency = result;
        let osc = new p5.Oscillator(lastFrequency);
        osc.setType(currentWaveform);
        oscillators.push(osc);
      } else {
        currentInput = "Error";
      }
    } else {
      try {
        let result = evaluateRightAssociative(currentInput);
        result = Number(result.toFixed(2));
        currentInput = result.toString();
        lastFrequency = result;
        let osc = new p5.Oscillator(lastFrequency);
        osc.setType(currentWaveform);
        oscillators.push(osc);
      } catch (e) {
        currentInput = "Error";
      }
    }
  } else {
    // normal mode
    currentInput += label;
  }
}

function toggleSecondary() {
  secondaryMode = !secondaryMode;
}

// Toggle waveform type
function toggleWaveform() {
  const waveForms = ['sine', 'triangle', 'sawtooth', 'square'];
  let index = waveForms.indexOf(currentWaveform);
  index = (index + 1) % waveForms.length;
  currentWaveform = waveForms[index];
  waveButton.html('Wave: ' + currentWaveform);
}

// Handler for the backspace button.
function handleBackspace() {
  if (secondaryMode) {
    if (oscillators.length > 0) {
      let lastOsc = oscillators.pop();
      lastOsc.stop();
      lastOsc.dispose();
    }
    secondaryMode = false;
  } else {
    currentInput = currentInput.substring(0, currentInput.length - 1);
  }
}

// Inserts full cents formula for raising frequency
function insertCentsFormula() {
  if (lastFrequency === null) {
    alert("Compute a base frequency first by pressing '='.");
    return;
  }
  if (!centsMode) {
    centsMode = true;
    downCentsMode = false;
    baseFrequencyStr = currentInput;
    centsInput = "";
    currentInput = baseFrequencyStr + "*2^(" + placeholder + "/1200)";
  }
}

// Inserts full cents formula for lowering frequency
function insertDownCentsFormula() {
  if (lastFrequency === null) {
    alert("Compute a base frequency first by pressing '='.");
    return;
  }
  if (!centsMode) {
    centsMode = true;
    downCentsMode = true;
    baseFrequencyStr = currentInput;
    centsInput = "";
    currentInput = baseFrequencyStr + "*2^(-" + placeholder + "/1200)";
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
    textAlign(CENTER, CENTER);
    text(this.label, this.x + this.w/2, this.y + this.h/2);
    
    // secondary labels below buttons
    if (this.label === '+') {
      push();
      textSize(10);
      text("cents", this.x + this.w/2, this.y + this.h/2 + 20);
      pop();
    } else if (this.label === '-') {
      push();
      textSize(10);
      text("cents down", this.x + this.w/2, this.y + this.h/2 + 20);
      pop();
    } else if (this.label === 'C') {
      push();
      textSize(10);
      text("clear audio", this.x + this.w/2, this.y + this.h/2 + 20);
      pop();
    }
  }
  
  contains(px, py) {
    return px > this.x && px < this.x + this.w &&
           py > this.y && py < this.y + this.h;
  }
}

function stopNote() {
  for (let i = 0; i < oscillators.length; i++) {
    oscillators[i].amp(0, 0.5);
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

// --- Custom Right-Associative Parser ---
// Tokenize the expression string into numbers and operators.
function tokenize(str) {
  let tokens = [];
  let number = "";
  let operators = "+-*/";
  for (let i = 0; i < str.length; i++) {
    let c = str[i];
    if ((c >= '0' && c <= '9') || c === '.') {
      number += c;
    } else if (operators.indexOf(c) !== -1) {
      // Treat a '-' as a negative sign if it appears at the start or immediately after another operator.
      if (c === '-' && number === "" && (tokens.length === 0 || "+-*/".includes(tokens[tokens.length - 1]))) {
        number = "-";
      } else {
        if (number !== "") {
          tokens.push(number);
          number = "";
        }
        tokens.push(c);
      }
    }
  }
  if (number !== "") {
    tokens.push(number);
  }
  return tokens;
}

function evaluateRightAssociative(expr) {
  let tokens = tokenize(expr);
  let [value, index] = parseAddSub(tokens, 0);
  return value;
}

// Parse addition and subtraction
function parseAddSub(tokens, index) {
  let [left, newIndex] = parseMulDiv(tokens, index);
  if (newIndex < tokens.length && (tokens[newIndex] === '+' || tokens[newIndex] === '-')) {
    let op = tokens[newIndex];
    let [right, finalIndex] = parseAddSub(tokens, newIndex + 1);
    if (op === '+') {
      return [left + right, finalIndex];
    } else {
      return [left - right, finalIndex];
    }
  }
  return [left, newIndex];
}

// Parse multiplication and division
function parseMulDiv(tokens, index) {
  let [left, newIndex] = parseFactor(tokens, index);
  if (newIndex < tokens.length && (tokens[newIndex] === '*' || tokens[newIndex] === '/')) {
    let op = tokens[newIndex];
    let [right, finalIndex] = parseMulDiv(tokens, newIndex + 1);
    if (op === '*') {
      return [left * right, finalIndex];
    } else {
      return [left / right, finalIndex];
    }
  }
  return [left, newIndex];
}

// Parse a number (factor).
function parseFactor(tokens, index) {
  let token = tokens[index];
  let value = parseFloat(token);
  return [value, index + 1];
}
