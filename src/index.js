import { JmonValidator } from "./utils/jmon-validator.js";
import algorithms from "./algorithms/index.js";
import { createPlayer } from "./browser/music-player.js";
import {
  abc,
  midi,
  midiToJmon,
  supercollider,
  tonejs,
  wav,
} from "./converters/index.js";
import * as jmonUtils from "./utils/jmon-utils.js";
import {
  createGMInstrumentNode,
  findGMProgramByName,
  generateSamplerUrls,
  getPopularInstruments,
  GM_INSTRUMENTS,
} from "./utils/gm-instruments.js";
/**
 * Validation utilitaire simple
 * @param {Object} obj - Objet JMON à valider
 * @returns {Object} { valid, errors, normalized }
 */
function validateJmon(obj) {
  const validator = new JmonValidator();
  return validator.validateAndNormalize(obj);
}

/**
 * Main render function for JMON objects
 * @param {Object} jmonObj - JMON object to render
 * @param {Object} options - Player options
 * @param {Object} options.Tone - Pre-loaded Tone.js instance (optional)
 * @returns {HTMLElement} Player element
 */
function render(jmonObj, options = {}) {
  // Basic validation and normalization
  if (!jmonObj || typeof jmonObj !== "object") {
    console.error("[RENDER] Invalid JMON object:", jmonObj);
    throw new Error("render() requires a valid JMON object");
  }

  // If it's not already a JMON object, try to normalize it
  if (!jmonObj.sequences && !jmonObj.tracks && !jmonObj.format) {
    console.warn(
      "[RENDER] Object does not appear to be JMON format, attempting normalization",
    );
    // Try to create a minimal JMON structure
  }

  return createPlayer(jmonObj, options);
}

/**
 * Main play function for JMON objects
 * @param {Object} jmonObj - JMON object to play
 * @param {Object} options - Player options
 * @param {Object} options.Tone - Pre-loaded Tone.js instance (optional)
 * @returns {HTMLElement} Player element (auto-plays)
 */
function play(jmonObj, options = {}) {
  // Disable autoplay by default for play function
  const playOptions = { autoplay: false, ...options };
  return createPlayer(jmonObj, playOptions);
}

/**
 * Score function - renders ABC notation as visual musical score
 * @param {Object} jmonObj - JMON object to render as score
 * @param {Object} options - Score rendering options
 * @param {Object} options.ABCJS - Pre-loaded ABCJS instance (optional)
 * @param {Object} options.abcjs - Pre-loaded ABCJS instance (optional, lowercase alias)
 * @param {boolean} options.autoload - Whether to auto-load ABCJS if not provided (default: true)
 * @returns {HTMLElement} Score container element
 */
