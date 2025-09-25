// Articulations Demo - "Mary Had a Little Lamb" with various articulations
// Extended version to showcase all articulation types

const baseMelody = {
  format: "jmon",
  version: "1.0.0",
  tempo: 120,
  timeSignature: "4/4",
  keySignature: "C",
  metadata: {
    title: "Mary Had a Little Lamb",
    composer: "Traditional"
  },
  tracks: [
    {
      label: "Base Melody",
      notes: [
        // Mary had a little lamb (simple articulations)
        {pitch: 64, duration: 1.0, time: 0.0},   // E - Mary (staccato)
        {pitch: 62, duration: 1.0, time: 1.0},   // D - had (accent)
        {pitch: 60, duration: 1.0, time: 2.0},   // C - a (tenuto)
        {pitch: 62, duration: 1.0, time: 3.0},   // D - little (legato)
        {pitch: 64, duration: 1.0, time: 4.0},   // E - lamb (marcato)
        {pitch: 64, duration: 1.0, time: 5.0},   // E
        {pitch: 64, duration: 2.0, time: 6.0},   // E (long note)

        // Little lamb, little lamb (complex articulations)
        {pitch: 62, duration: 1.0, time: 8.0},   // D - Little (vibrato)
        {pitch: 62, duration: 1.0, time: 9.0},   // D - lamb (tremolo)
        {pitch: 62, duration: 2.0, time: 10.0},  // D (long note with crescendo)
        {pitch: 64, duration: 1.0, time: 12.0},  // E - little (bend)
        {pitch: 67, duration: 1.0, time: 13.0},  // G - lamb (glissando down)
        {pitch: 67, duration: 2.0, time: 14.0},  // G (long note with diminuendo)

        // Mary had a little lamb (more complex articulations)
        {pitch: 64, duration: 1.0, time: 16.0},  // E - Mary (portamento to D)
        {pitch: 62, duration: 1.0, time: 17.0},  // D - had (vibrato)
        {pitch: 60, duration: 1.0, time: 18.0},  // C - a (bend up)
        {pitch: 62, duration: 1.0, time: 19.0},  // D - little (tremolo)
        {pitch: 64, duration: 1.0, time: 20.0},  // E - lamb (glissando up)
        {pitch: 64, duration: 1.0, time: 21.0},  // E (staccato)
        {pitch: 64, duration: 1.0, time: 22.0},  // E (accent)
        {pitch: 62, duration: 1.0, time: 23.0},  // D (tenuto)
        {pitch: 62, duration: 1.0, time: 24.0},  // D (vibrato)
        {pitch: 64, duration: 1.0, time: 25.0},  // E (marcato)
        {pitch: 67, duration: 4.0, time: 26.0}   // G (final note with crescendo then diminuendo)
      ]
    }
  ]
};

// Apply articulations using the API
let articulatedNotes = [...baseMelody.tracks[0].notes];

console.log('Applying articulations to Mary Had a Little Lamb...');

// Simple articulations (first phrase)
articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 0, 'staccato');
articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 1, 'accent');
articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 2, 'tenuto');
articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 3, 'legato');
articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 4, 'marcato');

// Complex articulations (second phrase)
articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 7, 'vibrato', {
  rate: 6,    // Hz
  depth: 40,  // cents
  delay: 0.1  // seconds
});

articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 8, 'tremolo', {
  rate: 10,   // Hz
  depth: 0.4  // 0-1
});

articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 9, 'crescendo', {
  endVelocity: 0.9,
  curve: 'exponential'
});

articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 11, 'bend', {
  amount: 100,        // cents (semitone up)
  curve: 'linear',
  returnToOriginal: true
});

articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 12, 'glissando', {
  target: 60,         // Glide down to C
  curve: 'linear'
});

articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 13, 'diminuendo', {
  endVelocity: 0.3,
  curve: 'linear'
});

// More complex articulations (third phrase)
articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 14, 'portamento', {
  target: 62,         // Slide to D
  curve: 'exponential',
  speed: 0.5
});

articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 15, 'vibrato', {
  rate: 5,
  depth: 30,
  delay: 0
});

articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 16, 'bend', {
  amount: 50,         // Quarter tone up
  returnToOriginal: false
});

articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 17, 'tremolo', {
  rate: 12,
  depth: 0.6
});

articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 18, 'glissando', {
  target: 69,         // Glide up to A
  curve: 'exponential'
});

// Final phrase with mixed articulations
articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 19, 'staccato');
articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 20, 'accent');
articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 21, 'tenuto');
articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 22, 'vibrato', {
  rate: 7,
  depth: 50
});
articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 23, 'marcato');

// Final note with complex dynamics
articulatedNotes = jm.theory.harmony.addArticulation(articulatedNotes, 24, 'crescendo', {
  endVelocity: 0.95,
  curve: 'exponential'
});

// Create the final articulated piece
const maryWithArticulations = {
  ...baseMelody,
  metadata: {
    title: "Mary Had a Little Lamb (with Articulations)",
    composer: "Traditional (articulated with API)"
  },
  tracks: [
    {
      label: "Articulated Melody",
      notes: articulatedNotes
    }
  ]
};

console.log('Articulated piece created with', articulatedNotes.length, 'notes');

// Display the player
const compiled = jm.audio.compileComposition(maryWithArticulations);
const maryForPlayer = JSON.parse(JSON.stringify(maryWithArticulations));
compiled.tracks.forEach((ct, ti) => {
  (ct.modulations || []).forEach((m) => {
    const n = maryForPlayer.tracks[ti].notes[m.index];
    if (!n.modulations) n.modulations = [];
    n.modulations.push({ ...m });
  });
});

document.getElementById('player-container').appendChild(
    jm.play(maryForPlayer, { autoplay: false })
);

// Display the score
const maryForScore = JSON.parse(JSON.stringify(maryForPlayer));
const SIMPLE = new Set(['staccato','accent','tenuto','marcato']);
maryForScore.tracks.forEach(t => {
  t.notes.forEach(n => {
    if (Array.isArray(n.articulations)) {
      const firstSimple = n.articulations.find(a => (typeof a === 'string' ? SIMPLE.has(a) : SIMPLE.has(a.type)));
      if (firstSimple) n.articulation = (typeof firstSimple === 'string') ? firstSimple : firstSimple.type;
    }
  });
});

document.getElementById('score-container').appendChild(
    jm.score(maryForScore)
);

// Log information about articulations applied
console.log('Articulation types demonstrated:');
console.log('Simple Articulations:');
console.log('  - Staccato: Shortened notes');
console.log('  - Accent: Emphasized attacks');
console.log('  - Tenuto: Full duration with emphasis');
console.log('  - Legato: Smooth connections');
console.log('  - Marcato: Strong accents with separation');

console.log('Complex Articulations:');
console.log('  - Vibrato: Pitch oscillation with rate/depth control');
console.log('  - Tremolo: Volume oscillation');
console.log('  - Glissando: Smooth pitch slides');
console.log('  - Portamento: Expressive pitch slides');
console.log('  - Bend: Pitch bends with return options');
console.log('  - Crescendo: Gradual volume increase');
console.log('  - Diminuendo: Gradual volume decrease');

// Show the ABC notation with line breaks
const abcNotation = jm.converters.abc(maryForScore, {
    measuresPerLine: 4,
    lineBreaks: [8, 16]
});
console.log('ABC notation with articulations:', abcNotation);
