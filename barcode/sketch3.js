var txt = "▓▖ ▓▖▓▖ ▕ ▖▒▒▔ ▓ ▔▒▒ ▔▕ ▔▓▖ ▓▖▓▖ ▕ ▖▒▒▔ ▓ ▔▒▒ ▔▕ ▔▓▖ ▓▖▓▖ ▕ ▖▒▒▔ ▓ ▔▒▒ ▔▕ ▔";
let font;
let lines = [];
let lineHeights = [];
let targetHeights = [];
let lineHeight = 50; // Height of each line
let maxLines; // Maximum number of lines that can fit on the canvas
let blockChars = '▓▖ ▕ ▔▒'; // Set of ASCII block characters
let easing = 0.05; // Easing factor

function setup() {
    frameRate(30);
    createCanvas(1900, 1000);
    // textFont(font);
    textSize(32); // Set the text size
    maxLines = floor(height / lineHeight); // Calculate the maximum number of lines that can fit on the canvas
    for (let i = 0; i < maxLines; i++) {
        lines.push(generateRandomText(txt.length));
        lineHeights.push((i + 1) * lineHeight);
        targetHeights.push((i + 1) * lineHeight);
    }
}

function draw() {
    background(0, 0, 255); // Set background color to rag blue
    
    // Generate a new random text string
    let randomTxt = generateRandomText(txt.length);
    
    // Update lines array and target heights
    lines.push(randomTxt);
    targetHeights.push((lines.length) * lineHeight);
    if (lines.length > maxLines) {
        targetHeights.shift();
    }
    
    // Update the current line heights using lerp for easing
    for (let i = 0; i < lineHeights.length; i++) {
        lineHeights[i] = lerp(lineHeights[i], targetHeights[i], easing);
    }
    
    // Display the text
    for (let i = 0; i < lines.length; i++) {
        let opacity = random(10, 255); // Generate a random opacity between 50 and 255
        let c = color(255, 255, 255, opacity); // Set the text color to white with random opacity
        fill(c); // Apply the fill color
        text(lines[i], 10, lineHeights[i]);
    }
}

function generateRandomText(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += blockChars.charAt(floor(random(blockChars.length)));
    }
    return result;
}
