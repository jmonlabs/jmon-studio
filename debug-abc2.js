// Debug the measure spanning logic specifically
import { abc } from "./src/converters/index.js";

// Test a note that definitely spans measures
const spanTest = {
  metadata: { title: "Span Test" },
  tracks: [{
    notes: [
      { time: 0, duration: 2, pitch: 60 }, // 2 beats
      { time: 2, duration: 3, pitch: 62 }, // 3 beats - SHOULD span from beat 2 of measure 1 to beat 1 of measure 2
      // Measure 1: beats 0-4, this note goes from 2 to 5
      // Should be split: 2 beats in measure 1, 1 beat in measure 2
    ],
  }],
};

console.log("Span test (3-beat note starting at beat 2):");
console.log("Expected: note should be split with tie at measure boundary");
const span = abc(spanTest);
console.log(span);

// More extreme test
const extremeSpan = {
  metadata: { title: "Extreme Span" },
  tracks: [{
    notes: [
      { time: 3.5, duration: 2, pitch: 60 }, // Starts at beat 3.5, lasts 2 beats, ends at 5.5
      // Should span: 0.5 beats in measure 1, 1.5 beats in measure 2
    ],
  }],
};

console.log("\nExtreme span test (note from 3.5 to 5.5):");
const extreme = abc(extremeSpan);
console.log(extreme);
