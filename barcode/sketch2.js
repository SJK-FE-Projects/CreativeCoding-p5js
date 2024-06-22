var txt = "▓▖ ▓▖▓▖ ▕ ▖▒▒▔ ▓ ▔▒▒ ▔▕ ▔▓▖ ▓▖▓▖ ▕ ▖▒▒▔ ▓ ▔▒▒ ▔▕ ▔▓▖ ▓▖▓▖ ▕ ▖▒▒▔ ▓ ▔▒▒ ▔▕ ▔";
let font;
let lines = [];
let lineHeight = 50; // Height of each line
let maxLines; // Maximum number of lines that can fit on the canvas
let letterBuffer; // Off-screen buffer for the letter
let letterImage; // Image for masking

function preload() {
    font = loadFont('./font.ttf');
}

function setup() {
    createCanvas(400, 400);
    frameRate(5);
    maxLines = height / lineHeight; // Calculate the maximum number of lines

    // Create off-screen buffer
    letterBuffer = createGraphics(width, height);
    letterBuffer.textFont(font);
    letterBuffer.textSize(300);
    letterBuffer.fill(255); // Fill letter "A" with white
    letterBuffer.text('A', 50, 300);

    // Create an image from the buffer for masking
    letterImage = createImage(width, height);
    letterImage.copy(letterBuffer, 0, 0, width, height, 0, 0, width, height);
}

function draw() {
    background(0, 0, 255); // Set background color to rag blue
    
    // Shift the text
    var last = txt[txt.length - 1];
    txt = last + txt;
    txt = txt.substring(0, txt.length - 1);
    
    // Add the new line at the end of the lines array
    lines.push(txt);

    // If the number of lines exceeds the canvas height, remove the top line
    if (lines.length > maxLines) {
        lines.shift();
    }

    // Create the pattern
    let pattern = createGraphics(width, height);
    pattern.textSize(50);
    pattern.fill(255); // Fill pattern text with black
    for (let i = 0; i < lines.length; i++) {
        pattern.text(lines[i], 0, lineHeight * (i + 1));
    }

    // Create an image from the pattern graphics
    let patternImage = createImage(width, height);
    patternImage.copy(pattern, 0, 0, width, height, 0, 0, width, height);

    // Apply the mask to the pattern image
    patternImage.mask(letterImage);
    image(patternImage, 0, 0);
}
