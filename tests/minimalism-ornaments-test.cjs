/**
 * Smoke test: ornaments mapping and minimalism processes
 *
 * - Validates ABC decorations for ornaments and slides derived from articulations[]
 * - Validates VexFlow data carries stroke (arpeggio) and gliss hints
 * - Exercises MinimalismProcess (additive) and Tintinnabuli generation
 * - Confirms audio.compileEvents derives pitch modulations from gliss articulations
 *
 * Run manually with:
 *   node test/minimalism-ornaments-test.cjs
 *
 * Note: The project "npm test" only runs simple-test.cjs by default.
 */

const path = require('node:path');
const { pathToFileURL } = require('node:url');
const assert = require('node:assert/strict');

(async () => {
  const srcUrl = pathToFileURL(path.resolve(__dirname, '../src/index.js')).href;
  const mod = await import(srcUrl);
  const jm = mod?.jm || mod?.default || mod;

  assert.ok(jm && typeof jm === 'object', 'jm export should be an object');
  assert.ok(jm.converters && typeof jm.converters.abc === 'function', 'jm.converters.abc should be a function');
  assert.ok(typeof jm.converters.vexflow === 'function', 'jm.converters.vexflow should be a function');
  assert.ok(jm.audio && typeof jm.audio.compileEvents === 'function', 'jm.audio.compileEvents should be a function');

  // 1) Ornaments and articulations to ABC/VexFlow
  const compOrnaments = {
    format: 'jmon',
    version: '1.0.0',
    tempo: 96,
    timeSignature: '4/4',
    keySignature: 'C',
    metadata: { title: 'Ornaments Test' },
    tracks: [
      {
        label: 'Ornaments',
        notes: [
          // Ornaments
          { pitch: 60, duration: 1, time: 0, articulations: ['trill'] },
          { pitch: 62, duration: 1, time: 1, articulations: ['mordent'] },
          { pitch: 64, duration: 1, time: 2, articulations: ['turn'] },
          // Arpeggio (stroke) on a chord
          { pitch: [60, 64, 67], duration: 1, time: 3, articulations: [{ type: 'arpeggio', direction: 'up' }] },
          // Glissando (slide in ABC)
          { pitch: 65, duration: 1, time: 4, articulations: [{ type: 'glissando', target: 69 }] },
        ],
      },
    ],
  };

  const abcText = jm.converters.abc(compOrnaments, { showArticulations: true });
  assert.ok(typeof abcText === 'string' && abcText.length > 0, 'ABC should be non-empty');

  // ABC decorations (typical syntax): !trill!, !mordent!, !turn!, !arpeggio!, !slide!
  const expectedDecorations = ['!trill!', '!mordent!', '!turn!', '!arpeggio!', '!slide!'];
  for (const dec of expectedDecorations) {
    assert.ok(
      abcText.includes(dec),
      `ABC should contain ${dec} decoration (got: ${abcText.slice(0, 200)}...)`
    );
  }
  console.log('[OK] ABC ornaments mapped to explicit decorations');

  // VexFlow data checks: stroke on arpeggio chord, gliss hint on glissando
  const vfData = jm.converters.vexflow(compOrnaments, {
    elementId: 'vf-ornaments',
    width: 600,
    height: 200,
  });

  assert.ok(vfData && typeof vfData === 'object', 'VexFlow converter returned an object');
  assert.ok(Array.isArray(vfData.tracks) && vfData.tracks.length > 0, 'VexFlow data has tracks');
  const vfNotes = vfData.tracks[0]?.notes || [];
  assert.ok(Array.isArray(vfNotes) && vfNotes.length >= 5, 'VexFlow first track has expected notes');

  // Index 3: arpeggio chord → expect stroke property
  const vfArp = vfNotes[3];
  assert.ok(
    vfArp && vfArp.stroke && typeof vfArp.stroke === 'object',
    'VexFlow arpeggio chord should contain stroke hint'
  );

  // Index 4: gliss note → expect gliss hint object
  const vfGliss = vfNotes[4];
  assert.ok(
    vfGliss && vfGliss.gliss && typeof vfGliss.gliss === 'object',
    'VexFlow glissando note should contain gliss hint'
  );

  console.log('[OK] VexFlow data contains stroke/gliss hints for ornaments/slide');

  // 2) Audio compileEvents: articulation-based gliss pitch curve
  const track = compOrnaments.tracks[0];
  const perf = jm.audio.compileEvents(
    { notes: track.notes },
    { tempo: compOrnaments.tempo, timeSignature: compOrnaments.timeSignature }
  );
  assert.ok(perf && Array.isArray(perf.modulations), 'compileEvents returned { modulations: [] }');

  const hasGlissPitch = perf.modulations.some(
    (m) =>
      m.type === 'pitch' &&
      (m.subtype === 'glissando' || m.subtype === 'portamento') &&
      typeof m.from === 'number' &&
      typeof m.to === 'number'
  );
  assert.ok(hasGlissPitch, 'compileEvents should include pitch curve for glissando articulation');

  console.log('[OK] Audio compileEvents captures gliss articulation (pitch curve)');

  // 3) Minimalism: Process (additive) and Tintinnabuli
  const MinProcessCtor =
    jm.generative?.minimalism?.Process ||
    jm.generative?.minimalism?.MinimalismProcess; // support either alias

  assert.ok(typeof MinProcessCtor === 'function', 'Minimalism Process constructor is available');

  const baseMotif = [
    { pitch: 60, duration: 0.5, time: 0 },
    { pitch: 62, duration: 0.5, time: 0.5 },
    { pitch: 64, duration: 1.0, time: 1.0 },
  ];

  const proc = new MinProcessCtor({ operation: 'additive', direction: 'forward', repetition: 1 });
  const procNotes = proc.generate(baseMotif);

  assert.ok(Array.isArray(procNotes) && procNotes.length > baseMotif.length, 'Process generated an expanded sequence');
  // Ensure times are numeric and non-decreasing
  for (let i = 1; i < procNotes.length; i++) {
    const prev = procNotes[i - 1];
    const cur = procNotes[i];
    assert.ok(typeof cur.time === 'number', 'Process outputs numeric time for consistency');
    assert.ok(cur.time >= prev.time, 'Generated times should be non-decreasing');
  }

  // Tintinnabuli voice from the same motif
  const TintinnabuliCtor = jm.generative?.minimalism?.Tintinnabuli;
  assert.ok(typeof TintinnabuliCtor === 'function', 'Tintinnabuli constructor is available');

  const tChord = [60, 64, 67]; // C major triad
  const tgen = new TintinnabuliCtor(tChord, 'down', 0);
  const tVoice = tgen.generate(baseMotif);
  assert.equal(
    tVoice.length,
    baseMotif.length,
    'Tintinnabuli generated voice should match input motif length'
  );
  assert.ok(
    tVoice.every(n => typeof n.pitch === 'number' || n.pitch === undefined),
    'Tintinnabuli output pitch should be numbers or undefined (for rests)'
  );

  console.log('[OK] Minimalism Process and Tintinnabuli generated expected sequences');

  // 4) compileEvents should accept minimalism output
  const perfMin = jm.audio.compileEvents({ notes: procNotes }, { tempo: 120, timeSignature: '4/4' });
  assert.ok(perfMin && Array.isArray(perfMin.modulations), 'compileEvents works with minimalism-generated notes');

  console.log('[OK] Audio compileEvents works with minimalism-generated sequence');

  console.log('All ornament and minimalism tests passed.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