async function score(jmonObj, options = {}) {
  const {
    scale = 0.9,
    staffwidth,
    showAbc = true,
    responsive = "resize",
    abcOptions = {},
    ABCJS: externalABCJS = null,
    abcjs: externalAbcjs = null, // Support lowercase alias
    autoload = true,
  } = options;

  // Generate ABC notation with options
  const abcNotation = abc(jmonObj, abcOptions);

  // Create container
  const scoreContainer = document.createElement("div");
  scoreContainer.style.cssText = `
		margin: 15px 0;
		font-family: sans-serif;
	`;

  // Create div for rendered notation
  const notationDiv = document.createElement("div");
  notationDiv.id = `rendered-score-${Date.now()}`;
  notationDiv.style.cssText = `
		width: 100%;
		overflow-x: auto;
		margin: 10px 0;
	`;
  scoreContainer.appendChild(notationDiv);

  // Add ABC text as collapsible if requested
  if (showAbc) {
    const details = document.createElement("details");
    details.style.marginTop = "15px";

    const summary = document.createElement("summary");
    summary.textContent = "ABC Notation (click to expand)";
    summary.style.cursor = "pointer";
    details.appendChild(summary);

    const pre = document.createElement("pre");
    pre.textContent = abcNotation;
    pre.style.cssText = `
			background: #f5f5f5;
			padding: 10px;
			border-radius: 4px;
			overflow-x: auto;
			font-size: 12px;
		`;
    details.appendChild(pre);
    scoreContainer.appendChild(details);
  }

  // Initialize ABCJS (support both uppercase ABCJS and lowercase abcjs parameters)
  let ABCJSInstance = externalABCJS || externalAbcjs ||
    (typeof window !== "undefined" && window.ABCJS) ||
    (typeof ABCJS !== "undefined" ? ABCJS : null);

  // Try to auto-load ABCJS if not available and autoload is enabled
  if (!ABCJSInstance && autoload) {
    try {
      if (typeof require !== "undefined") {
        console.log("[SCORE] Loading ABCJS via require()...");
        ABCJSInstance = await require("abcjs");
      } else {
        console.log("[SCORE] Loading ABCJS via import()...");
        const ABCJSModule = await import("https://cdn.skypack.dev/abcjs");
        ABCJSInstance = ABCJSModule.default || ABCJSModule;
      }

      // Validate that we got a proper ABCJS object
      if (!ABCJSInstance || !ABCJSInstance.renderAbc) {
        console.warn(
          "[SCORE] First load attempt failed, trying alternative CDN...",
        );
        try {
          const ABCJSAlt = await import(
            "https://cdn.jsdelivr.net/npm/abcjs@6.4.0/dist/abcjs-basic-min.js"
          );
          ABCJSInstance = ABCJSAlt.default || ABCJSAlt.ABCJS ||
            (typeof window !== "undefined" && window.ABCJS);
          if (!ABCJSInstance || !ABCJSInstance.renderAbc) {
            throw new Error("Alternative CDN also failed");
          }
        } catch (altError) {
          console.warn("[SCORE] Could not auto-load ABCJS:", altError.message);
          ABCJSInstance = null;
        }
      }

      if (ABCJSInstance) {
        console.log(
          "[SCORE] ABCJS loaded successfully, version:",
          ABCJSInstance.version || "unknown",
        );
        // Make it globally available for consistency
        if (typeof window !== "undefined") {
          window.ABCJS = ABCJSInstance;
        }
      }
    } catch (error) {
      console.warn("[SCORE] Could not auto-load ABCJS:", error.message);
      console.log("[SCORE] To use score rendering, load ABCJS manually first:");
      console.log('Method 1: ABCJS = await require("abcjs")');
      console.log(
        'Method 2: ABCJS = await import("https://cdn.skypack.dev/abcjs").then(m => m.default)',
      );
      ABCJSInstance = null;
    }
  }

  // Render the musical notation using ABCJS
  if (ABCJSInstance && ABCJSInstance.renderAbc) {
    try {
      // Determine staff width from container if not provided
      const width = staffwidth || null;
      const params = { responsive, scale };
      if (width) params.staffwidth = width;
      ABCJSInstance.renderAbc(notationDiv, abcNotation, params);

      // Check if anything was actually rendered
      setTimeout(() => {
        if (
          notationDiv.children.length === 0 ||
          notationDiv.innerHTML.trim() === ""
        ) {
          // Try alternative rendering method
          try {
            ABCJSInstance.renderAbc(notationDiv, abcNotation);

            if (notationDiv.children.length === 0) {
              notationDiv.innerHTML =
                '<p style="color: red;">ABCJS rendering failed - no content generated</p><pre>' +
                abcNotation + "</pre>";
            }
          } catch (e) {
            notationDiv.innerHTML =
              "<p>Error with alternative rendering</p><pre>" + abcNotation +
              "</pre>";
          }
        }
      }, 200);
    } catch (error) {
      console.error("[SCORE] Error rendering with ABCJS:", error);
      notationDiv.innerHTML = "<p>Error rendering notation</p><pre>" +
        abcNotation + "</pre>";
    }
  } else {
    const message = autoload
      ? "ABCJS not available and auto-loading failed - showing text notation only"
      : "ABCJS not provided and auto-loading disabled - showing text notation only";
    notationDiv.innerHTML = `<p>${message}</p><pre>` + abcNotation + "</pre>";

    if (!ABCJSInstance && autoload) {
      console.log("[SCORE] To use visual score rendering, try:");
      console.log(
        'ABCJS = await require("abcjs"), then jm.score(composition, { ABCJS })',
      );
    }
  }

  return scoreContainer;
} // Create the main jm object
const jm = {
  // Core functionality
  render,
  play,
  score,
  validate: validateJmon,

  // Core formats and players
  createPlayer,

  // Converters
  converters: {
    abc,
    midi,
    midiToJmon,
    tonejs,
    wav,
    supercollider,
  },

  // Theory and algorithms
  theory: algorithms.theory,
  generative: algorithms.generative,
  analysis: algorithms.analysis,
  constants: algorithms.constants,

  // Utils
  utils: {
    ...algorithms.utils,
    JmonValidator,
    // Expose utility helpers
    quantize: (val, grid, mode) =>
      import("./utils/quantize.js").then((m) => m.quantize(val, grid, mode)),
    quantizeEvents: async (events, opts) =>
      (await import("./utils/quantize.js")).quantizeEvents(events, opts),
    quantizeTrack: async (track, opts) =>
      (await import("./utils/quantize.js")).quantizeTrack(track, opts),
    quantizeComposition: async (comp, opts) =>
      (await import("./utils/quantize.js")).quantizeComposition(comp, opts),
    // JMON utilities - official format helpers
    jmon: jmonUtils,
  },

  // GM Instruments
  instruments: {
    GM_INSTRUMENTS,
    generateSamplerUrls,
    createGMInstrumentNode,
    findGMProgramByName,
    getPopularInstruments,
  },

  VERSION: "1.0.0",
};

// Add visualization namespace with lazy-loaded loop visualizer
const visualization = {
  loops: {
    async plotLoops(
      loops,
      measureLength = 4,
      pulse = 1 / 4,
      colors = null,
      options = {},
    ) {
      const { LoopVisualizer } = await import(
        "./algorithms/visualization/loops/LoopVisualizer.js"
      );
      return LoopVisualizer.plotLoops(
        loops,
        measureLength,
        pulse,
        colors,
        options,
      );
    },
  },
};

// Extend jm with visualization namespace
jm.visualization = visualization;

// Export both default and named
export { jm };
export default jm;
