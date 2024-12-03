import './style.css'

document.querySelector('#app').innerHTML = `
  <h1>Click To Play Sound</h1>
`

var context;
var notes = [];
var soundArray = [];
var iterator = 0; //iterator is global so multiple notes are continuous

function initNotes()
{
	var refPitch = 440;
	var refIdx = 48;
	var numNotes = 88;
	var twoToOneTwelfth = Math.pow(2, 1/12);

	for(var i=0; i<numNotes; i++)
	{
		notes[i] = refPitch * Math.pow(twoToOneTwelfth, i - refIdx);
	}
}

function appendNote(noteIdx, sec)
{
	var frequency = notes[noteIdx];
	var period = context.sampleRate / frequency;
	for(var i=0; i < context.sampleRate * sec; i++)
	{
		if(noteIdx == -1)
		{
			soundArray.push(0);
		}
		else if ( iterator % period > period/2)
		{
			soundArray.push(1);
		}
		else
		{
			soundArray.push(-1);
		}
		iterator++;
	}
}

function createAC()
{
    context = new AudioContext();
	soundArray = [];
	initNotes();

  // Notes (-1 is a rest)
  // Octave 1
	var c = 39;
  var cS = 40;
	var d = 41;
  var dS = 42;
  var e = 43;
	var f = 44;
  var fS = 45;
	var g = 46;
	var gS = 47;
	var a = 48;
  var aS = 49;
  var b = 50;

  // Octave 2
  var c2 = 51;
  var c2S = 52;
	var d2 = 53;
  var e2 = 54;
  var f2 = 55;
  var g2 = 56;
  var a2 = 57;
  var a2S = 58;
  var b2 = 59;

	var melody = [
    e2, g2, f2, e2, b, a, b, c2, g, g
  ];

	var noteLength =8/12;
	for(var i=0; i<melody.length; i++)
	{
		appendNote(melody[i], noteLength);
	}

    playSound(soundArray);
}


function playSound(soundArray)
{
    var arrbuff = context.createBuffer(2, soundArray.length, context.sampleRate);

    for (var channel = 0; channel < arrbuff.numberOfChannels; channel++)
    {
        var samples = arrbuff.getChannelData(channel);
        for (var i = 0; i < arrbuff.length; i++)
        {
            samples[i] = soundArray[i];
        }
    }
    var source = context.createBufferSource();
    source.buffer = arrbuff;
    source.connect(context.destination);
    source.start();
}

window.onclick = createAC;
