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
function score(jmonObj, options = {}) {
  const asAbc = abc(jmonObj, options?.abc || {});
  return { type: "abc", data: asAbc, options };
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
