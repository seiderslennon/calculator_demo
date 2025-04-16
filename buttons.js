class Button {
  constructor(p, x, y, size, label, callback) {
    this.p = p;
    this.x = x;       // center x coordinate within the calculator overlay
    this.y = y;       // center y coordinate within the calculator overlay
    this.size = size;
    this.label = label;
    this.callback = callback; // Optional callback function
    this.buttonColor = 200;   // Default button color
  }
  
  display() {
    this.p.fill(this.buttonColor);
    this.p.stroke(0);
    this.p.rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    
    this.p.fill(0);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(20);
    this.p.text(this.label, this.x, this.y);
  }
  
  updateColor(color) {
    this.buttonColor = color;
  }
  
  isMouseInside(mx, my) {
    const currentX = (mx !== undefined) ? mx : this.p.mouseX;
    const currentY = (my !== undefined) ? my : this.p.mouseY;
    return (
      currentX >= this.x - this.size / 2 &&
      currentX <= this.x + this.size / 2 &&
      currentY >= this.y - this.size / 2 &&
      currentY <= this.y + this.size / 2
    );
  }
  
  activate() {
    console.log("Button " + this.label + " activated!");
    if (this.callback) {
      this.callback();
    }
  }
}

class Screen {
  constructor(p, x, y, size, text) {
    this.p = p;
    this.x = x;       // center x coordinate (for text)
    this.y = y;       // center y coordinate (for text)
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