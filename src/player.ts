import { Chord } from './chords';

interface SynthVoice {
    oscillator: OscillatorNode;
    volume: GainNode;
};

const MAX_POLYPHONY = 4;

// from https://pages.mtu.edu/~suits/notefreqs.html
// starts at C0
const NOTE_FREQUENCIES = [16.35,17.32,18.35,19.45,20.6,21.83,23.12,24.5,25.96,27.5,29.14,30.87,32.7,34.65,36.71,38.89,41.2,43.65,46.25,49,51.91,55,58.27,61.74,65.41,69.3,73.42,77.78,82.41,87.31,92.5,98,103.83,110,116.54,123.47,130.81,138.59,146.83,155.56,164.81,174.61,185,196,207.65,220,233.08,246.94,261.63,277.18,293.66,311.13,329.63,349.23,369.99,392,415.3,440,466.16,493.88,523.25,554.37,587.33,622.25,659.25,698.46,739.99,783.99,830.61,880,932.33,987.77,1046.5,1108.73,1174.66,1244.51,1318.51,1396.91,1479.98,1567.98,1661.22,1760,1864.66,1975.53,2093,2217.46,2349.32,2489.02,2637.02,2793.83,2959.96,3135.96,3322.44,3520,3729.31,3951.07,4186.01,4434.92,4698.63,4978.03,5274.04,5587.65,5919.91,6271.93,6644.88,7040,7458.62,7902.13];

let audioContext: AudioContext;
let masterVolume: GainNode;
const synthVoices: SynthVoice[] = [];

// based on: https://medium.com/geekculture/building-a-modular-synth-with-web-audio-api-and-javascript-d38ccdeca9ea
const setupAudioContext = () => {
    audioContext = new AudioContext();
    masterVolume = audioContext.createGain();
    masterVolume.connect(audioContext.destination);

    for(let i=0;i<MAX_POLYPHONY;i++){
        const volume = audioContext.createGain();
        volume.connect(masterVolume);

        const lowPassFilter = audioContext.createBiquadFilter();
        lowPassFilter.type = 'lowpass';
        lowPassFilter.frequency.value = 500;
        lowPassFilter.connect(volume);

        const highPassFilter = audioContext.createBiquadFilter();
        highPassFilter.type = 'highpass';
        highPassFilter.frequency.value = 30;
        highPassFilter.connect(lowPassFilter);

        const oscillator = audioContext.createOscillator();
        oscillator.type = 'triangle';
        oscillator.connect(highPassFilter);
        oscillator.start();
        
        synthVoices.push({
            oscillator,
            volume,
        });
    }
};


export const playChords = (chords: Chord[]) => {
    if(!audioContext){
        setupAudioContext();
    }

    const bpm = 120;
    const wholeNoteInSeconds = 60 / bpm * 4;
    const gainLevel = 0.12;

    chords.forEach((chord, i) => {
        const timeOffset = i * wholeNoteInSeconds + audioContext.currentTime;
        chord.notes.forEach((note, j) => {
            const synthVoice = synthVoices[j];
            const frequency = NOTE_FREQUENCIES[note+12];
            synthVoice.oscillator.frequency.setValueAtTime(frequency, timeOffset);
            synthVoice.volume.gain.setValueAtTime(0.001, 0);
            synthVoice.volume.gain.exponentialRampToValueAtTime(gainLevel, 0);
        });
    });

    const totalTimeToPlayChords = wholeNoteInSeconds * chords.length + audioContext.currentTime;

    synthVoices.forEach((synthVoice) => {
        synthVoice.volume.gain.setValueAtTime(gainLevel, totalTimeToPlayChords - 0.05);
        synthVoice.volume.gain.linearRampToValueAtTime(0.001, totalTimeToPlayChords + 0.1);
    });
};