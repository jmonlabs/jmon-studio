/**
 * Additional minimalism tests for subtractive/inward/outward and alternating Tintinnabuli direction.
 *
 * Run manually with:
 *   node test/minimalism-more-test.cjs
 *
 * Notes:
 * - These are smoke-style tests executed in Node by dynamically importing the ESM source.
 * - They focus on structural/behavioral properties of MinimalismProcess and Tintinnabuli.
 */

const path = require('node:path');
const { pathToFileURL } = require('node:url');
const assert = require('node:assert/strict');

(async () => {
  // Import ESM entry directly from src
  const srcUrl = pathToFileURL(path.resolve(__dirname, '../src/index.js')).href;
  const mod = await import(srcUrl);
  const jm = mod?.jm || mod?.default || mod;

  // Sanity: required APIs exist
  assert.ok(jm && typeof jm === 'object', 'jm export should be an object');
  const MinProcessCtor =
    jm.generative?.minimalism?.Process ||
    jm.generative?.minimalism?.MinimalismProcess;
  assert.ok(typeof MinProcessCtor === 'function', 'Minimalism Process constructor is available');
  const TintinnabuliCtor = jm.generative?.minimalism?.Tintinnabuli;
  assert.ok(typeof TintinnabuliCtor === 'function', 'Tintinnabuli constructor is available');

  // Base motif: 4 notes with consistent durations to simplify chunk checks
  const motif = [
    { pitch: 60, duration: 0.5, time: 0.0 },
    { pitch: 62, duration: 0.5, time: 0.5 },
    { pitch: 64, duration: 0.5, time: 1.0 },
    { pitch: 65, duration: 0.5, time: 1.5 },
  ];

  // Helper: compare pitch/duration of two note arrays (ignoring time)
  function samePD(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i]?.pitch !== b[i]?.pitch) return false;
      if (Math.abs((a[i]?.duration ?? 0) - (b[i]?.duration ?? 0)) > 1e-9) return false;
    }
    return true;
  }

  // Helper: ensure times are numeric and non-decreasing
  function assertTimesNonDecreasing(notes, label) {
    for (let i = 0; i < notes.length; i++) {
      assert.equal(typeof notes[i].time, 'number', `${label}: time at index ${i} should be numeric`);
      if (i > 0) {
        assert.ok(notes[i].time >= notes[i - 1].time, `${label}: times should be non-decreasing`);
      }
    }
  }

  // 1) Subtractive Forward (segments: [0..n], [1..n], [2..n], ..., [n-1..n])
  {
    const proc = new MinProcessCtor({ operation: 'subtractive', direction: 'forward', repetition: 0 });
    const out = proc.generate(motif);
    // Expected lengths: 4 + 3 + 2 + 1 = 10
    assert.equal(out.length, 10, 'subtractive forward: expected concat of suffixes (4+3+2+1)');
    // First 4 equal original
    assert.ok(samePD(out.slice(0, 4), motif), 'subtractive forward: first segment equals original');
    // Next 3 equal motif.slice(1)
    assert.ok(samePD(out.slice(4, 7), motif.slice(1)), 'subtractive forward: second segment equals motif[1..]');
    assertTimesNonDecreasing(out, 'subtractive forward');
  }
  console.log('[OK] Minimalism subtractive-forward basic structure');

  // 2) Subtractive Backward (segments: [0..4], [0..3], [0..2], [0..1])
  {
    const proc = new MinProcessCtor({ operation: 'subtractive', direction: 'backward', repetition: 0 });
    const out = proc.generate(motif);
    // Expected lengths: 4 + 3 + 2 + 1 = 10
    assert.equal(out.length, 10, 'subtractive backward: expected concat of prefixes (4+3+2+1)');
    // First 4 equal original
    assert.ok(samePD(out.slice(0, 4), motif), 'subtractive backward: first segment equals original');
    // Next 3 equal motif.slice(0,3)
    assert.ok(samePD(out.slice(4, 7), motif.slice(0, 3)), 'subtractive backward: second segment equals motif[0..3)');
    assertTimesNonDecreasing(out, 'subtractive backward');
  }
  console.log('[OK] Minimalism subtractive-backward basic structure');

  // 3) Subtractive Inward (segments: full, then removing paired ends)
  // For length=4 and repetition=0 -> segments: [0..3] then [1..2]
  {
    const proc = new MinProcessCtor({ operation: 'subtractive', direction: 'inward', repetition: 0 });
    const out = proc.generate(motif);
    assert.equal(out.length, 4 + 2, 'subtractive inward: expected 2 segments for length=4 (4 + 2)');
    // First segment = original
    assert.ok(samePD(out.slice(0, 4), motif), 'subtractive inward: first segment equals original');
    // Second = middle slice
    assert.ok(samePD(out.slice(4, 6), motif.slice(1, 3)), 'subtractive inward: second segment equals motif[1..3)');
    assertTimesNonDecreasing(out, 'subtractive inward');
  }
  console.log('[OK] Minimalism subtractive-inward basic structure');

  // 4) Subtractive Outward (segments: full, then inward shrunken slices until length<=2)
  // For length=4 and repetition=0 -> segments: [0..3] then [1..2]
  {
    const proc = new MinProcessCtor({ operation: 'subtractive', direction: 'outward', repetition: 0 });
    const out = proc.generate(motif);
    assert.equal(out.length, 4 + 2, 'subtractive outward: expected 2 segments for length=4 (4 + 2)');
    assert.ok(samePD(out.slice(0, 4), motif), 'subtractive outward: first segment equals original');
    assert.ok(samePD(out.slice(4, 6), motif.slice(1, 3)), 'subtractive outward: second segment equals motif[1..3)');
    assertTimesNonDecreasing(out, 'subtractive outward');
  }
  console.log('[OK] Minimalism subtractive-outward basic structure');

  // 5) Alternating Tintinnabuli direction
  // Use a 6-note m-voice so we can observe alternation over more steps
  const mVoice = [
    { pitch: 60, duration: 0.5, time: 0.0 },
    { pitch: 61, duration: 0.5, time: 0.5 },
    { pitch: 62, duration: 0.5, time: 1.0 },
    { pitch: 64, duration: 0.5, time: 1.5 },
    { pitch: 65, duration: 0.5, time: 2.0 },
    { pitch: 67, duration: 0.5, time: 2.5 },
  ];
  const tChord = [60, 64, 67]; // C major triad
  const tAlt = new TintinnabuliCtor(tChord, 'alternate', 0);
  const tVoice = tAlt.generate(mVoice);

  // Properties:
  // - Same length and numeric, non-decreasing times
  assert.equal(tVoice.length, mVoice.length, 'Tintinnabuli alternate: output length matches input');
  assertTimesNonDecreasing(tVoice, 'Tintinnabuli alternate');

  // - Should exhibit both upward and downward selections at least once across the sequence
  const diffs = tVoice.map((n, i) => (typeof n.pitch === 'number' ? n.pitch - mVoice[i].pitch : 0));
  const hasUp = diffs.some((d) => d > 0);
  const hasDown = diffs.some((d) => d < 0);
  // Allow zeros (exact match) but require at least one positive and one negative across the run
  assert.ok(hasUp && hasDown, 'Tintinnabuli alternate: expected both upward and downward selections across sequence');

  // - For consecutive non-zero diffs, check we see at least one sign flip (evidence of alternation)
  const nonZero = diffs.filter((d) => d !== 0);
  let sawFlip = false;
  for (let i = 1; i < nonZero.length; i++) {
    if (Math.sign(nonZero[i]) !== Math.sign(nonZero[i - 1])) {
      sawFlip = true;
      break;
    }
  }
  assert.ok(sawFlip, 'Tintinnabuli alternate: expected at least one sign flip across non-zero differences');

  console.log('[OK] Tintinnabuli alternate direction produces bidirectional choices with flips');

  console.log('All additional minimalism tests passed.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
