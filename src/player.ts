import * as Tone from 'tone';
import { Chord } from './chords';

let hasStarted = false;
let startingMeasure = 0;
const synth = new Tone.PolySynth().toDestination();

export const playChords = (chords: Chord[]) => {
    if(!hasStarted){
        Tone.start();
        hasStarted = true;
    }
    Tone.Transport.stop();
    synth.unsync();

    chords.forEach((chord, i) => {
        synth.triggerAttackRelease(chord.noteNames, '1n', `${i+startingMeasure}:0:0`);
    });
    
    Tone.Transport.start(0, `${startingMeasure}:0:0`);
    
    startingMeasure += chords.length;
};