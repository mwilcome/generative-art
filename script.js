// Generative Art Gallery - Initial Sketch
// Author: Mike Wilcome

function setup() {
    createCanvas(800, 600);
    background(220);
    frameRate(30);
}

function draw() {
    background(220); // Clear canvas each frame
    
    // Grid of rotating squares
    let gridSize = 50;
    for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
            push();
            translate(x + gridSize / 2, y + gridSize / 2);
            rotate(frameCount * 0.02 + (x + y) * 0.01); // Unique rotation per square
            fill(random(255), random(255), random(255)); // Random colors
            rectMode(CENTER);
            rect(0, 0, gridSize * 0.7, gridSize * 0.7);
            pop();
        }
    }
}