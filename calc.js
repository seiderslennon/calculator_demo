let overlaySketch = function(p) {
  let buttons = [];
  let buttonSize = 70;
  let screenDivide = 160;
  let screen = new Screen(p, 340, 80, 50, "");

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

    buttons.push(new Button(p, col0, row0, buttonSize, "2nd"));
    buttons.push(new Button(p, col1, row0, buttonSize, "sin"));
    buttons.push(new Button(p, col2, row0, buttonSize, "C", p.clear));
    buttons.push(new Button(p, col3, row0, buttonSize, "▶︎"));

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
    buttons.push(new Button(p, col2, row4, buttonSize, "="));
    buttons.push(new Button(p, col3, row4, buttonSize, "+", p.plus));


  };

  p.draw = function() {
    // Fill the entire overlay canvas with an opaque background color.
    // For example, a solid black background:
    p.background(0); // Use any opaque color you prefer

    // Now, draw your overlay content on top:
    p.fill(255, 80, 80); // Example fill color
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
    for (let btn of buttons) {
      if (btn.isMouseInside()) {
        btn.activate();
      }
    }
  };

  p.keyPressed = function() {
    for (let btn of buttons) {
      if (p.key === btn.label) {
        btn.activate();
      }
    }
  }

  p.parseEquation = function(equation) {
    // go though screen text and evaluate
    // return the result
  }

  p.equals = function() {
    result = p.parseEquation(screen.text);
    // add to oscillators
    screen.text = result;
  }


  p.clear = function() {
    screen.text = "";
    // addd more for clearing oscs
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
    screen.text += "1";
  }
  p.two = function() {
    screen.text += "2";
  }
  p.three = function() {
    screen.text += "3";
  }
  p.four = function() {
    screen.text += "4";
  }
  p.five = function() {
    screen.text += "5";
  }
  p.six = function() {
    screen.text += "6";
  }
  p.seven = function() {
    screen.text += "7";
  }
  p.eight = function() {
    screen.text += "8";
  }
  p.nine = function() {
    screen.text += "9";
  }

  p.windowResized = function() {
    let canvas = document.getElementById("overlay-canvas");
    canvas.style.left = (window.innerWidth - p.width) / 2 + 'px';
    canvas.style.top = (window.innerHeight - p.height) / 2 + 'px';
  };
};

new p5(overlaySketch);
