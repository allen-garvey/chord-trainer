interface ChordDefinition {
    name: string;
    suffix: string;
    rootOffsets: number[];
}

export interface Chord {
    name: string;
    notes: number[];
    noteNames: string[];
}

const toRootNote = (n: number): number => n % 12;

const toNoteName = (n: number): string => {
    const NOTE_NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
    return NOTE_NAMES[toRootNote(n)];
};

const toNamedNote = (n: number): string => `${toNoteName(n)}${Math.ceil(n / 12)}`;

const getBassNote = (n: number): number => {
    if(n < 7 && Math.round(Math.random())){
        return n + 24;
    }
    
    return n + 12;
};

const getRandomNote = (): number => Math.floor(Math.random() * 12);

const CHORD_DEFINITIONS: ChordDefinition[] = [
    {
        name: 'major triad',
        suffix: '',
        rootOffsets: [0, 4, 7],
    },
    {
        name: 'minor triad',
        suffix: '-',
        rootOffsets: [0, 3, 7],
    },
    {
        name: 'diminished triad',
        suffix: 'dim',
        rootOffsets: [0, 3, 6],
    },
    {
        name: 'augmented triad',
        suffix: '+',
        rootOffsets: [0, 4, 8],
    },
];

const findClosestChordNoteFromPreviousNote = (previousNote: number, chordTones: number[]): number => {
    const previousNoteNormalized = toRootNote(previousNote);

    const closestNote = chordTones.map((chordTone) => {
        const min = Math.min(previousNoteNormalized, chordTone);
        const max = Math.max(previousNoteNormalized, chordTone);
        return Math.min(max - min, min + 12 - max);
    }).reduce(([shortestDistance, shortestChordTone], currentDistance, index) => {
        if(currentDistance < shortestDistance){
            return [currentDistance, chordTones[index]];
        }
        
        return [shortestDistance, shortestChordTone];
    }, [Infinity, chordTones[0]])[1];

    const closestNoteToOctaveLow = Math.floor(previousNote / 12) * 12 + closestNote;
    const closestNoteToOctaveHigh = Math.ceil(previousNote / 12) * 12 + closestNote;
    const lowDiff = Math.abs(previousNote - closestNoteToOctaveLow);
    const highDiff = Math.abs(closestNoteToOctaveHigh - previousNote);

    return highDiff > lowDiff ? closestNoteToOctaveLow : closestNoteToOctaveHigh;
};

const generateRandomInversion = (rootOffsets: number[]): number[] => {
    const length = rootOffsets.length;
    const startIndex = Math.floor(Math.random() * length);
    const ret: number[] = [];

    for(let i=startIndex;i<startIndex+length;i++){
        let offset = rootOffsets[i % length];
        offset = i >= length ? offset + 12 : offset;
        ret.push(offset);
    }

    return ret;
};

const generateRandomChord = (): Chord => {
    const root = getRandomNote();
    const chordDefinition = CHORD_DEFINITIONS[Math.floor(Math.random() * CHORD_DEFINITIONS.length)];
    const name = `${toNoteName(root)}${chordDefinition.suffix}`;
    const notes = [getBassNote(root)];

    generateRandomInversion(chordDefinition.rootOffsets).forEach((offset) => {
        notes.push(root + offset + 36);
    });

    const noteNames = notes.map((n) => toNamedNote(n));

    return {
        name,
        notes,
        noteNames,
    };
};

const generateRandomChordFromPreviousChord = (previousChord: Chord): Chord => {
    const root = getRandomNote();
    const chordDefinition = CHORD_DEFINITIONS[Math.floor(Math.random() * CHORD_DEFINITIONS.length)];
    const name = `${toNoteName(root)}${chordDefinition.suffix}`;
    const notes = [getBassNote(root)];

    const currentChordTones = chordDefinition.rootOffsets.map((offset) => root + offset);

    previousChord.notes.slice(1).forEach((previousChordNote) => {
        notes.push(findClosestChordNoteFromPreviousNote(previousChordNote, currentChordTones));
    });

    const noteNames = notes.map((n) => toNamedNote(n));

    return {
        name,
        notes,
        noteNames,
    };
};

export const getRandomChords = (length: number): Chord[] => {
    const ret: Chord[] = [generateRandomChord()];

    for(let i=1;i<length;i++){
        ret.push(generateRandomChordFromPreviousChord(ret[i-1]));
    }

    return ret;
};