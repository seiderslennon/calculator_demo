let xScale = 0.015;
let yScale = 0.02;
let gap = 4;

let calcWidth = 375, calcHeight = 550;
let calcX, calcY;

let buttons = [];
let buttonSize = 70;
let screenDivide = 160;
let screen;
let second = false;
let isPlayActive = false;
let playAllMode = false;
let defaultButtonColor = [185, 185, 130];
let activeButtonColor = [150, 140, 88];
let targetSound = 0;
let sounds = [];

let showHelp = false;
let helpButton;

function setup() {
  createCanvas(windowWidth, windowHeight);
  calcX = (windowWidth - calcWidth) / 2;
  calcY = (windowHeight - calcHeight) / 2;
  
  screen = new Screen(this, 340, 80, 50, "");
  
  let marginX = (calcWidth - (buttonSize * 4)) / 5;
  let marginY = ((calcHeight - 10) - screenDivide - (buttonSize * 5)) / 6;
  
  let row0 = screenDivide + marginY + (buttonSize / 2);
  let row1 = screenDivide + 2 * marginY + ((3 * buttonSize) / 2);
  let row2 = screenDivide + 3 * marginY + ((5 * buttonSize) / 2);
  let row3 = screenDivide + 4 * marginY + ((7 * buttonSize) / 2);
  let row4 = screenDivide + 5 * marginY + ((9 * buttonSize) / 2);
  
  let col0 = marginX + (buttonSize / 2);
  let col1 = 2 * marginX + ((3 * buttonSize) / 2);
  let col2 = 3 * marginX + ((5 * buttonSize) / 2);
  let col3 = 4 * marginX + ((7 * buttonSize) / 2);
  
  buttons.push(new Button(this, col0, row0, buttonSize, "2nd", secondCallback));
  buttons.push(new Button(this, col1, row0, buttonSize, "sin", playCallback));
  buttons.push(new Button(this, col2, row0, buttonSize, "C", clearCallback));
  buttons.push(new Button(this, col3, row0, buttonSize, "▶︎", playCallback));
  
  buttons.push(new Button(this, col0, row1, buttonSize, "7", sevenCallback));
  buttons.push(new Button(this, col1, row1, buttonSize, "8", eightCallback));
  buttons.push(new Button(this, col2, row1, buttonSize, "9", nineCallback));
  buttons.push(new Button(this, col3, row1, buttonSize, "/", divideCallback));
  
  buttons.push(new Button(this, col0, row2, buttonSize, "4", fourCallback));
  buttons.push(new Button(this, col1, row2, buttonSize, "5", fiveCallback));
  buttons.push(new Button(this, col2, row2, buttonSize, "6", sixCallback));
  buttons.push(new Button(this, col3, row2, buttonSize, "*", multiplyCallback));
  
  buttons.push(new Button(this, col0, row3, buttonSize, "1", oneCallback));
  buttons.push(new Button(this, col1, row3, buttonSize, "2", twoCallback));
  buttons.push(new Button(this, col2, row3, buttonSize, "3", threeCallback));
  buttons.push(new Button(this, col3, row3, buttonSize, "-", minusCallback));
  
  buttons.push(new Button(this, col0, row4, buttonSize, ".", decimalCallback));
  buttons.push(new Button(this, col1, row4, buttonSize, "0", zeroCallback));
  buttons.push(new Button(this, col2, row4, buttonSize, "=", equalsCallback));
  buttons.push(new Button(this, col3, row4, buttonSize, "+", plusCallback));
  
  for (let i = 0; i < 9; i++) {
    sounds.push(new Sound());
  }

  helpButton = createButton('?');
  helpButton.position(windowWidth - 30, 10);
  helpButton.style('font-size', '23px');
  helpButton.style('padding', '0');             // no extra space around the glyph
  helpButton.style('background', 'transparent'); // no background
  helpButton.style('border', 'none');            // no border
  helpButton.style('outline', 'none');           // no focus outline
  helpButton.style('cursor', 'pointer');         // pointer on hover
  helpButton.style('box-shadow', 'none');        // remove any shadow
  helpButton.style('line-height', '1');          // tighten up vertical centering
  helpButton.mousePressed(() => {
    showHelp = !showHelp;
  });
}

