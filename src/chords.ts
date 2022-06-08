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

const generateRandomChord = (): Chord => {
    const root = getRandomNote();
    const chordDefinition = CHORD_DEFINITIONS[Math.floor(Math.random() * CHORD_DEFINITIONS.length)];
    const name = `${toNoteName(root)}${chordDefinition.suffix}`;
    const notes = [getBassNote(root)];

    chordDefinition.rootOffsets.forEach((offset) => {
        notes.push(root + offset + 36);
    });

    const noteNames = notes.map((n) => toNamedNote(n));

    return {
        name,
        notes,
        noteNames,
    };
};

export const getRandomChords = (length: number): Chord[] => {
    const ret = [] as Chord[];

    for(let i=0;i<length;i++){
        ret.push(generateRandomChord());
    }

    return ret;
};