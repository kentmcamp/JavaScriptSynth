// New audio context - a container for running our audio
// We do it in it's own function with an if statement so it's only created once.
var context;
var audioContextInit = false;

// Audio Generation
var sampleRate = 48000;
var sec = 2;
var amp = .5;
var freq = 440;
var period = sampleRate / freq;


function initAudioContext() {
    if (!audioContextInit) {
        context = new AudioContext();
        audioContextInit = true;
    }
}

function playSound() {
    // 1. Initialize the audio context
    initAudioContext();

    // 5. Create an array to store the sound
    var soundArray = [];


    // Waves
    var type = "square";
    switch (type) {
        case "sine": makeSineWave(soundArray); break;
        case "square": makeSquareWave(soundArray); break;
        case "triangle": makeTriangleWave(soundArray); break;
        case "noise": makeNoise(soundArray); break;
    }

    for (var i = 0; i < sampleRate * sec; i++) {
        // sine wave
        soundArray[i] = Math.sin ( i / period * 2 * Math.PI) * amp;
    }

    // 6. Pass the array to the buffer
    playBuffer(soundArray);
}

// Wave Functions
// Sine Wave
function makeSineWave(soundArray) {

};

// Square Wave
function makeSquareWave(soundArray) {

}

// Triangle Wave
function makeTriangleWave(soundArray) {

}

// Noise
function makeNoise(soundArray) {

}


// Outputs the audio that we want to play to the speakers
function playBuffer(soundArray) {
    // 2. Use the audio context to create an audio buffer - where we store the values for the audio.
    // Arguments: number of channels, length of the buffer, sample rate (samples per second, default is 44100)
    var arrayBuffer = context.createBuffer(2, soundArray.length, context.sampleRate);

    // 3. Loop to make both speakers play the same audio
    for (var channel = 0; channel < arrayBuffer.numberOfChannels; channel++) {
        var samples = arrayBuffer.getChannelData(channel);
        for (var i = 0; i < arrayBuffer.length; i++) {
            samples[i] = soundArray[i];
        }
    }

    // 4. Create a buffer source node, which is needed to play the buffer
    var source = context.createBufferSource();
    source.buffer = arrayBuffer;
    source.connect(context.destination);
    source.start();
}

// 7. Clicking event to play the sound (browsers require user interaction to play audio)
window.onclick = playSound;
