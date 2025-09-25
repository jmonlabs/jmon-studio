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
 * Lightweight score function placeholder.
 * Consumers can use jm.converters.abc or jm.converters.vexflow directly.
 * Returned value is a simple object for future extensibility.
 */
function score(jmonObj, renderingEngine = {}, options = {}) {
  let engineType = "unknown";
  let engineInstance = null;

  if (renderingEngine && typeof renderingEngine === "string") {
    engineType = renderingEngine.toLowerCase();
  } else if (renderingEngine && typeof renderingEngine === "object") {
    if (renderingEngine.renderAbc) {
      engineType = "abcjs";
      engineInstance = renderingEngine;
    } else if (
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
    if (window.ABCJS) {
      engineType = "abcjs";
      engineInstance = window.ABCJS;
    } else if (
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

  // VexFlow path: render SVG to a container and return the element
  if (engineType === "vexflow" && typeof document !== "undefined") {
    const container = document.createElement("div");
    const elementId = `vexflow-${Date.now()}`;
    container.id = elementId;

    // Ensure the container is attached before rendering so VexFlow can resolve the target element
    if (typeof document !== "undefined" && !container.isConnected && document.body) {
      // mount offscreen to avoid layout shift; Observable will reparent the same node later
      container.style.position = "absolute";
      container.style.left = "-10000px";
      container.style.top = "-10000px";
      container.style.visibility = "hidden";
      document.body.appendChild(container);
    }

    const vex = convertToVexFlow(jmonObj, {
      elementId,
      width: options.width,
      height: options.height,
    });

    if (vex && typeof vex.render === "function") {
      try {
        const VF =
          engineInstance ||
          (typeof window !== "undefined" && (window.VF || window.VexFlow || (window.Vex && (window.Vex.Flow || window.Vex))));
        if (VF) {
          vex.render(VF);
          // restore normal positioning if we mounted offscreen
          container.style.position = "";
          container.style.left = "";
          container.style.top = "";
          container.style.visibility = "";
        }
      } catch {}
    }
    return container;
  }

  // ABCJS path: render into a container when engine provided/detected; fallback to text
  if (engineType === "abcjs" && typeof document !== "undefined" && engineInstance && engineInstance.renderAbc) {
    const container = document.createElement("div");
    const notation = abc(jmonObj, options.abc || {});
    try {
      engineInstance.renderAbc(container, notation, {
        responsive: options.responsive || "resize",
        scale: options.scale || 1.0,
        staffwidth: options.staffwidth,
      });
      return container;
    } catch {}
    const pre = document.createElement("pre");
    pre.textContent = notation;
    return pre;
  }

  // Fallback: return ABC text (works in non-DOM contexts)
  const notation = abc(jmonObj, options.abc || {});
  if (typeof document !== "undefined") {
    const pre = document.createElement("pre");
    pre.textContent = notation;
    return pre;
  }
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
