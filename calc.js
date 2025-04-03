let overlaySketch = function(p) {
  let buttons = [];
  let buttonSize = 70;
  let screenDivide = 160;
  let nameInput;


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

    buttons.push(new Button(p, col0, row0, buttonSize, "play"));
    buttons.push(new Button(p, col1, row0, buttonSize, "sin"));
    buttons.push(new Button(p, col2, row0, buttonSize, "bcksp"));
    buttons.push(new Button(p, col3, row0, buttonSize, "2nd"));

    buttons.push(new Button(p, col0, row1, buttonSize, "7"));
    buttons.push(new Button(p, col1, row1, buttonSize, "8"));
    buttons.push(new Button(p, col2, row1, buttonSize, "9"));
    buttons.push(new Button(p, col3, row1, buttonSize, "/"));

    buttons.push(new Button(p, col0, row2, buttonSize, "4"));
    buttons.push(new Button(p, col1, row2, buttonSize, "5"));
    buttons.push(new Button(p, col2, row2, buttonSize, "6"));
    buttons.push(new Button(p, col3, row2, buttonSize, "*"));
  
    buttons.push(new Button(p, col0, row3, buttonSize, "1"));
    buttons.push(new Button(p, col1, row3, buttonSize, "2"));
    buttons.push(new Button(p, col2, row3, buttonSize, "3"));
    buttons.push(new Button(p, col3, row3, buttonSize, "-"));

    buttons.push(new Button(p, col0, row4, buttonSize, "C"));
    buttons.push(new Button(p, col1, row4, buttonSize, "0"));
    buttons.push(new Button(p, col2, row4, buttonSize, "="));
    buttons.push(new Button(p, col3, row4, buttonSize, "+"));

    
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
  };

  p.windowResized = function() {
    let canvas = document.getElementById("overlay-canvas");
    canvas.style.left = (window.innerWidth - p.width) / 2 + 'px';
    canvas.style.top = (window.innerHeight - p.height) / 2 + 'px';
  };
};

new p5(overlaySketch);
