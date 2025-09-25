/**
 * JMON Studio entrypoint
 * Exposes a unified `jm` API consumed by build and tests.
 *
 * This file intentionally avoids side-effects at module top-level so it can
 * be safely imported in Node test environments and browser bundles.
 */

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

// GM instruments helpers (optional); load lazily when needed to avoid top-level await in UMD
let GM_INSTRUMENTS, createGMInstrumentNode, findGMProgramByName, generateSamplerUrls, getPopularInstruments;
/**
 * Lazy-load GM instrument helpers.
 * Returns a cached module after first load.
 */
async function __loadGmInstruments() {
  if (!GM_INSTRUMENTS && !createGMInstrumentNode) {
    const gm = await import("./utils/gm-instruments.js");
    GM_INSTRUMENTS = gm.GM_INSTRUMENTS;
    createGMInstrumentNode = gm.createGMInstrumentNode;
    findGMProgramByName = gm.findGMProgramByName;
    generateSamplerUrls = gm.generateSamplerUrls;
    getPopularInstruments = gm.getPopularInstruments;
  }
  return {
    GM_INSTRUMENTS,
    createGMInstrumentNode,
    findGMProgramByName,
    generateSamplerUrls,
    getPopularInstruments,
  };
}

/**
 * Minimal validation/normalization entry
 */
function validateJmon(obj) {
  const validator = new JmonValidator();
  return validator.validateAndNormalize(obj);
}

/**
 * Render a player UI (browser environments)
 */
function render(jmonObj, options = {}) {
  if (!jmonObj || typeof jmonObj !== "object") {
    throw new Error("render() requires a valid JMON object");
  }
  return createPlayer(jmonObj, options);
}

/**
 * Play without auto-start (browser environments)
 */
function play(jmonObj, options = {}) {
  const playOptions = { autoplay: false, ...options };
  return createPlayer(jmonObj, playOptions);
}

/**
 * Score rendering function that prioritizes SVG output over text fallbacks.
 * Supports VexFlow (SVG) and ABC text fallback.
 * Returns DOM element or structured data depending on environment and engine.
 */
function score(jmonObj, renderingEngine = {}, options = {}) {
  let engineType = "unknown";
  let engineInstance = null;

  // Detect rendering engine
  if (renderingEngine && typeof renderingEngine === "string") {
    engineType = renderingEngine.toLowerCase();
  } else if (renderingEngine && typeof renderingEngine === "object") {
    if (
      renderingEngine.Renderer ||
      renderingEngine.Flow ||
      renderingEngine.VF ||
      renderingEngine.Factory || // some builds expose Factory directly
      (renderingEngine.Vex && (renderingEngine.Vex.Flow || renderingEngine.Vex)) // nested Vex namespace
    ) {
      engineType = "vexflow";
      engineInstance = renderingEngine;
    }
  } else if (typeof window !== "undefined") {
    if (
      window.VF ||
      window.VexFlow ||
      (window.Vex && (window.Vex.Flow || window.Vex)) ||
      (window.Flow && window.Flow.Factory) // some builds expose Flow.Factory globally
    ) {
      engineType = "vexflow";
      engineInstance =
        window.VF ||
        window.VexFlow ||
        (window.Vex && (window.Vex.Flow || window.Vex)) ||
        window; // allow { Flow: { Factory } } pattern
    }
  }

  // VexFlow path: render SVG and return the container element
  if (engineType === "vexflow") {
    // Create container element - works in both browser and Observable environments
    const hasDocument = typeof document !== "undefined";
    let container;

    if (hasDocument) {
      container = document.createElement("div");
      const elementId = `vexflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      container.id = elementId;

      // For Observable and similar environments, just create the element without mounting
      // VexFlow can render to detached elements

      try {
        const vex = convertToVexFlow(jmonObj, {
          elementId,
          width: options.width || 800,
          height: options.height || 200,
        });

        if (vex && typeof vex.render === "function") {
          const VF = engineInstance ||
            (typeof window !== "undefined" && (
              window.VF ||
              window.VexFlow ||
              (window.Vex && (window.Vex.Flow || window.Vex))
            ));

          if (VF) {
            // Temporarily mount to DOM if needed for VexFlow to work
            let wasAttached = container.isConnected;
            if (!wasAttached && document.body) {
              container.style.position = "absolute";
              container.style.left = "-10000px";
              container.style.top = "-10000px";
              container.style.visibility = "hidden";
              document.body.appendChild(container);
            }

            vex.render(VF);

            // Clean up temporary mounting
            if (!wasAttached && container.parentNode) {
              container.parentNode.removeChild(container);
              container.style.position = "";
              container.style.left = "";
              container.style.top = "";
              container.style.visibility = "";
            }

            return container;
          }
        }
      } catch (error) {
        console.warn("VexFlow rendering failed:", error);
        // Fall through to ABC fallback
      }
    } else {
      // Non-DOM environment (e.g., Node.js): return structured data for VexFlow
      try {
        const vexData = convertToVexFlow(jmonObj, {
          width: options.width || 800,
          height: options.height || 200,
        });
        return {
          type: "vexflow",
          data: vexData,
          options: { width: options.width || 800, height: options.height || 200 }
        };
      } catch (error) {
        console.warn("VexFlow conversion failed:", error);
        // Fall through to ABC fallback
      }
    }
  }

  // ABCJS support removed - VexFlow is stable and sufficient

  // ABC text fallback - works in all environments
  const notation = abc(jmonObj, options.abc || {});

  if (typeof document !== "undefined") {
    const pre = document.createElement("pre");
    pre.textContent = notation;
    pre.style.fontFamily = "monospace";
    pre.style.fontSize = "12px";
    pre.style.whiteSpace = "pre-wrap";
    return pre;
  }

  // Non-DOM environment: return structured data
  return { type: "abc", data: notation, options };
}

// Compose the jm API object expected by build and tests
const jm = {
  // Core
  render,
  play,
  score,
  validate: validateJmon,

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

  // Namespaces from algorithms
  theory: algorithms.theory,
  generative: algorithms.generative,
  analysis: algorithms.analysis,
  constants: algorithms.constants,
  audio: algorithms.audio,

  // Utils
  utils: {
    ...algorithms.utils,
    JmonValidator,
    jmon: jmonUtils,
  },

  // Instruments (optional; may be undefined in non-browser builds)
  instruments: {
    // Lazy loader to initialize GM instrument helpers on demand
    // Usage: await jm.instruments.load()
    load: __loadGmInstruments,
    // These remain undefined until load() is called in environments where
    // gm-instruments are not preloaded.
    GM_INSTRUMENTS,
    generateSamplerUrls,
    createGMInstrumentNode,
    findGMProgramByName,
    getPopularInstruments,
  },

  VERSION: "1.0.0",
};

// Named and default exports
export { jm };
export const audio = algorithms.audio;
export default jm;
