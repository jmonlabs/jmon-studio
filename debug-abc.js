// Debug ABC conversion step by step
import { abc } from "./src/converters/index.js";

// Simple test with exactly 4 quarter notes = 1 measure
const simpleTest = {
  metadata: { title: "Simple Test", keySignature: "C" },
  tracks: [{
    notes: [
      { time: 0, duration: 1, pitch: 60 }, // C4 for 1 beat
      { time: 1, duration: 1, pitch: 62 }, // D4 for 1 beat
      { time: 2, duration: 1, pitch: 64 }, // E4 for 1 beat
      { time: 3, duration: 1, pitch: 65 }, // F4 for 1 beat
      // This should exactly fill 1 measure (4 beats)
      { time: 4, duration: 1, pitch: 67 }, // G4 for 1 beat - start of measure 2
    ],
  }],
};

console.log("Simple test (should have 1 bar line after 4 quarter notes):");
const simple = abc(simpleTest);
console.log(simple);

// Test with fractional durations
const fractionalTest = {
  metadata: { title: "Fractional Test" },
  tracks: [{
    notes: [
      { time: 0, duration: 0.5, pitch: 60 }, // 0.5 beats
      { time: 0.5, duration: 0.5, pitch: 62 }, // 0.5 beats
      { time: 1, duration: 1, pitch: 64 }, // 1 beat
      { time: 2, duration: 1.5, pitch: 65 }, // 1.5 beats - should span into next measure
      // Total so far: 3.5 beats in measure 1, 0.5 beats in measure 2
      { time: 3.5, duration: 0.5, pitch: 67 }, // 0.5 beats
      // Should complete measure 1 at time 4.0
    ],
  }],
};

console.log("\nFractional test (should show ties for note spanning measures):");
const fractional = abc(fractionalTest);
console.log(fractional);
