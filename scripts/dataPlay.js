//adapted from https://editor.p5js.org/a2zitp/sketches/ANn4gUQfP


let cSize =20;
// Data array for storing color information
let data = [];
// Variable to hold color data from JSON
let crayola;
// Array to store the results from UMAP
let umapResults;
// UMAP instance
let umap;
// Boolean to check if UMAP is currently processing
let isUMAPRunning = false;
// Sliders for UMAP parameters
let nNeighborsSlider, minDistSlider;
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

  // Create a slider to adjust the number of neighbors in UMAP
  nNeighborsSlider = createSlider(1, 50, 15);
  // Rerun UMAP whenever the slider value changes
  nNeighborsSlider.input(runUMAP);
  nNeighborsSlider.class('slider');
  // Create a slider to adjust the minimum distance in UMAP
  minDistSlider = createSlider(0, 1, 0.1, 0.01);
  // Rerun UMAP whenever the slider value changes
  minDistSlider.class('slider');
  minDistSlider.input(runUMAP);


  // Run UMAP initially with default slider values
  runUMAP();
}

function draw() {
  // Set background color
  background(255);

  // Process UMAP in each draw cycle
  for (let i = 0; i < 100; i++) {
    if (isUMAPRunning) {
      let result = umap.step();
      isUMAPRunning = result;
    }
  }

  // Draw the UMAP embedding on the canvas
  drawEmbedding();
}

// Function to initialize and run UMAP with current slider values
function runUMAP() {
  umap = new UMAP({
    nNeighbors: nNeighborsSlider.value(),
    minDist: minDistSlider.value(),
    nComponents: 2,
  });
  umap.initializeFit(data);
  isUMAPRunning = true;
}

// Function to draw the UMAP embedding as circles on the canvas
function drawEmbedding() {
  noStroke();
  // Retrieve the current embedding from UMAP
  let embedding = umap.getEmbedding();
  for (let i = 0; i < embedding.length; i++) {
    let data2D = embedding[i];
    // Use the original color data for each point
    fill(data[i][0], data[i][1], data[i][2]);
    // Map the 2D UMAP output to canvas coordinates
    let x = map(data2D[0], -10, 10, 0, width);
    let y = map(data2D[1], -10, 10, 0, height);
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
