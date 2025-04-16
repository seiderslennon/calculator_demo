class Button {
  constructor(p, x, y, size, label, callback) {
    this.p = p;
    this.x = x;       // center x coordinate
    this.y = y;       // center y coordinate
    this.size = size;
    this.label = label;
    this.callback = callback; // Optional callback function
    // Default button color (optional)
    this.buttonColor = 200;
  }
  
  display() {
    // Use the updated buttonColor property if available
    this.p.fill(this.buttonColor);
    this.p.stroke(0);
    // Draw from top-left relative to the center
    this.p.rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    
    // Draw the label centered in the button
    this.p.fill(0);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(20);
    this.p.text(this.label, this.x, this.y);
  }

  updateColor(color) {
    // Update the button's color by setting the buttonColor property to the new color value.
    this.buttonColor = color;
  }

  isMouseInside() {
    // Check if the mouse is within the bounds of the square button
    return (
      this.p.mouseX >= this.x - this.size / 2 &&
      this.p.mouseX <= this.x + this.size / 2 &&
      this.p.mouseY >= this.y - this.size / 2 &&
      this.p.mouseY <= this.y + this.size / 2
    );
  }
  
  activate() {
    console.log("Button " + this.label + " activated!");
    // Additional functionality can be added here
    if (this.callback) {
      this.callback(); // Call the callback function
    }
  }
}


class Screen {
  constructor(p, x, y, size, text) {
      this.p = p;
      this.x = x;       // center x coordinate
      this.y = y;       // center y coordinate
      this.size = size;
      this.text = text;
  }

  display() {
      this.p.fill(0);
      this.p.textAlign(this.p.RIGHT);
      this.p.textSize(this.size);
      this.p.text(this.text, this.x, this.y);
  }

  evaluate() {
    const validPattern = /^[0-9+\-*/. ()]+$/;
    if (!validPattern.test(this.text)) {
        this.text = "Error";
        return "Error";
    }
    
    try {
        const result = eval(this.text);
        const limitedResult = (typeof result === "number") ? Number(result.toFixed(2)) : result;
        this.text = limitedResult.toString();
        return limitedResult;
    } catch (e) {
        this.text = "Error";
        return "Error";
    }
  }
}

class Sound {
  constructor() {
    this.oscillators = [];
    this.env = new p5.Envelope();
    this.env.setADSR(0.015, 1, 1, 0.01);
  }

  addOscillator(freq) {
    let osc = new p5.Oscillator('sine');
    osc.freq(freq);
    osc.amp(0);
    osc.start();
    this.oscillators.push(osc);
  }

  clearOscillators() {
    this.stopAll();
    for (let osc of this.oscillators) {
      osc.stop();
    }
    this.oscillators = [];
  }

  playAll() {
    for (let osc of this.oscillators) {
      this.env.triggerAttack(osc);
    }
  }

  stopAll() {
    for (let osc of this.oscillators) {
      this.env.triggerRelease(osc);
    }
  }
}

  