let neutronInput, protonInput, electronInput;
let neutronPositions = [];
let protonPositions = [];
const particleRadius = 20;

let elementNameDisplay, particleCountDisplay;

function setup() {
  createCanvas(800, 600, WEBGL);
  background(0);
  orbitControl();

  // Input fields
  neutronInput = createInput('6');
  neutronInput.position(10, 10);
  createP('Neutrons').position(100, 10);

  protonInput = createInput('6');
  protonInput.position(10, 40);
  createP('Protons').position(100, 40);

  electronInput = createInput('6');
  electronInput.position(10, 70);
  createP('Electrons').position(100, 70);

  // Text displays
  elementNameDisplay = createP('Element: Carbon');
  elementNameDisplay.style('position', 'absolute');
  elementNameDisplay.style('right', '10px');
  elementNameDisplay.style('top', '10px');
  elementNameDisplay.style('color', 'white');
  elementNameDisplay.style('background-color', 'rgba(0, 0, 0, 0.5)');
  elementNameDisplay.style('padding', '5px');
  elementNameDisplay.style('font-size', '18px');
  elementNameDisplay.style('font-family', 'Arial, sans-serif');

  particleCountDisplay = createP('6 protons, 6 neutrons, 6 electrons');
  particleCountDisplay.style('position', 'absolute');
  particleCountDisplay.style('right', '10px');
  particleCountDisplay.style('top', '40px');
  particleCountDisplay.style('color', 'white');
  particleCountDisplay.style('background-color', 'rgba(0, 0, 0, 0.5)');
  particleCountDisplay.style('padding', '5px');
  particleCountDisplay.style('font-size', '16px');
  particleCountDisplay.style('font-family', 'Arial, sans-serif');

  // Event listeners
  neutronInput.input(regeneratePositions);
  protonInput.input(regeneratePositions);
  electronInput.input(updateDisplays);

  regeneratePositions();
  updateDisplays();
}

function draw() {
  background(0);
  ambientLight(100);
  pointLight(255, 255, 255, 0, 0, 300);

  push();
  rotateY(frameCount * 0.01);

  // Neutrons (red)
  for (let pos of neutronPositions) {
    push();
    translate(pos.x, pos.y, pos.z);
    fill(255, 0, 0);
    noStroke();
    sphere(particleRadius);
    pop();
  }

  // Protons (blue)
  for (let pos of protonPositions) {
    push();
    translate(pos.x, pos.y, pos.z);
    fill(0, 0, 255);
    noStroke();
    sphere(particleRadius);
    pop();
  }

  // Electrons (yellow arcs)
  const electronCount = parseInt(electronInput.value()) || 0;
  const arcFraction = 0.7;
  const arcAngle = TWO_PI * arcFraction;
  const radius = 100;
  const speed = 0.02;

  for (let i = 0; i < electronCount; i++) {
    push();
    rotateX(i * PI / electronCount);
    let startAngle = frameCount * speed + i * TWO_PI / electronCount;
    let endAngle = startAngle + arcAngle;

    stroke(255, 255, 0, 100);
    strokeWeight(3);
    noFill();
    beginShape();
    for (let angle = startAngle; angle < endAngle; angle += 0.1) {
      let x = radius * cos(angle);
      let y = radius * sin(angle);
      vertex(x, y, 0);
    }
    endShape();
    pop();
  }
  pop();
}

function updateDisplays() {
  let protonCount = parseInt(protonInput.value()) || 0;
  let neutronCount = parseInt(neutronInput.value()) || 0;
  let electronCount = parseInt(electronInput.value()) || 0;
  let elementName = getElementName(protonCount);

  elementNameDisplay.html(`Element: ${elementName}`);
  particleCountDisplay.html(`${protonCount} protons, ${neutronCount} neutrons, ${electronCount} electrons`);
}

function getElementName(protonCount) {
  if (protonCount < 1 || protonCount > elements.length) return "Unknown Element";
  return elements[protonCount - 1];
}

function regeneratePositions() {
  const neutronCount = parseInt(neutronInput.value()) || 0;
  const protonCount = parseInt(protonInput.value()) || 0;
  generateParticlePositions(neutronCount, protonCount);
  updateDisplays();
}

function generateParticlePositions(neutronCount, protonCount) {
  neutronPositions = [];
  protonPositions = [];
  let allPositions = [];
  let totalParticles = neutronCount + protonCount;

  if (totalParticles > 0) allPositions.push(createVector(0, 0, 0));

  let attempts = 0;
  const maxAttempts = 1000;

  while (allPositions.length < totalParticles && attempts < maxAttempts) {
    let basePos = random(allPositions);
    let theta = random(0, TWO_PI);
    let phi = random(0, PI);
    let x = 2 * particleRadius * sin(phi) * cos(theta);
    let y = 2 * particleRadius * sin(phi) * sin(theta);
    let z = 2 * particleRadius * cos(phi);
    let newPos = p5.Vector.add(basePos, createVector(x, y, z));

    let tooClose = false;
    for (let pos of allPositions) {
      if (p5.Vector.dist(newPos, pos) < particleRadius * 1.5) {
        tooClose = true;
        break;
      }
    }
    if (!tooClose) allPositions.push(newPos);
    attempts++;
  }

  for (let i = 0; i < allPositions.length; i++) {
    if (i < neutronCount) neutronPositions.push(allPositions[i]);
    else if (i < neutronCount + protonCount) protonPositions.push(allPositions[i]);
  }
}