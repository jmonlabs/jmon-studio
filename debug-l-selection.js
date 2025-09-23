// Debug L: value selection
import { abc } from "./src/converters/index.js";

const testWithSmallDurations = {
  metadata: { title: "Should Use L:1/8" },
  keySignature: "C",
  tracks: [{
    notes: [
      { pitch: 60, duration: 0.25, time: 0 }, // Has 0.25 - should trigger L:1/8
      { pitch: 62, duration: 0.5, time: 0.25 }, // Has 0.5 - should trigger L:1/8
    ],
  }],
};

const testWithoutSmallDurations = {
  metadata: { title: "Should Use L:1/4" },
  keySignature: "C",
  tracks: [{
    notes: [
      { pitch: 60, duration: 1, time: 0 }, // Only whole notes
      { pitch: 62, duration: 2, time: 1 }, // Should keep L:1/4
    ],
  }],
};

console.log("=== TESTING L: VALUE SELECTION ===");

console.log("1. With small durations (0.25, 0.5):");
const result1 = abc(testWithSmallDurations);
console.log(result1);

console.log("\n2. Without small durations (1, 2):");
const result2 = abc(testWithoutSmallDurations);
console.log(result2);

// Check if the selection logic is working
const lines1 = result1.split("\n");
const lines2 = result2.split("\n");
const l1 = lines1.find((line) => line.startsWith("L:"));
const l2 = lines2.find((line) => line.startsWith("L:"));

console.log(`\nFirst test L: value: ${l1}`);
console.log(`Second test L: value: ${l2}`);
console.log(l1 === "L:1/8" ? "✅ Small durations -> L:1/8" : "❌ Logic broken");
console.log(l2 === "L:1/4" ? "✅ Large durations -> L:1/4" : "❌ Logic broken");
