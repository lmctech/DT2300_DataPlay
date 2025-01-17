//adapted from https://editor.p5js.org/a2zitp/sketches/ZaehMFonQ


let cSize =20;
// Data array for storing color information
let data = [];
// Variable to hold color data from JSON
let crayola;
// Array to store the results from UMAP
let umapResults;
// UMAP instance
let umap;

function preload() {
  // Load color data from a JSON file
  crayola = loadJSON('scripts/crayola.json');
}

function setup() {
  // Set up the canvas
  let myCanvas = createCanvas(windowWidth, windowHeight);
  ww = windowWidth;
  wh = windowHeight;
  myCanvas.parent('background_canvas');
  // Convert the loaded hex color data to RGB and store it in the data array
  for (let i = 0; i < crayola.colors.length; i++) {
    let crayolaColor = color(crayola.colors[i].hex);
    data.push([red(crayolaColor), green(crayolaColor), blue(crayolaColor)]);
  }

  // Set a random seed for reproducible results
  randomSeed(1);

  // Initialize UMAP with specified parameters
  umap = new UMAP({
    nNeighbors: 15,
    minDist: 0.1,
    nComponents: 2,
    random: random, // Use p5.js random function
  });

  // Fit the UMAP model with the color data
  umapResults = umap.fit(data);
}

function draw() {
  // Clear the canvas
  background(255);
  noStroke();

  // Determine the bounds for the UMAP results
  let maxW = 0;
  let minW = Infinity;
  let maxH = 0;
  let minH = Infinity;
  for (let i = 0; i < umapResults.length; i++) {
    maxW = max(maxW, umapResults[i][0]);
    minW = min(minW, umapResults[i][0]);
    maxH = max(maxH, umapResults[i][1]);
    minH = min(minH, umapResults[i][1]);
  }

  // Draw the UMAP results on the canvas
  for (let i = 0; i < umapResults.length; i++) {
    // Set the fill color based on the original data
    fill(data[i][0], data[i][1], data[i][2]);
    // Map the 2D UMAP output to canvas coordinates
    let x = map(umapResults[i][0], minW, maxW, 10, width - 10);
    let y = map(umapResults[i][1], minH, maxH, 10, height - 10);
    // Draw a circle for each data point
    if(toucher(x,y)){
      cSize=40;
      textSize(25);
      textFont('Overpass');
      text(crayola.colors[i].color,x+20,y);
    }
    else{
      cSize=20;
    }
    circle(x, y,cSize);
    
  }
}


function toucher(x,y)
{
  
  let d = dist(x, y, mouseX, mouseY);
  if(d<=10){
    return true;
  }
  else{
   return false;
  }
  
}
