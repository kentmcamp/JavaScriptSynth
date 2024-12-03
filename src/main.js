import './style.css'

document.querySelector('#app').innerHTML = `
  <h1>Click To Play Sound</h1>
`

var context;

function createAC() {
  context = new AudioContext();

  var sampleRate = 48000;
  var soundArray = [];

  for (var i = 0; i < sampleRate; i++) {
    soundArray[i] = Math.random() * 2 - 1;
  };

  playSound(soundArray);
}

function playSound(soundArray) {
  var arrayBuffer = context.createBuffer(2, soundArray.length, context.sampleRate);

  for (var channel = 0; channel < arrayBuffer.numberOfChannels; channel++) {
    var samples = arrayBuffer.getChannelData(channel);
    for (var i = 0; i < arrayBuffer.length; i++) {
      samples[i] = soundArray[i];
    }
  }
  var source = context.createBufferSource();
  source.buffer = arrayBuffer;
  source.connect(context.destination);
  source.start();
}

window.onclick = createAC;
