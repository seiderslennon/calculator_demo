// Button.js
class Button {
    constructor(p, x, y, size, label) {
      this.p = p;
      this.x = x;       // center x coordinate
      this.y = y;       // center y coordinate
      this.size = size;
      this.label = label;
    }
    
    display() {
      // Draw the square with the center as (this.x, this.y)
      this.p.fill(200);
      this.p.stroke(0);
      // Draw from top-left relative to the center
      this.p.rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
      
      // Draw the label centered in the button
      this.p.fill(0);
      this.p.textAlign(this.p.CENTER, this.p.CENTER);
      this.p.textSize(20);
      this.p.text(this.label, this.x, this.y);
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
    }
  }

  