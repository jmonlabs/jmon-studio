// Debug the measure calculation issue
import { abc } from "./src/converters/index.js";

const testComposition = {
  metadata: { title: "Debug Measures" },
  keySignature: "C",
  tracks: [{
    notes: [
      // Exactly 4 quarter notes = should be 1 measure with L:1/8
      { pitch: 60, duration: 1, time: 0 }, // 1 quarter = 2 eighths -> should show as "2"
      { pitch: 62, duration: 1, time: 1 }, // 1 quarter = 2 eighths -> should show as "2"
      { pitch: 64, duration: 1, time: 2 }, // 1 quarter = 2 eighths -> should show as "2"
      { pitch: 65, duration: 1, time: 3 }, // 1 quarter = 2 eighths -> should show as "2"
      // Total: 8 eighths = exactly 1 measure

      { pitch: 67, duration: 2, time: 4 }, // 2 quarters = 4 eighths -> should show as "4"
      { pitch: 69, duration: 2, time: 6 }, // 2 quarters = 4 eighths -> should show as "4"
      // Total: 8 eighths = exactly 1 measure
    ],
  }],
};

console.log("=== DEBUGGING MEASURE CALCULATION ===");
const result = abc(testComposition);
console.log(result);

console.log("\n=== EXPECTED vs ACTUAL ===");
console.log("Expected with L:1/8:");
console.log("M1: c2 d2 e2 f2 | (2+2+2+2 = 8 eighths)");
console.log("M2: g4 a4 | (4+4 = 8 eighths)");

const lines = result.split("\n");
const musicLine = lines.find((line) =>
  line.includes("c") && line.includes("|")
);
console.log("\nActual:", musicLine);

// The issue: the converter thinks in quarter notes but outputs in eighth note values
// Need to fix the measure boundary detection