function draw() {
  dotGrid();  // Draw a full‑page dot grid background
  
  push();
    translate(calcX, calcY);
    
    noStroke();
    // calculator color
    fill(40, 40, 40);
    rect(0, 0, calcWidth, calcHeight);
    
    // Screen color
    fill(205, 210, 200);
    rect(15, 15, 345, 130);
    
    for (let btn of buttons) {
      btn.display();
    }
    

    
    // button text color
    fill(0);
    screen.display();
  pop();

  updateButtonColor("2nd", [50, 85, 60]);
  updateButtonColor("C", [50, 85, 60]);
  updateButtonColor("sin", [50, 85, 60]);
  updateButtonColor("▶︎", [140, 46, 33]);
  updateButtonColor("/", [65, 65, 65]);
  updateButtonColor("*", [65, 65, 65]);
  updateButtonColor("-", [65, 65, 65]);
  updateButtonColor("+", [65, 65, 65]);
  updateButtonColor(".", [65, 65, 65]);
  updateButtonColor("=", [65, 65, 65]);

  if (showHelp) {
    let boxW = 410, boxH = 360;
    let boxX = width - boxW - 80;
    let boxY = 40;
    let pad  = 10;
    
    push();
      noStroke();
      fill(0, 180);
      rect(boxX, boxY, boxW, boxH, 8);
    
      fill(255);
      textSize(16);
      textLeading(20);               // controls line spacing
      textAlign(LEFT, TOP);
    
      // tell text() to wrap at boxW - 2*pad
      text(
        "- Every time you press =, a new oscillator is added to the selected sound.\n" +
        "- Clear calculator with C; Clear a sound with 2nd → C.\n" +
        "- Use 2nd → any digit to select a different sound.\n" +
        "- ▶︎ plays the current sound; ▶︎ in 2nd mode allows sounds assigned to digits to be played as keys.\n" +
        "\n" +
        "Fundamental - 1:1\n" +
        "Major Second - 9:8\n" +
        "Major Third - 5:4\n" +
        "Perfect Fourth - 4:3\n" +
        "Perfect Fifth - 3:2\n" +
        "Major Sixth - 5:3\n" +
        "Major Seventh - 15:8\n" +
        "Octave - 2:1\n" +
        "\n" +
        "Acoustic Beat Frequency = f₁ - f₂\n" +
        "\n" +
        "\n" +
        "\n" +
        "\n",

        boxX + pad,
        boxY + pad,
        boxW - pad * 2,              // max text width
        boxH - pad * 2               // (optional) max text height
      );
    pop();
    
  }
}

function dotGrid() {
  background(255);
  noStroke();
  fill(0);
  for (let x = gap / 2; x < width; x += gap) {
    for (let y = gap / 2; y < height; y += gap) {
      let noiseValue = noise(x * xScale, y * yScale);
      let diameter = noiseValue * gap;
      circle(x, y, diameter);
    }
  }
}

function playCallback() {
  if (second) {
    playAllMode = true;
    second = false;
    for (let btn of buttons) {
      if (btn.label === "▶︎") {
        btn.updateColor(activeButtonColor);
      }
    }
  } else {
    playAllMode = false;
    for (let btn of buttons) {
      if (btn.label === "▶︎") {
        btn.updateColor(defaultButtonColor);
      }
    }
    sounds[targetSound].playAll();
    isPlayActive = true;
  }
}

function equalsCallback() {
  let result = screen.evaluate();
  sounds[targetSound].addOscillator(result);
}

function secondCallback() {
  second = !second;
  if (playAllMode) { second = false; }
  playAllMode = false;
  for (let btn of buttons) {
    if (btn.label === "▶︎") {
      btn.updateColor(defaultButtonColor);
    }
  }
}

