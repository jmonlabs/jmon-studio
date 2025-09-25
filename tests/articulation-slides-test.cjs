/**
 * Smoke test: Validate slides via articulations[] (glissando/portamento)
 * Replaces legacy validator behavior that relied on deprecated fields.
 *
 * Run manually with:
 *   node test/articulation-slides-test.cjs
 *
 * Note: The default "npm test" runs only test/simple-test.cjs unless configured otherwise.
 */

const path = require('node:path');
const { pathToFileURL } = require('node:url');
const assert = require('node:assert/strict');

(async () => {
  // Dynamically import ESM entry from src to avoid UMD shape differences.
  const srcUrl = pathToFileURL(path.resolve(__dirname, '../src/index.js')).href;
  const mod = await import(srcUrl);
  const jm = mod?.jm || mod?.default || mod;

  // Basic API presence checks
  assert.ok(jm && typeof jm === 'object', 'jm export should be an object');
  assert.ok(jm.converters && typeof jm.converters.abc === 'function', 'jm.converters.abc should be a function');
  assert.ok(typeof jm.converters.vexflow === 'function', 'jm.converters.vexflow should be a function');
  assert.ok(jm.audio && typeof jm.audio.compileEvents === 'function', 'jm.audio.compileEvents should be a function');

  // Composition using articulations[] only (no legacy fields)
  const composition = {
    format: 'jmon',
    version: '1.0.0',
    tempo: 100,
    timeSignature: '4/4',
    keySignature: 'C',
    metadata: { title: 'Articulation Slides Test' },
    tracks: [
      {
        label: 'Slides',
        notes: [
          // Glissando up from C4 (60) to G4 (67)
          { pitch: 60, duration: 1, time: 0, articulations: [{ type: 'glissando', target: 67 }] },
          // Portamento down from A4 (69) to E4 (64)
          { pitch: 69, duration: 1, time: 1, articulations: [{ type: 'portamento', target: 64 }] },
          // Control - plain note (no slide)
          { pitch: 64, duration: 1, time: 2 },
        ],
      },
    ],
  };

  // 1) ABC: slides must be represented as !slide! decorations
  const abcText = jm.converters.abc(composition, { showArticulations: true });
  assert.ok(typeof abcText === 'string' && abcText.length > 0, 'ABC text should be non-empty');
  const slideCount = (abcText.match(/!slide!/g) || []).length;
  assert.ok(slideCount >= 2, `Expected at least 2 !slide! decorations, got ${slideCount}`);

  console.log('[OK] ABC includes !slide! decorations derived from articulations[]');

  // 2) VexFlow data: first two notes should carry gliss hint
  const vfData = jm.converters.vexflow(composition, {
    elementId: 'vf-slides',
    width: 480,
    height: 160,
  });

  assert.ok(vfData && typeof vfData === 'object', 'VexFlow converter returned an object');
  assert.ok(Array.isArray(vfData.tracks) && vfData.tracks.length > 0, 'VexFlow data has tracks');

  const vfNotes = vfData.tracks[0]?.notes || [];
  assert.ok(vfNotes.length >= 3, 'VexFlow first track should have at least 3 notes');

  const vfFirst = vfNotes[0];
  const vfSecond = vfNotes[1];
  assert.ok(vfFirst && vfFirst.gliss && typeof vfFirst.gliss === 'object', 'First note should carry gliss hint');
  assert.ok(vfSecond && vfSecond.gliss && typeof vfSecond.gliss === 'object', 'Second note should carry gliss hint');

  // Optional: ensure targetKey or text present when available
  assert.ok(
    'text' in vfFirst.gliss || 'targetKey' in vfFirst.gliss,
    'First gliss hint should include text or targetKey'
  );
  assert.ok(
    'text' in vfSecond.gliss || 'targetKey' in vfSecond.gliss,
    'Second gliss hint should include text or targetKey'
  );

  console.log('[OK] VexFlow data contains gliss hints for glissando and portamento');

  // 3) Audio compiler: derive pitch modulations from articulations[]
  const track = composition.tracks[0];
  const perf = jm.audio.compileEvents(
    { notes: track.notes },
    { tempo: composition.tempo, timeSignature: composition.timeSignature }
  );

  assert.ok(perf && Array.isArray(perf.modulations), 'compileEvents returned { modulations: [] }');

  const hasGliss = perf.modulations.some(
    (m) => m.type === 'pitch' && m.subtype === 'glissando' && m.from === 60 && m.to === 67
  );
  const hasPort = perf.modulations.some(
    (m) => m.type === 'pitch' && m.subtype === 'portamento' && m.from === 69 && m.to === 64
  );

  assert.ok(hasGliss, 'Expected pitch modulation for glissando (60 → 67)');
  assert.ok(hasPort, 'Expected pitch modulation for portamento (69 → 64)');

  console.log('[OK] compileEvents derives pitch curves from glissando/portamento articulations');

  console.log('All articulation slides tests passed.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
