SinOsc s => dac;
0.3 => s.gain;

global Event noteOn;
global int note;

spork ~ playNote();

fun void playNote() {
    while (true) {
        noteOn => now;
        Std.mtof(note) => s.freq;
        200::ms => now;
    }
}