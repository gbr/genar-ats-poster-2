let audio;
let fft;

function preload() {
  audio = loadSound(
    "https://accd-ats-sp23.s3.us-west-1.amazonaws.com/nancarrow-4-cut-1.mp3"
  );
}

function setup() {
  createCanvas(895, 1280, document.getElementById("canvas-ar"));
  pixelDensity(1);
  fft = new p5.FFT(0.8); // Create an FFT object with smoothing
  noLoop(); // Initially stop the drawing loop
}

function draw() {
  background(0);

  let spectrum = fft.analyze();
  let mid = fft.getEnergy("mid"); // Focus on mid-range frequencies
  let high = fft.getEnergy("treble"); // Focus on high-range frequencies

  let centerX = width / 2;
  let centerY = height / 2;
  let numDots = 200;
  let maxRadius = 300;
  let numBands = 10;
  let dotSize = 3;
  let time = millis() / 1000; // Current time in seconds

  for (let band = 0; band < numBands; band++) {
    let radius = (band + 1) * (maxRadius / numBands);
    let frequency = 2 + band;

    // Use FFT data to adjust the variation
    let baseVariation =
      map(mid, 0, 255, 10, 50) + band * map(high, 0, 255, 1, 10);
    let animatedVariation =
      baseVariation + sin(time * (band + 1)) * (baseVariation * 0.5);

    for (let i = 0; i < numDots; i++) {
      let angleOffset = time * (1 + band / 5);
      let angle = map(i, 0, numDots, 0, TWO_PI) + angleOffset;
      let amplitude = sin(angle * frequency) * animatedVariation;
      let x = centerX + cos(angle) * (radius + amplitude);
      let y = centerY + sin(angle) * (radius + amplitude);
      fill(255);
      noStroke();
      ellipse(x, y, dotSize, dotSize);
    }
  }
}

function mouseClicked() {
  if (audio.isPlaying()) {
    // .isPlaying() returns a boolean
    audio.pause(); // .play() will resume from .pause() position
    noLoop();
  } else {
    audio.play();
    loop();
  }
}
