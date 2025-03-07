let neutronInput, protonInput, electronInput;
let neutronPositions = [];
let protonPositions = [];
const particleRadius = 20; // Size of neutron/proton spheres

function setup() {
    createCanvas(800, 600, WEBGL);
    background(0);
    orbitControl();

    // Input fields for neutrons, protons, and electrons
    neutronInput = createInput('6');
    neutronInput.position(10, 10);
    createP('Neutrons').position(100, 10);

    protonInput = createInput('6');
    protonInput.position(10, 40);
    createP('Protons').position(100, 40);

    electronInput = createInput('4');
    electronInput.position(10, 70);
    createP('Electrons').position(100, 70);

    // Update positions when inputs change
    neutronInput.input(regeneratePositions);
    protonInput.input(regeneratePositions);

    regeneratePositions(); // Initial setup
}

function draw() {
    background(0);
    ambientLight(100);
    pointLight(255, 255, 255, 0, 0, 300);

    // Spin the entire model
    push();
    rotateY(frameCount * 0.01);

    // Draw neutrons (red spheres)
    for (let pos of neutronPositions) {
        push();
        translate(pos.x, pos.y, pos.z);
        fill(255, 0, 0);
        noStroke();
        sphere(particleRadius);
        pop();
    }

    // Draw protons (blue spheres)
    for (let pos of protonPositions) {
        push();
        translate(pos.x, pos.y, pos.z);
        fill(0, 0, 255);
        noStroke();
        sphere(particleRadius);
        pop();
    }

    // Draw electrons as partial noodle-shaped arcs
    const electronCount = parseInt(electronInput.value()) || 0;
    const arcFraction = 0.7; // 70% of a full circle
    const arcAngle = TWO_PI * arcFraction; // Approximately 252 degrees in radians
    const radius = 100; // Distance from nucleus
    const speed = 0.02; // Animation speed

    for (let i = 0; i < electronCount; i++) {
        push();
        rotateX(i * PI / electronCount); // Unique tilt for each electron's plane
        let startAngle = frameCount * speed + i * TWO_PI / electronCount;
        let endAngle = startAngle + arcAngle;

        stroke(255, 255, 0, 100); // Semi-transparent yellow for visibility
        strokeWeight(3); // Thin noodle effect
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

function regeneratePositions() {
    const neutronCount = parseInt(neutronInput.value()) || 0;
    const protonCount = parseInt(protonInput.value()) || 0;
    generateParticlePositions(neutronCount, protonCount);
}

function generateParticlePositions(neutronCount, protonCount) {
    neutronPositions = [];
    protonPositions = [];
    let allPositions = [];

    let totalParticles = neutronCount + protonCount;
    if (totalParticles > 0) {
        allPositions.push(createVector(0, 0, 0)); // First particle at origin
    }

    let attempts = 0;
    const maxAttempts = 1000;

    // Generate positions for all particles
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

        if (!tooClose) {
            allPositions.push(newPos);
        }
        attempts++;
    }

    // Assign positions to neutrons and protons
    for (let i = 0; i < allPositions.length; i++) {
        if (i < neutronCount) {
            neutronPositions.push(allPositions[i]);
        } else if (i < neutronCount + protonCount) {
            protonPositions.push(allPositions[i]);
        }
    }
}