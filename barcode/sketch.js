var txt = "▓▖ ▓▖▓▖ ▕ ▖▒▒▔ ▓ ▔▒▒ ▔▕ ▔▓▖ ▓▖▓▖ ▕ ▖▒▒▔ ▓ ▔▒▒ ▔▕ ▔▓▖ ▓▖▓▖ ▕ ▖▒▒▔ ▓ ▔▒▒ ▔▕ ▔";
let font;
let lines = [];
let lineHeight = 50; // Height of each line
let maxLines; // Maximum number of lines that can fit on the canvas
let letterPoints = []; // Array to store points on the letter "A"

function preload() {
    font = loadFont('./font.ttf');
}

function setup() {
    createCanvas(400, 400);
    frameRate(5);
    maxLines = height / lineHeight; // Calculate the maximum number of lines

    // Calculate points on the letter "A"
    let letterBuffer = createGraphics(width, height);
    letterBuffer.textFont(font);
    letterBuffer.textSize(300);
    letterBuffer.fill(255); // Fill letter "A" with white
    letterBuffer.background(0); // Ensure the background of the buffer is black
    letterBuffer.text('A', 50, 300);
    loadLetterPoints(letterBuffer);

    // Populate lines array with initial lines of pattern
    for (let i = 0; i < maxLines; i++) {
        lines.push(txt);
    }
}

function draw() {
    background(0, 0, 255); // Set background color to rag blue
    
    // Shift the text
    var last = txt[txt.length - 1];
    txt = last + txt;
    txt = txt.substring(0, txt.length - 1);
    
    // Update lines array
    lines.push(txt);
    if (lines.length > maxLines) {
        lines.shift();
    }

    // Draw pattern within the letter "A"
    drawPatternInLetterA();
}

function loadLetterPoints(buffer) {
    buffer.loadPixels();
    for (let x = 0; x < buffer.width; x++) {
        for (let y = 0; y < buffer.height; y++) {
            let index = (x + y * buffer.width) * 4;
            if (buffer.pixels[index] === 255) {
                letterPoints.push(createVector(x, y));
            }
        }
    }
    buffer.updatePixels();
}

function drawPatternInLetterA() {
    let patternGraphics = createGraphics(width, height);
    patternGraphics.textFont(font);
    patternGraphics.textSize(30);
    patternGraphics.fill(0); // Fill pattern text with black
    patternGraphics.background(255); // Background of pattern should be white

    let patternStep = 20; // Spacing between lines in pattern
    let patternY = lineHeight; // Starting y position for pattern lines

    for (let i = 0; i < lines.length; i++) {
        let lineText = lines[i];
        let patternX = 0; // Starting x position for pattern lines

        for (let j = 0; j < lineText.length; j++) {
            let char = lineText[j];
            patternGraphics.text(char, patternX, patternY);
            patternX += patternGraphics.textWidth(char);
        }

        patternY += patternStep;
    }

    // Draw only the pixels within the letter "A"
    loadPixels();
    patternGraphics.loadPixels();
    
    for (let point of letterPoints) {
        let x = floor(point.x);
        let y = floor(point.y);
        let index = (x + y * width) * 4;
        pixels[index] = patternGraphics.pixels[index];
        pixels[index + 1] = patternGraphics.pixels[index + 1];
        pixels[index + 2] = patternGraphics.pixels[index + 2];
        pixels[index + 3] = patternGraphics.pixels[index + 3];
    }
    
    updatePixels();
}
