// Test ABC conversion
import { abc } from "./src/converters/index.js";

// Test composition from user
const testComposition = {
  metadata: { title: "Melody A", keySignature: "E" },
  tracks: [{
    notes: [
      { time: 0, duration: 1, pitch: 68 },
      { time: 1, duration: 0.5, pitch: 64 },
      { time: 1.5, duration: 0.25, pitch: 71 },
      { time: 1.75, duration: 0.5, pitch: 69 },
      { time: 2.25, duration: 1, pitch: 75 },
      { time: 3.25, duration: 0.75, pitch: 73 },
    ],
  }],
};

console.log("Test composition:");
console.log(JSON.stringify(testComposition, null, 2));

console.log("\nGenerated ABC:");
const abcResult = abc(testComposition);
console.log(abcResult);

// Let's also check measure boundaries
console.log("\nAnalyzing measure boundaries:");
const notes = testComposition.tracks[0].notes;
let currentTime = 0;
let measureNumber = 1;
const measureLength = 4; // 4/4 time = 4 quarter notes

notes.forEach((note) => {
  const measureStart = (measureNumber - 1) * measureLength;
  const measureEnd = measureNumber * measureLength;

  console.log(
    `Note: pitch=${note.pitch}, time=${note.time}, duration=${note.duration}`,
  );
  console.log(
    `  Starts in measure ${Math.floor(note.time / measureLength) + 1}`,
  );
  console.log(`  Ends at time ${note.time + note.duration}`);

  if (note.time + note.duration > measureEnd) {
    console.log(`  *** SPANS ACROSS MEASURES ***`);
  }
});
