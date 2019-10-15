var jake;
var pixels = [];
var mySong;
var firstTime = true;

function preload() {
  // Load the IMAGE and the SONG
  jake = loadImage("./assets/jake.png");
  mySong = loadSound("./assets/bacon_pancake.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight)

  //set the dimension of the single square pixel
  var pixelDimension = 10;
  //set the dimension of the whole image
  var squareDimension = 400

  //create the IMAGE
  imageMode(CENTER);
  image(jake, width / 2, height / 2, squareDimension, squareDimension);

  //create the analyzer of the VOLUME
  analyzer = new p5.Amplitude();
  analyzer.setInput(mySong);

  //create the pixel-art image based on the starting image:
  //for each point create a PIXEL getting X, Y and the COLOR of the image
  for (var x = -squareDimension / 2; x < squareDimension / 2; x += pixelDimension) {
    for (var y = -squareDimension / 2; y < squareDimension / 2; y += pixelDimension) {
      //get the POSITION
      var tempX = width / 2 + x;
      var tempY = height / 2 + y;
      //get the COLOR
      var tempColor = get(tempX, tempY);

      //create the PIXEL object and push it on the PIXELS array
      var tempPix = new Pixel(tempX, tempY, pixelDimension, tempColor)
      pixels.push(tempPix);
    }
  }

}

function draw() {

  background("black")

  //move (adding the VOLUME and the NOISE trasformation)
  //and draw each PIXEL of the PIXELS array
  for (var i = 0; i < pixels.length; i++) {
    var volume = 0;
    //get the VOLUME of the song
    //and set its value from 0 to HEIGHT
    volume = analyzer.getLevel();
    volume = map(volume, 0, 1, 0, height);

    //take the PIXEL obeject from the array
    var b = pixels[i];
    //apply the transformations
    b.noisy()
    //draw the PIXEL
    b.display(volume);
  }
}


//PIXEL OBJECT
function Pixel(_x, _y, _dim, _color) {

  //construction PROPERTIES
  this.x = _x;
  this.y = _y;
  this.color = _color;
  this.dimension = _dim
  //starting PROPERTIES
  this.dirX;
  this.dirY;
  //set a random NOISE to each new PIXEL
  this.noiseSeed = random();
  this.noise


  //METHODS

  //the DISPLAY method move the PIXEL according to
  //the VOLUME, POSITION and NOISE
  this.display = function(_vol) {

    //set the direction (positive or negative)
    if (this.x > width / 2) {
      this.dirX = 1;
    } else {
      this.dirX = -1;
    }

    if (this.y > height / 2) {
      this.dirY = 1;
    } else {
      this.dirY = -1;
    }

    //MOVE and DRAW the PIXEL
    push();

    //set color and stroke
    fill(this.color);
    noStroke();

    //find the DISTANCE from the centre and the ANGLE
    dx = abs(width / 2 - this.x);
    dy = abs(height / 2 - this.y);
    angle = atan2(dy, dx);

    //set X and Y translation
    //based on:
    //VOLUME (_vol) -> more volume, more translation
    //ANGLE (angle) -> to set the direction of the translation
    //DISTANCE (dx, dy) -> more distance, more translation
    //NOISE (this.noise)
    //0.00003 -> is and adjustment costant
    transformX = cos(angle) * _vol * sq(dx) * 0.00003 * this.noise;
    transformY = sin(angle) * _vol * sq(dy) * 0.00003 * this.noise;

    //TRANSLATE applying the direction positive or negative (this.dirX, this.dirY)
    translate(transformX * this.dirX, transformY * this.dirY);
    //draw the square
    square(this.x, this.y, this.dimension);
    pop();
  }

  //refresh the NOISE value based on the random value of this.noiseSeed
  this.noisy = function() {
    this.noise = noise(frameCount / 100 + this.noiseSeed);
  }


}

//the mouseClicked function starts the song
//the first time you click and sets it in loop
function mouseClicked() {
  if (firstTime == true) {
    mySong.play();
    mySong.setLoop(true);
    firstTime = false;
  }
}