function clearCallback() {
  screen.text = "";
  if (second) {
    sounds[targetSound].clearOscillators();
    second = false;
  }
}

function plusCallback() {
  screen.text += "+";
}
function minusCallback() {
  screen.text += "-";
}
function multiplyCallback() {
  screen.text += "*";
}
function divideCallback() {
  screen.text += "/";
}
function decimalCallback() {
  screen.text += ".";
}
function zeroCallback() {
  screen.text += "0";
}
function oneCallback() {
  if (second) {
    targetSound = 0;
    second = false;
  } else if (playAllMode) {
    sounds[0].playAll();
  } else { 
    screen.text += "1"; 
  }
}
function twoCallback() {
  if (second) {
    targetSound = 1;
    second = false;
  } else if (playAllMode) {
    sounds[1].playAll();
  } else { 
    screen.text += "2"; 
  }
}
function threeCallback() {
  if (second) {
    targetSound = 2;
    second = false;
  } else if (playAllMode) {
    sounds[2].playAll();
  } else { 
    screen.text += "3"; 
  }
}
function fourCallback() {
  if (second) {
    targetSound = 3;
    second = false;
  } else if (playAllMode) {
    sounds[3].playAll();
  } else { 
    screen.text += "4"; 
  }
}
function fiveCallback() {
  if (second) {
    targetSound = 4;
    second = false;
  } else if (playAllMode) {
    sounds[4].playAll();
  } else { 
    screen.text += "5"; 
  }
}
function sixCallback() {
  if (second) {
    targetSound = 5;
    second = false;
  } else if (playAllMode) {
    sounds[5].playAll();
  } else { 
    screen.text += "6"; 
  }
}
function sevenCallback() {
  if (second) {
    targetSound = 6;
    second = false;
  } else if (playAllMode) {
    sounds[6].playAll();
  } else { 
    screen.text += "7"; 
  }
}
function eightCallback() {
  if (second) {
    targetSound = 7;
    second = false;
  } else if (playAllMode) {
    sounds[7].playAll();
  } else { 
    screen.text += "8"; 
  }
}
function nineCallback() {
  if (second) {
    targetSound = 8;
    second = false;
  } else if (playAllMode) {
    sounds[8].playAll();
  } else { 
    screen.text += "9"; 
  }
}

function mousePressed() {
  userStartAudio();
  let localX = mouseX - calcX;
  let localY = mouseY - calcY;
  if (localX >= 0 && localX <= calcWidth && localY >= 0 && localY <= calcHeight) {
    for (let btn of buttons) {
      if (btn.isMouseInside(localX, localY)) {
        btn.activate();
      }
    }
  }
}

function mouseReleased() {
  if (isPlayActive && !playAllMode) {
    isPlayActive = false;
    sounds[targetSound].stopAll();
  }
  if (playAllMode) {
    let localX = mouseX - calcX;
    let localY = mouseY - calcY;
    for (let btn of buttons) {
      if (btn.isMouseInside(localX, localY)) {
        sounds[Number(btn.label) - 1].stopAll();
      }
    }
  }
}

function keyReleased() {
  if (key === "▶︎" || key === " ") {
    sounds[targetSound].stopAll();
    isPlayActive = false;
  }
  if (playAllMode) {
    if (key > 0 && key < 10) {
      sounds[Number(key) - 1].stopAll();
    }
  }
}

function keyPressed() {
  userStartAudio();
  let activeKey = key;
  if (activeKey === "Enter" || activeKey === "Return") {
    activeKey = "=";
  }
  if (activeKey === " ") {
    activeKey = "▶︎";
  }
  for (let btn of buttons) {
    if (activeKey === btn.label) {
      btn.activate();
    }
  }
}

function updateButtonColor(label, color) {
  for (let btn of buttons) {
    if (btn.label === label) {
      btn.updateColor(color);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calcX = (windowWidth - calcWidth) / 2;
  calcY = (windowHeight - calcHeight) / 2;
  helpButton.position(windowWidth - 50, 10);
}