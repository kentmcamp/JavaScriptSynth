// New audio context - a container for running our audio
// We do it in it's own function with an if statement so it's only created once.
var context;
var acInit = false;
var notes = [];

// Audio Generation
var sampleRate = 48000;
var sec = 2;
var amp = .5;
var freq = 440;
var triPeak = 0.5

var period = sampleRate / freq;

function initSound() {
    if (!acInit) {
        context = new AudioContext();
        iniKeys();
        acInit = true;
    }
}

function iniKeys() {
    var numNotes = 88;
    var refPitch = 440;
    var refIdx = 48;
    var twoToOneTwelfth = Math.pow(2, 1/12);

    for (var i=0; i<numNotes; i++) {
        notes[i] = refPitch * Math.pow(twoToOneTwelfth, i - refIdx);
    }
}

function playSound() {
    // 1. Initialize the audio context
    initSound();

    // 5. Create an array to store the sound
    var soundArray = [];

    // Waves
    var type = "sine";

    freq = notes[44];
    period = sampleRate / freq;

    switch (type) {
        case "sine": makeSineWave(soundArray); break;
        case "square": makeSquareWave(soundArray); break;
        case "triangle": makeTriangleWave(soundArray); break;
        case "noise": makeNoise(soundArray); break;
    }

    // 6. Pass the array to the buffer
    playBuffer(soundArray);
}

// Wave Functions
// Sine Wave
function makeSineWave(soundArray) {
    for (var i = 0; i < sampleRate * sec; i++) {
        soundArray[i] = Math.sin(i/period*2*Math.PI) * amp;
    }
};

// Square Wave
function makeSquareWave(soundArray) {
    for (var i = 0; i < sampleRate * sec; i++) {
        soundArray[i] = ((i % period) < (period / 2) ? 1 : -1) * amp;
    }
}

// Triangle Wave
function makeTriangleWave(soundArray) {
    var tp2 = triPeak / 2;
    var itp2 = 1 - tp2;

    for (var i = 0; i < sampleRate * sec; i++) {
        var perc = (i % period) / period;
        var samp = 0;
        if (perc < tp2) {
            samp = perc / tp2;
        } else if (perc < itp2) {
            var perc2 = perc - tp2;
            samp = perc2 / (itp2 - tp2) * -2 + 1;
        } else {
            samp = (perc - itp2) / tp2 * -1;
        }
        soundArray[i] = samp * amp;
    }
}

// Noise
function makeNoise(soundArray) {
    for (var i = 0; i < sampleRate * sec; i++) {
        soundArray[i] = (Math.random()*2-1) * amp;
    }
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
