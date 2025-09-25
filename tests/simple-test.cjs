/**
 * Simple smoke test to exercise:
 * - ABC converter: decorations from articulations[]
 * - VexFlow converter: data structure generation with vfArticulations / gliss hints
 * - Audio compiler: compileEvents deriving modulations from articulations[]
 *
 * Runs under Node after `npm run build`.
 */

const path = require('node:path');
const { pathToFileURL } = require('node:url');
const assert = require('node:assert/strict');

(async () => {
  // Dynamically import ESM from src to avoid UMD export shape issues
  const srcUrl = pathToFileURL(path.resolve(__dirname, '../src/index.js')).href;
  const mod = await import(srcUrl);
  const jm = mod?.jm || mod?.default || mod;

  // Basic sanity
  assert.ok(jm && typeof jm === 'object', 'jm export should be an object');
  assert.ok(jm.converters && typeof jm.converters.abc === 'function', 'jm.converters.abc should be a function');
  assert.ok(typeof jm.converters.vexflow === 'function', 'jm.converters.vexflow should be a function');
  assert.ok(jm.audio && typeof jm.audio.compileEvents === 'function', 'jm.audio.compileEvents should be a function');

  // Minimal composition with articulations[]
  const composition = {
    format: 'jmon',
    version: '1.0.0',
    tempo: 120,
    timeSignature: '4/4',
    keySignature: 'C',
    metadata: { title: 'Smoke Test' },
    tracks: [
      {
        label: 'T1',
        notes: [
          // First note: simple articulations staccato + accent
          { pitch: 60, duration: 1, time: 0, articulations: ['staccato', 'accent'] },
          // Second note: glissando up to 67 (G4)
          { pitch: 64, duration: 1, time: 1, articulations: [{ type: 'glissando', target: 67 }] },
          // Third note: plain
          { pitch: 67, duration: 1, time: 2 },
        ],
      },
    ],
  };

  // 1) ABC conversion: ensure decorations are emitted from articulations[]
  const abcText = jm.converters.abc(composition, { showArticulations: true });
  assert.ok(typeof abcText === 'string' && abcText.length > 0, 'ABC converter should return a non-empty string');

  // Expect explicit decorations:
  // - '!staccato!' and '!accent!' for first note
  // - '!slide!' for glissando (ABC convention)
  assert.ok(abcText.includes('!staccato!'), 'ABC should contain !staccato! decoration');
  assert.ok(abcText.includes('!accent!'), 'ABC should contain !accent! decoration');
  assert.ok(abcText.includes('!slide!'), 'ABC should contain !slide! decoration for glissando');

  console.log('[OK] ABC decorations mapped from articulations[]');

  // 2) VexFlow conversion: ensure data structure carries vfArticulations and gliss hints
  const vfData = jm.converters.vexflow(composition, {
    elementId: 'vf-smoke-test',
    width: 400,
    height: 200,
  });

  // Basic shape checks
  assert.ok(vfData && typeof vfData === 'object', 'VexFlow converter should return an object');
  assert.ok(Array.isArray(vfData.tracks) && vfData.tracks.length > 0, 'VexFlow data should have tracks');
  const vfNotes = vfData.tracks[0]?.notes || [];
  assert.ok(Array.isArray(vfNotes) && vfNotes.length >= 2, 'VexFlow first track should have at least 2 notes');

  // Find first and second notes
  const vfFirst = vfNotes[0];
  const vfSecond = vfNotes[1];

  // First note should carry articulation glyphs (precomputed codes) or fallback mapping
  const firstHasVfCodes =
    Array.isArray(vfFirst?.vfArticulations) && vfFirst.vfArticulations.some((c) => typeof c === 'string');
  const firstFallback =
    Array.isArray(vfFirst?.articulations) && vfFirst.articulations.length > 0;
  assert.ok(firstHasVfCodes || firstFallback, 'VexFlow note should have vfArticulations or articulations fallback');

  // Second note should carry a gliss hint
  assert.ok(
    vfSecond && typeof vfSecond === 'object' && vfSecond.gliss,
    'VexFlow second note should have a gliss hint'
  );

  console.log('[OK] VexFlow data contains articulation/gliss hints');

  // 3) Audio compiler: ensure modulations are derived from articulations[]
  const track = composition.tracks[0];
  const perf = jm.audio.compileEvents(
    { notes: track.notes },
    { tempo: composition.tempo, timeSignature: composition.timeSignature }
  );

  assert.ok(perf && Array.isArray(perf.modulations), 'compileEvents should return { modulations: [] }');

  const hasStaccatoDurScale = perf.modulations.some(
    (m) => m.type === 'durationScale' && m.index === 0 && m.factor && m.factor <= 0.5 + 1e-6
  );

  const hasGlissPitch = perf.modulations.some(
    (m) =>
      m.type === 'pitch' &&
      (m.subtype === 'glissando' || m.subtype === 'portamento') &&
      m.index === 1 &&
      (m.to === 67 || m.to === 67.0)
  );

  assert.ok(hasStaccatoDurScale, 'Performance modulations should include staccato durationScale for note 0');
  assert.ok(hasGlissPitch, 'Performance modulations should include glissando pitch curve for note 1');

  console.log('[OK] Audio compileEvents returns expected modulations');

  console.log('All smoke tests passed.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
