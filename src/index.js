import { JmonValidator } from "./utils/jmon-validator.browser.js";
import algorithms from "./algorithms/index.js";
import { createPlayer } from "./browser/music-player.js";
import {
  abc,
  convertToVexFlow,
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
 * Score function - renders musical score using auto-detected rendering engine
 * @param {Object} jmonObj - JMON object to render as score
 * @param {Object|string} renderingEngine - Rendering engine (ABCJS, VexFlow, or engine name)
 * @param {Object} options - Score rendering options
 * @returns {HTMLElement} Score container element
 */
async function score(jmonObj, renderingEngine = {}, options = {}) {
  // Handle legacy call signature: score(jmonObj, options)
  if (
    typeof renderingEngine === "object" && !renderingEngine.renderAbc &&
    !renderingEngine.Renderer && !renderingEngine.VF
  ) {
    options = renderingEngine;
    renderingEngine = null;
  }
  const {
    scale = 0.9,
    staffwidth,
    showAbc = true,
    responsive = "resize",
    abcOptions = {},
    width = 800,
    height = 200,
    autoload = true,
  } = options;

  // Auto-detect rendering engine
  let engineType = "unknown";
  let engineInstance = null;

  if (renderingEngine) {
    if (typeof renderingEngine === "string") {
      engineType = renderingEngine.toLowerCase();
    } else if (renderingEngine.renderAbc) {
      engineType = "abcjs";
      engineInstance = renderingEngine;
    } else if (renderingEngine.Renderer || renderingEngine.VF) {
      engineType = "vexflow";
      engineInstance = renderingEngine;
    }
  } else {
    // Try to detect available engines globally
    if (typeof window !== "undefined") {
      if (window.ABCJS) {
        engineType = "abcjs";
        engineInstance = window.ABCJS;
      } else if (window.VF || window.Vex) {
        engineType = "vexflow";
        engineInstance = window.VF || window.Vex;
      }
    }
  }

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

  // Render based on detected engine
  if (engineType === "vexflow" || engineType === "vf") {
    return await renderVexFlowScore(
      jmonObj,
      notationDiv,
      scoreContainer,
      engineInstance,
      options,
    );
  } else {
    return await renderAbcjsScore(
      jmonObj,
      notationDiv,
      scoreContainer,
      engineInstance,
      options,
      autoload,
    );
  }
}

/**
 * Render score using VexFlow
 */
async function renderVexFlowScore(
  jmonObj,
  notationDiv,
  scoreContainer,
  engineInstance,
  options,
) {
  try {
    const elementId = notationDiv.id || `rendered-score-${Date.now()}`;
    if (!notationDiv.id) notationDiv.id = elementId;
    const vexFlowData = convertToVexFlow(jmonObj, {
      element: notationDiv,
      elementId,
      width: options.width,
      height: options.height,
    });

    if (!engineInstance && options.autoload !== false) {
      try {
        console.log("[SCORE] Loading VexFlow...");
        const VexFlowModule = await import(
          "https://cdn.jsdelivr.net/npm/vexflow@5.0.0/+esm"
        );
        // Use the ESM namespace (default may be undefined with +esm)
        engineInstance = VexFlowModule.default || VexFlowModule;
        if (typeof window !== "undefined") {
          // Expose globals for different consumers (VF, VexFlow, Vex.Flow)
          window.VF = engineInstance;
          window.VexFlow = engineInstance;
          window.Vex = window.Vex || {};
          window.Vex.Flow = engineInstance;
        }
      } catch (error) {
        console.warn(
          "[SCORE] Could not auto-load VexFlow via ESM:",
          (error && (error.message || String(error))) || "Unknown error",
        );
        // Fallback: inject UMD/CJS script tag (sets window.VF / window.Vex.Flow)
        if (typeof document !== "undefined") {
          await new Promise((resolve) => {
            const script = document.createElement("script");
            script.src =
              "https://cdn.jsdelivr.net/npm/vexflow@5.0.0/build/cjs/vexflow.min.js";
            script.async = true;
            script.onload = () => {
              engineInstance = window.VF || window.VexFlow ||
                (window.Vex && (window.Vex.Flow || window.Vex)) || null;
              if (engineInstance && !window.VF) {
                window.VF = engineInstance;
              }
              resolve();
            };
            script.onerror = () => resolve();
            document.head.appendChild(script);
          });
        }
      }
    }

    if (engineInstance && vexFlowData.render) {
      // Ensure the notation container is attached to the DOM so VexFlow can find it by ID
      const shouldAttach = typeof document !== "undefined" &&
        !notationDiv.isConnected;
      if (shouldAttach) {
        // Temporarily attach offscreen to avoid layout shifts
        scoreContainer.style.position = "absolute";
        scoreContainer.style.left = "-10000px";
        scoreContainer.style.top = "-10000px";
        scoreContainer.style.visibility = "hidden";
        document.body.appendChild(scoreContainer);
      }
      try {
        vexFlowData.render(engineInstance);
      } finally {
        if (shouldAttach) {
          // Clean up temporary styles and detach from body
          scoreContainer.style.position = "";
          scoreContainer.style.left = "";
          scoreContainer.style.top = "";
          scoreContainer.style.visibility = "";
          if (document.body && document.body.contains(scoreContainer)) {
            document.body.removeChild(scoreContainer);
          }
        }
      }
    } else {
      notationDiv.innerHTML =
        `<p>VexFlow not available - install VexFlow to render scores</p>`;
    }
  } catch (error) {
    console.error("[SCORE] Error rendering with VexFlow:", error);
    notationDiv.innerHTML =
      `<p>Error rendering VexFlow score: ${error.message}</p>`;
  }

  return scoreContainer;
}

/**
 * Render score using ABCJS (legacy function)
 */
async function renderAbcjsScore(
  jmonObj,
  notationDiv,
  scoreContainer,
  engineInstance,
  options,
  autoload,
) {
  const { scale, staffwidth, responsive, abcOptions, showAbc } = options;

  // Generate ABC notation with options
  const abcNotation = abc(jmonObj, abcOptions);

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

  // Try to auto-load ABCJS if not available and autoload is enabled
  if (!engineInstance && autoload) {
    try {
      if (typeof require !== "undefined") {
        console.log("[SCORE] Loading ABCJS via require()...");
        engineInstance = await require("abcjs");
      } else {
        console.log("[SCORE] Loading ABCJS via import()...");
        const ABCJSModule = await import("https://cdn.skypack.dev/abcjs");
        engineInstance = ABCJSModule.default || ABCJSModule;
      }

      // Validate that we got a proper ABCJS object
      if (!engineInstance || !engineInstance.renderAbc) {
        console.warn(
          "[SCORE] First load attempt failed, trying alternative CDN...",
        );
        try {
          const ABCJSAlt = await import(
            "https://cdn.jsdelivr.net/npm/abcjs@6.4.0/dist/abcjs-basic-min.js"
          );
          engineInstance = ABCJSAlt.default || ABCJSAlt.ABCJS ||
            (typeof window !== "undefined" && window.ABCJS);
          if (!engineInstance || !engineInstance.renderAbc) {
            throw new Error("Alternative CDN also failed");
          }
        } catch (altError) {
          console.warn("[SCORE] Could not auto-load ABCJS:", altError.message);
          engineInstance = null;
        }
      }

      if (engineInstance) {
        console.log(
          "[SCORE] ABCJS loaded successfully, version:",
          engineInstance.version || "unknown",
        );
        if (typeof window !== "undefined") {
          window.ABCJS = engineInstance;
        }
      }
    } catch (error) {
      console.warn("[SCORE] Could not auto-load ABCJS:", error.message);
      engineInstance = null;
    }
  }

  // Render the musical notation using ABCJS
  if (engineInstance && engineInstance.renderAbc) {
    try {
      const width = staffwidth || null;
      const params = { responsive, scale };
      if (width) params.staffwidth = width;
      engineInstance.renderAbc(notationDiv, abcNotation, params);

      // Check if anything was actually rendered
      setTimeout(() => {
        if (
          notationDiv.children.length === 0 ||
          notationDiv.innerHTML.trim() === ""
        ) {
          try {
            engineInstance.renderAbc(notationDiv, abcNotation);
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
    vexflow: convertToVexFlow,
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
