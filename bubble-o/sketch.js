let font;
let points;
let speeds = [];
let outerGradientColors = [];
let innerGradientColors = [];
let phase = 1; // Track phase: 1 for moving with offset, 2 for returning to start
let lastChangeTime = 0; // Last time the phase was changed
let interval = 10000; // Interval for phase change in milliseconds (10 seconds)
let phaseFactor = 0; // Interpolation factor

// Define colors as variables
let oc1, oc2, oc3, ic1, ic2, ic3;

function preload() {
  font = loadFont('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxM.woff');
}

function setup() {
  createCanvas(1000, 1000);
  textFont(font);
  textSize(1000);
  
  // Initialize colors
  oc1 = color(219, 198, 86);  // Gold
  oc2 = color(0, 102, 153);   // Blue
  oc3 = color(256, 256, 256); // White

  ic1 = color(255, 0, 0);     // Red
  ic2 = color(0, 255, 0);     // Green
  ic3 = color(0, 0, 255);     // Blue
  


  // Inner colors
  innerGradientColors = [ic2, oc1, ic3];
  
  // Define gradient colors for outer and inner paths
  outerGradientColors = [ic1, oc2, oc3];
  
  // Get points for the letter 'O'
  points = font.textToPoints('O', 100, 800, 1000, {
    sampleFactor: 0.5, // Increase for more points
    simplifyThreshold: 0.02
  });
  
  // Assign random speeds to each point
  for (let i = 0; i < points.length; i++) {
    speeds.push(random(0.1, 1));  // Random speed between 0.1 and 1
  }

  // Draw the radial gradient background using oc2 and oc3
  drawRadialGradientBackground(width / 2, height / 2, max(width*2 , height*2), oc3, oc3);
}

function draw() {
  // No need to call background here, the setup already handles it
  strokeWeight(1);
  stroke(255);

  let scatterRadius = 200;  // Max distance to scatter

  // Calculate the elapsed time since the last phase change
  let elapsedTime = millis() - lastChangeTime;

  // Check if 10 seconds have passed to switch phases
  if (elapsedTime > interval) {
    phase = (phase % 2) + 1; // Toggle between phase 1 and 2
    lastChangeTime = millis(); // Reset the last change time
    elapsedTime = 0; // Reset elapsed time
  }

  // Calculate the phase factor smoothly
  if (phase === 1) {
    phaseFactor = elapsedTime / interval; // Increase factor from 0 to 1
  } else {
    phaseFactor = 1 - (elapsedTime / interval); // Decrease factor from 1 to 0
  }

  // Draw circles along the path
  for (let i = 0; i < points.length; i++) {
    let index = (i + floor(frameCount * speeds[i])) % points.length;
    let angle = atan2(points[index].y - height / 2, points[index].x - width / 2);
    let scatterOffset = phaseFactor * scatterRadius * sin(TWO_PI * (frameCount + i) / 200); // Calculate scatter offset with phase factor

    // Determine gradient colors based on whether it's an inner or outer ellipse
    let gradientColors = (scatterOffset > 0) ? outerGradientColors : innerGradientColors;

    // Calculate new position with scatter effect
    let newX = points[index].x + scatterOffset * cos(angle);
    let newY = points[index].y + scatterOffset * sin(angle);

    // Draw ellipse with radial gradient
    drawGradientEllipse(newX, newY, 100, 100, gradientColors[0], gradientColors[1], gradientColors[2]);
  }
}

function drawGradientEllipse(x, y, w, h, c1, c2, c3) {
  noFill();
  for (let r = w / 2; r > 0; --r) {
    let interA = map(r, 0, w / 2, 0, 1);
    let interB = map(r, 0, w / 2, 1, 0.5);
    let c = lerpColor(lerpColor(c1, c2, interA), c3, interB);
    stroke(c);
    ellipse(x, y, r * 2, r * 2);
  }
}

function drawRadialGradientBackground(x, y, diameter, c1, c2) {
  noFill();
  for (let r = diameter / 2; r > 0; --r) {
    let inter = map(r, 0, diameter / 2, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    ellipse(x, y, r * 2, r * 2);
  }
}
