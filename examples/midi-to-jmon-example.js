/**
 * Example: MIDI to JMON Converter Usage
 *
 * This example demonstrates how to use the new MIDI to JMON converter
 * with different options and Tone.js integration patterns.
 */

import { midiToJmon } from "../src/converters/midi-to-jmon.js";
import * as Tone from "tone"; // Assuming Tone.js is available

// Example 1: Basic conversion with Tone.js injection
async function basicConversion() {
  try {
    // Load a MIDI file (you would get this from file input, fetch, etc.)
    const midiFile = await fetch("path/to/your/midi/file.mid");
    const midiBuffer = await midiFile.arrayBuffer();

    // Convert MIDI to JMON with Tone.js instance
    const jmonComposition = await midiToJmon(midiBuffer, {
      Tone: Tone, // Injectable Tone instance
      trackNaming: "auto", // Use instrument detection for track names
      mergeDrums: true, // Combine drum tracks
      includeModulations: true, // Include MIDI CC as modulations
    });

    console.log("Converted JMON:", jmonComposition);
    return jmonComposition;
  } catch (error) {
    console.error("Conversion failed:", error);
  }
}

// Example 2: Advanced conversion with quantization
async function advancedConversion(midiData) {
  const jmonComposition = await midiToJmon(midiData, {
    Tone: Tone,
    trackNaming: "instrument", // Use instrument names
    mergeDrums: false, // Keep drum tracks separate
    quantize: 0.25, // Quantize to 16th notes
    includeModulations: true, // Include CC data
    includeTempo: true, // Include tempo changes
    includeKeySignature: true, // Try to detect key signature
  });

  return jmonComposition;
}

// Example 3: Browser usage with file input
function setupFileInput() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".mid,.midi";

  fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();

      // Convert to JMON
      const jmonComposition = await midiToJmon(arrayBuffer, {
        Tone: Tone,
        trackNaming: "auto",
      });

      // Now you can use the JMON composition with the music player
      const playerElement = jm.render(jmonComposition, {
        Tone: Tone,
        autoplay: false,
      });

      document.body.appendChild(playerElement);
    } catch (error) {
      console.error("Error converting MIDI file:", error);
      alert("Error converting MIDI file: " + error.message);
    }
  });

  document.body.appendChild(fileInput);
}

// Example 4: Node.js usage
async function nodeJsExample() {
  // In Node.js, you need to provide Tone.js explicitly
  const fs = await import("fs");

  try {
    const midiBuffer = fs.readFileSync("path/to/midi/file.mid");

    // You would need to import and provide Tone.js in Node.js
    const ToneModule = await import("tone");

    const jmonComposition = await midiToJmon(midiBuffer, {
      Tone: ToneModule.default || ToneModule,
      trackNaming: "auto",
    });

    // Save the JMON file
    fs.writeFileSync(
      "converted.json",
      JSON.stringify(jmonComposition, null, 2),
    );
  } catch (error) {
    console.error("Node.js conversion failed:", error);
  }
}

// Example 5: Integration with existing JMON workflow
async function fullWorkflowExample(midiData) {
  // Step 1: Convert MIDI to JMON
  const jmonComposition = await midiToJmon(midiData, {
    Tone: Tone,
    trackNaming: "auto",
    quantize: 0.125, // Quantize to 32nd notes for precision
  });

  // Step 2: Validate the result
  const validation = jm.validate(jmonComposition);
  if (!validation.valid) {
    console.warn("JMON validation issues:", validation.errors);
  }

  // Step 3: Convert to other formats
  const abcNotation = jm.converters.abc(jmonComposition);
  console.log("ABC Notation:", abcNotation);

  // Step 4: Create interactive player
  const playerElement = jm.render(jmonComposition, {
    Tone: Tone,
    autoplay: false,
    showDebug: true,
  });

  // Step 5: Render musical score
  const scoreElement = await jm.score(jmonComposition, {
    showAbc: true,
    responsive: "resize",
  });

  return {
    jmonComposition,
    abcNotation,
    playerElement,
    scoreElement,
  };
}

// Export examples for use
export {
  advancedConversion,
  basicConversion,
  fullWorkflowExample,
  nodeJsExample,
  setupFileInput,
};

// Usage instructions
console.log(`
MIDI to JMON Converter Examples

Basic usage:
  const jmon = await midiToJmon(midiBuffer, { Tone });

Advanced usage:
  const jmon = await midiToJmon(midiBuffer, {
    Tone: Tone,
    trackNaming: 'auto',    // 'auto', 'numbered', 'channel', 'instrument'
    mergeDrums: true,       // Combine drum tracks
    quantize: 0.25,         // Quantize to grid (quarter notes)
    includeModulations: true // Include MIDI CC data
  });

Available from main jm object:
  import jm from 'jmon-studio';
  const jmon = await jm.converters.midiToJmon(midiBuffer, options);
`);
