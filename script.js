const canvas = document.getElementById('visualization-canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');

// Load the image
const image = new Image();
image.src = 'xfbhhsd.PNG';
image.onload = () => {
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
};

startButton.addEventListener('click', initAudioVisualizer);

function initAudioVisualizer() {
  // Initialize Tone.js
  Tone.start().then(() => {
    const player = new Tone.Player('tekken.mp3');
    player.onload = () => {
      const analyzer = new Tone.Analyser('fft', 1024);
      player.connect(analyzer).start();
      updateVisualization(analyzer);
    };
  });
}

function updateVisualization(analyzer) {
  requestAnimationFrame(() => updateVisualization(analyzer));
  const spectrum = analyzer.getValue();
  const lowFrequencyIntensity = spectrum.slice(0, 100).reduce((sum, value) => sum + Math.abs(value), 0);

  // Create the glow effect
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const glowFactor = lowFrequencyIntensity / 100;
    data[i] += brightness * glowFactor;
    data[i + 1] += brightness * glowFactor;
    data[i + 2] += brightness * glowFactor;
  }
  ctx.putImageData(imageData, 0, 0);
}