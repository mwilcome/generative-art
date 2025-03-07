let neutronInput, protonInput;
let neutronPositions = [];
let protonPositions = [];
const particleRadius = 10;

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

    // Add event listeners for real-time updates
    neutronInput.input(regeneratePositions);
    protonInput.input(regeneratePositions);

    regeneratePositions(); // Initial setup
}

function draw() {
    background(0);
    ambientLight(100);
    pointLight(255, 255, 255, 0, 0, 300);

    // Start transformation for spinning
    push();
    rotateY(frameCount * 0.01); // Rotate around Y-axis based on frameCount

    // Draw neutrons (red)
    for (let pos of neutronPositions) {
        push();
        translate(pos.x, pos.y, pos.z);
        fill(255, 0, 0);
        noStroke();
        sphere(particleRadius);
        pop();
    }

    // Draw protons (blue)
    for (let pos of protonPositions) {
        push();
        translate(pos.x, pos.y, pos.z);
        fill(0, 0, 255);
        noStroke();
        sphere(particleRadius);
        pop();
    }

    // End transformation for spinning
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

    // Generate all particle positions
    let totalParticles = neutronCount + protonCount;
    if (totalParticles > 0) {
        allPositions.push(createVector(0, 0, 0)); // First particle at origin
    }

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