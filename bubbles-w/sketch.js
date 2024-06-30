let font;
let points;
let speeds = [];
let outerGradientColors = [];
let innerGradientColors = [];
let phase = 1; // Track phase: 1 for moving with offset, 2 for returning to start
let lastChangeTime = 0; // Last time the phase was changed
let interval = 10000; // Interval for phase change in milliseconds (10 seconds)
let phaseFactor = 0; // Interpolation factor

//////////////////////////////// Initial Perlin noise move text
let xoff = 0; // Offset value for x
let yoff = 1000; // Offset value for y to ensure different noise values for x and y
let targetX, targetY; // Target positions for the text
let currentX, currentY; // Current positions for the text
let easing = 0.5; // Easing factor
////////////////////////////////

function preload() {
  font = loadFont('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxM.woff');
}

function setup() {
  createCanvas(1500, 1000);
  textFont(font);
  textSize(1000);
  
  // Define gradient colors for outer and inner paths
  outerGradientColors = [
    color(219, 198, 86),  // Gold
    color(0, 102, 153),   // Blue
    color(256, 256, 256)  // White
  ];

  innerGradientColors = [
    color(255, 0, 0),     // Red
    color(0, 255, 0),     // Green
    color(0, 0, 255)      // Blue
  ];

  // Get points for the letter 'W'
  points = font.textToPoints('W', 100, 800, 1000, {
    sampleFactor: 1, // Increase for more points
    simplifyThreshold: 0.02
  });

  
  
  // Assign random speeds to each point
  for (let i = 0; i < points.length; i++) {
    speeds.push(random(0.1, 1));  // Random speed between 0.1 and 1
  }

  // Initialize current positions at the center of the canvas
  currentX = width / 2;
  currentY = height / 2;
}

function draw() {
  background(255);
  strokeWeight(1);
  stroke(51);
  //////////////////////////////// Perlin noise move text
  textSize(64);
  stroke(0);
  strokeWeight(1);
  // Generate target positions using Perlin noise
  targetX = noise(xoff) * width;
  targetY = noise(yoff) * height;

  // Interpolate current positions towards target positions
  currentX = lerp(currentX, targetX, easing);
  currentY = lerp(currentY, targetY, easing);

  // Display the text
  text("Hello, world!", currentX, currentY);


  // Increment the offset values for continuous movement
  xoff += 0.01;
  yoff += 0.01;
  ////////////////////////////////

  let scatterRadius = 150;  // Max distance to scatter

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
    drawGradientEllipse(newX, newY, 90, 90, gradientColors[0], gradientColors[1], gradientColors[2]);
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
