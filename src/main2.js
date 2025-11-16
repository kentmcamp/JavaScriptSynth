// import './style.css'

document.querySelector('#app').innerHTML = `
  <h1>Click To Play Sound</h1>
`
// New audio context - a container for running our audio
// We do it in it's own function with an if statement so it's only created once.
var context;
var acInit = false;
var notes = [];
var soundArray = [];

var sampleRate = 48000;
var amp = 0.5;

var adsrOn = true;

var triPeak = 0.5;

function initSound()
{
  if (!acInit)
  {
    context = new AudioContext();
    iniKeys();
    acInit = true;
  }
}

function iniKeys()
{
  var numNotes = 88;
  var refPitch = 440;
  var refIdx = 48;
  var twoToOneTwelfth = Math.pow(2, 1 / 12);

  for (var i = 0; i < numNotes; i++) {
    notes[i] = refPitch * Math.pow(twoToOneTwelfth, i - refIdx);
  }
}

function playSound()
{
  initSound();

  soundArray = [];

  var c = 39;
  var d = 41;
  var f = 44;
  var g = 46;
  var gs = 47;
  var a = 48;
  var d2 = 53;

  var melody = [
    f, f, f, f, -1, -1, d, d,
	f, f, f, f, g, g, g, -1,
	-1, -1, -1, -1, -1, -1, -1, -1,
	f, f, -1, -1, f, f, -1, -1,
	f, f, f, f, -1, -1, d, d,
	a, a, a, a, gs, gs, gs, -1,
	-1, -1, -1, -1, -1, -1, -1, -1,
	a, a, -1, -1, d, d, -1, -1,
  ];

  var noteLength = 1/16;
  for (var i = 0; i < melody.length; i++) {
    appendNote(melody[i], noteLength);
  }

  // 6. Pass the array to the buffer
  playBuffer();
}

function appendNote(keyIdx, noteLength) {
  if (keyIdx == -1)
  {
    makeSilence(noteLength);
    return
  }

  var freq = notes[keyIdx];

  var type = "sine";

  switch (type) {
    case "sine":
      makeSineWave(freq, noteLength);
      break;
    case "square":
      makeSquareWave(freq, noteLength);
      break;
    case "triangle":
      makeTriangleWave(freq, noteLength);
      break;
    case "noise":
      makeNoise(noteLength);
      break;
  }
}



function appendSample(value, thruNote)
{
	if(adsrOn)
	{
		value = adsr(value, thruNote);
	}
	soundArray.push(value);
}

function adsr(value, thruNote)
{
	var attack = 0.1;
	var decay = 0.2;
	var sustain = 0.5;
	var release = 0.25;

	if(thruNote < attack)
	{
		var thruAttack = thruNote / attack;
		value *= thruAttack;
	}
	else if(thruNote < decay)
	{
		var thruDecay = (thruNote - attack) / (decay - attack);
		var susValue = sustain * value;

		value = (1 - thruDecay) * (value - susValue) + susValue;
	}
	else if(thruNote > (1 - release))
	{
		var thruRelease = (thruNote - (1 - release)) / release;
		var susValue = sustain * value;

		value = (1 - thruRelease) * susValue;
	}
	else
	{
		value *= sustain;
	}

	return value;
}

function makeSineWave(freq, noteLength)
{
	var period = sampleRate / freq;
	var sxn = sampleRate * noteLength
	for(var i=0; i < sxn; i++)
	{
		var thruNote = i / sxn;
		appendSample( Math.sin( i / period * 2 * Math.PI ) * amp, thruNote );
	}
}

function makeSquareWave(freq, noteLength)
{
	var period = sampleRate / freq;
	var sxn = sampleRate * noteLength
	for(var i=0; i < sxn; i++)
	{
		var thruNote = i / sxn;
		appendSample( (parseInt(i % period / (period / 2)) * 2 - 1) * amp, thruNote );
	}
}

function makeTriangleWave(freq, noteLength)
{
	var period = sampleRate / freq;
	var tp2 = triPeak / 2;
	var itp2 = 1 - tp2;

	var sxn = sampleRate * noteLength
	for(var i=0; i < sxn; i++)
	{
		var thruNote = i / sxn;
		var perc = (i % period) / period;
		var samp = 0;

		if(perc < tp2)
		{
			samp = perc / tp2;
		}
		else if(perc < itp2)
		{
			var perc2 = perc - tp2;
			var subPer = perc2 / (itp2 - tp2);
			samp = subPer * -2 + 1;
		}
		else
		{
			samp = ((perc - itp2) / tp2) - 1;
		}

		appendSample( samp * amp, thruNote );
	}
}

function makeNoise(noteLength)
{
	var sxn = sampleRate * noteLength
	for(var i=0; i < sxn; i++)
	{
		var thruNote = i / sxn;
		appendSample( (Math.random()*2 - 1) * amp );
	}
}

function makeSilence(noteLength)
{
	var sxn = sampleRate * noteLength
	for(var i=0; i < sampleRate * noteLength; i++)
	{
		var thruNote = i / sxn;
		appendSample(0, thruNote);
	}
}

function playBuffer()
{
	var arrayBuffer = context.createBuffer(2, soundArray.length, context.sampleRate);

	for(var channel = 0; channel < arrayBuffer.numberOfChannels; channel++)
	{
		var samples = arrayBuffer.getChannelData(channel);
		for(var i=0; i < arrayBuffer.length; i++)
		{
			samples[i] = soundArray[i];
		}
	}

	var source = context.createBufferSource();
	source.buffer = arrayBuffer;
	source.connect(context.destination);
	source.start();
}

window.onclick = playSound;
