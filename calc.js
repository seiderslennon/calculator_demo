let overlaySketch = function(p) {
  let buttons = [];
  let buttonSize = 70;
  let screenDivide = 160;
  let screen = new Screen(p, 340, 80, 50, "");
  let second = false;
  let isPlayActive = false;
  let playAllMode = false;
  let defaultButtonColor = 200;
  let activeButtonColor = 165;

  let targetSound = 0;
  let sounds = [];
  for (let i = 0; i < 9; i++) {
    sounds.push(new Sound());
  }

  p.setup = function() {
    let canvas = p.createCanvas(375, 550);
    let marginX = (p.width - (buttonSize * 4)) / 5
    let marginY = (((p.height-10) - screenDivide) - (buttonSize * 5)) / 6

    canvas.id("overlay-canvas");
    canvas.style('left', (window.innerWidth - p.width) / 2 + 'px');
    canvas.style('top', (window.innerHeight - p.height) / 2 + 'px');

    let row0 = screenDivide + marginY+(buttonSize/2);
    let row1 = screenDivide + 2*(marginY)+((3*buttonSize)/2);
    let row2 = screenDivide + 3*(marginY)+((5*buttonSize)/2);
    let row3 = screenDivide + 4*(marginY)+((7*buttonSize)/2);
    let row4 = screenDivide + 5*(marginY)+((9*buttonSize)/2);

    let col0 = marginX+(buttonSize/2);
    let col1 = 2*(marginX)+((3*buttonSize)/2);
    let col2 = 3*(marginX)+((5*buttonSize)/2);
    let col3 = 4*(marginX)+((7*buttonSize)/2);

    buttons.push(new Button(p, col0, row0, buttonSize, "2nd", p.second));
    buttons.push(new Button(p, col1, row0, buttonSize, "sin", p.play));
    buttons.push(new Button(p, col2, row0, buttonSize, "C", p.clear));
    buttons.push(new Button(p, col3, row0, buttonSize, "▶︎", p.play));

    buttons.push(new Button(p, col0, row1, buttonSize, "7", p.seven));
    buttons.push(new Button(p, col1, row1, buttonSize, "8", p.eight));
    buttons.push(new Button(p, col2, row1, buttonSize, "9", p.nine));
    buttons.push(new Button(p, col3, row1, buttonSize, "/", p.divide));

    buttons.push(new Button(p, col0, row2, buttonSize, "4", p.four));
    buttons.push(new Button(p, col1, row2, buttonSize, "5", p.five));
    buttons.push(new Button(p, col2, row2, buttonSize, "6", p.six));
    buttons.push(new Button(p, col3, row2, buttonSize, "*", p.multiply));
  
    buttons.push(new Button(p, col0, row3, buttonSize, "1", p.one));
    buttons.push(new Button(p, col1, row3, buttonSize, "2", p.two));
    buttons.push(new Button(p, col2, row3, buttonSize, "3", p.three));
    buttons.push(new Button(p, col3, row3, buttonSize, "-", p.minus));

    buttons.push(new Button(p, col0, row4, buttonSize, ".", p.decimal));
    buttons.push(new Button(p, col1, row4, buttonSize, "0", p.zero));
    buttons.push(new Button(p, col2, row4, buttonSize, "=", p.equals));
    buttons.push(new Button(p, col3, row4, buttonSize, "+", p.plus));
  };

  p.draw = function() {
    p.background(0);
    p.fill(255, 80, 80);
    p.noStroke();
    p.rect(0, 0, p.width, p.height);
    
    p.fill(255, 255, 230);
    p.rect(15, 15, 345, 130);
    
    for (let btn of buttons) {
      btn.display();
    }

    p.fill(0,0,0);
    screen.display();
  };

  p.mousePressed = function() {
    p.userStartAudio();
    for (let btn of buttons) {
      if (btn.isMouseInside()) {
        btn.activate();
      }
    }
  };

  p.mouseReleased = function() {
    if (isPlayActive && !playAllMode) {
      isPlayActive = false;
      sounds[targetSound].stopAll();
    }
    if (playAllMode) {
      for (let btn of buttons) {
        if (btn.isMouseInside()) {
          sounds[Number(btn.label)-1].stopAll();
        }
      }
    }
  };


  p.keyReleased = function() {
    if (p.key === "▶︎" || p.key === " ") { // adjust the key check as needed
      sounds[targetSound].stopAll();
      isPlayActive = false;
    }
    if (playAllMode) {
      if (p.key > 0 && p.key < 10) {
        sounds[Number(p.key)-1].stopAll();
      }
    }
  };

  p.keyPressed = function() {
    p.userStartAudio();
    let activeKey = p.key;
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

  p.play = function() {
    if (second) {
      playAllMode = true;
      second = false;
      for (let btn of buttons) {
        if (btn.label === "▶︎") {
          btn.updateColor(activeButtonColor);
        }
      }
    }
    else {
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

  p.equals = function() {
    result = screen.evaluate();
    sounds[targetSound].addOscillator(result);
  }


  p.second = function() {
    second = !second;
    if (playAllMode) {second = false;}
    playAllMode = false;
    for (let btn of buttons) {
      if (btn.label === "▶︎") {
        btn.updateColor(defaultButtonColor);
      }
    }
  }

  p.clear = function() {
    screen.text = "";
    if (second) {
      sounds[targetSound].clearOscillators();
      second = false;
    }
  }

  p.plus = function() {
    screen.text += "+";
  }
  p.minus = function() {
    screen.text += "-";
  }
  p.multiply = function() {
    screen.text += "*";
  }
  p.divide = function() {
    screen.text += "/";
  }
  p.decimal = function() {
    screen.text += ".";
  }
  p.zero = function() {
    screen.text += "0";
  }
  p.one = function() {
    if (second) {
      targetSound = 0;
      second = false;
    }
    else if (playAllMode) {
      sounds[0].playAll();
    }
    else {screen.text += "1";}
  }
  p.two = function() {
    if (second) {
      targetSound = 1;
      second = false;
    }
    else if (playAllMode) {
      sounds[1].playAll();
    }
    else {screen.text += "2";}
  }
  p.three = function() {
    if (second) {
      targetSound = 2;
      second = false;
    }
    else if (playAllMode) {
      sounds[2].playAll();
    }
    else {screen.text += "3";}
  }
  p.four = function() {
    if (second) {
      targetSound = 3;
      second = false;
    }
    else if (playAllMode) {
      sounds[3].playAll();
    }
    else {screen.text += "4";}
  }
  p.five = function() {
    if (second) {
      targetSound = 4;
      second = false;
    }
    else if (playAllMode) {
      sounds[4].playAll();
    }
    else {screen.text += "5";}
  }
  p.six = function() {
    if (second) {
      targetSound = 5;
      second = false;
    }
    else if (playAllMode) {
      sounds[5].playAll();
    }
    else {screen.text += "6";}
  }
  p.seven = function() {
    if (second) {
      targetSound = 6;
      second = false;
    }
    else if (playAllMode) {
      sounds[6].playAll();
    }
    else {screen.text += "7";}
  }
  p.eight = function() {
    if (second) {
      targetSound = 7;
      second = false;
    }
    else if (playAllMode) {
      sounds[7].playAll();
    }
    else {screen.text += "8";}
  }
  p.nine = function() {
    if (second) {
      targetSound = 8;
      second = false;
    }
    else if (playAllMode) {
      sounds[8].playAll();
    }
    else {screen.text += "9";}
  }

  p.windowResized = function() {
    let canvas = document.getElementById("overlay-canvas");
    canvas.style.left = (window.innerWidth - p.width) / 2 + 'px';
    canvas.style.top = (window.innerHeight - p.height) / 2 + 'px';
  };

};



new p5(overlaySketch);

let backgroundSketch = function(p) {
  let xScale = 0.015;
  let yScale = 0.02;
  let gap;

  p.setup = function() {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.dotGrid();  // Use the exposed function to draw the grid initially
  };

  // Exposed method: now dotGrid is accessible externally as p.dotGrid
  p.dotGrid = function() {
      p.background(255);
      p.noStroke();
      p.fill(0);
      gap = 4; // Alternatively, read from a slider or control
      
      for (let x = gap / 2; x < p.width; x += gap) {
          for (let y = gap / 2; y < p.height; y += gap) {
              let noiseValue = p.noise(x * xScale, y * yScale);
              let diameter = noiseValue * gap;
              p.circle(x, y, diameter);
          }
      }
  };
};


let myBackground = new p5(backgroundSketch);