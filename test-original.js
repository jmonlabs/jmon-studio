// Test the exact original case from the user
import { abc } from "./src/converters/index.js";

// Recreate the exact isorhythm pattern
const pitches = [68, 64, 71, 69, 75, 73]; // 6 items
const durations = [1, 0.5, 0.25, 0.5, 1, 0.75, 0.5, 0.5, 1, 2]; // 10 items

// Simulate what jm.theory.rhythm.isorhythm would produce
function isorhythm(pitches, durations) {
  const notes = [];
  let time = 0;

  // Create enough notes to see the pattern repeat
  for (let i = 0; i < 15; i++) {
    const pitch = pitches[i % pitches.length];
    const duration = durations[i % durations.length];

    notes.push({ time, duration, pitch });
    time += duration;
  }

  return notes;
}

const notes = isorhythm(pitches, durations);
const composition = {
  metadata: { title: "Melody A", keySignature: "E" },
  tracks: [{ notes: notes }],
};

console.log("Generated notes (first 8):");
notes.slice(0, 8).forEach((note, i) => {
  console.log(
    `${i}: time=${note.time}, duration=${note.duration}, pitch=${note.pitch}`,
  );
});

console.log("\nMeasure analysis:");
notes.slice(0, 8).forEach((note, i) => {
  const measure = Math.floor(note.time / 4) + 1;
  const beatInMeasure = note.time % 4;
  const endTime = note.time + note.duration;
  const endMeasure = Math.floor(endTime / 4) + 1;

  console.log(
    `Note ${i}: M${measure} beat ${beatInMeasure.toFixed(2)} -> ${
      endTime.toFixed(2)
    } (M${endMeasure})`,
  );
  if (measure !== endMeasure) {
    console.log(`  *** SPANS MEASURES ${measure}-${endMeasure} ***`);
  }
});

console.log("\nGenerated ABC:");
const result = abc(composition);
console.log(result);
