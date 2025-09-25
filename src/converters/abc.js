import { JmonValidator } from "../utils/jmon-validator.browser.js";
import {
  encodeAbcDuration,
  quantize,
  quantizeEvents,
} from "../utils/quantize.js";
import { deriveVisualFromArticulations } from "../utils/notation/deriveVisualFromArticulations.js";
/**
 * toAbc.js - Convert jmon format to ABC notation
 *
 * Converts jmon compositions to ABC score format for traditional music notation.
 * Supports multi-voice scores, ornamentations, and dynamic markings.
 */

export class ToAbc {
  /**
   * Convertit un objet JMON en ABC après validation/normalisation
   * @param {Object} composition - objet JMON
   * @returns {string} ABC notation string
   */
  static fromValidatedJmon(composition) {
    const validator = new JmonValidator();
    const { valid, normalized, errors } = validator.validateAndNormalize(
      composition,
    );
    if (!valid) {
      console.warn("JMON non valide pour conversion ABC:", errors);
      throw new Error("JMON non valide");
    }
    return this.convertToAbc(normalized);
  }
  /**
   * Helper function to parse time strings with fallback
   * @param {string|number} timeString - time value
   * @param {number} bpm - beats per minute
   * @returns {number} parsed time in seconds
   */
  static parseTimeString(timeString, bpm) {
    if (typeof timeString === "number") return timeString;
    if (typeof timeString !== "string") return 0;
    try {
      if (jmonTone && jmonTone._parseTimeString) {
        return jmonTone._parseTimeString(timeString, bpm);
      }
    } catch (e) {}
    if (timeString.includes(":")) {
      const parts = timeString.split(":").map(parseFloat);
      const bars = parts[0] || 0;
      const beats = parts[1] || 0;
      const ticks = parts[2] || 0;
      const beatLength = 60 / bpm;
      const barLength = beatLength * 4;
      const tickLength = beatLength / 480;
      return bars * barLength + beats * beatLength + ticks * tickLength;
    }
    if (timeString.match(/^\d+[nthq]$/)) {
      const noteValue = parseInt(timeString);
      const noteType = timeString.slice(-1);
      const beatLength = 60 / bpm;
      switch (noteType) {
        case "n":
          return beatLength * (4 / noteValue);
        case "t":
          return beatLength * (4 / noteValue) * (2 / 3);
        case "h":
          return beatLength * 2;
        case "q":
          return beatLength;
        default:
          return beatLength;
      }
    }
    return parseFloat(timeString) || 0;
  }
  static convertToAbc(composition, options = {}) {
    // Header
    let abc = "X:1\n";
    abc += `T:${
      composition.metadata?.title || composition.metadata?.name ||
      composition.meta?.title || composition.meta?.name || composition.label ||
      "Untitled"
    }\n`;
    // Add composer line if available
    const composer = composition.metadata?.composer ||
      composition.metadata?.author || composition.meta?.composer ||
      composition.meta?.author;
    if (composer) {
      abc += `C:${composer}\n`;
    }
    abc += `M:${composition.timeSignature || "4/4"}\n`;

    // Choose L: value based on common durations to minimize fractions
    // Get all durations from tracks to analyze - handle case where notes are directly on composition
    let tracks = [];
    if (Array.isArray(composition.tracks)) {
      tracks = composition.tracks;
    } else if (composition.tracks && typeof composition.tracks === "object") {
      tracks = Object.values(composition.tracks);
    } else if (composition.notes && Array.isArray(composition.notes)) {
      // Handle case where notes are directly on the composition
      tracks = [{ notes: composition.notes }];
    } else {
      tracks = [];
    }

    let hasSmallDurations = false;
    tracks.forEach((track) => {
      const notes = track.notes || track;
      if (Array.isArray(notes)) {
        notes.forEach((note) => {
          if (
            typeof note.duration === "number" &&
            (note.duration === 0.25 || note.duration === 0.5)
          ) {
            hasSmallDurations = true;
          }
        });
      }
    });

    // Use L:1/8 if there are many 0.25 and 0.5 durations, otherwise L:1/4
    const useEighthNotes = hasSmallDurations;
    const lValue = useEighthNotes ? 1 / 8 : 1 / 4;
    const lStr = useEighthNotes ? "1/8" : "1/4";
    const tempo = composition.tempo || composition.bpm || 120;

    abc += `L:${lStr}\n`;
    abc += `Q:${lStr}=${Math.round(tempo * (useEighthNotes ? 2 : 1))}\n`;
    abc += `K:${composition.keySignature || "C"}\n`;

    if (tracks.length === 0) return abc;

    // Parse time signature to get beats per measure
    const timeSignature = composition.timeSignature || "4/4";
    const [beatsPerMeasure, beatValue] = timeSignature.split("/").map(Number);
    const quarterNotesPerMeasure = beatsPerMeasure * (4 / beatValue); // Convert to quarter note units

    // Convert to L: value units for measure calculation
    const lUnitsPerMeasure = quarterNotesPerMeasure / lValue;

    // Line break options
    const measuresPerLine = options.measuresPerLine || 4; // Default: 4 measures per line
    const lineBreaks = options.lineBreaks || []; // Manual line breaks at specific measure numbers
    const renderMode = options.renderMode || "merged"; // 'merged', 'tracks', or 'single'
    const trackIndex = options.trackIndex || 0; // Which track to render if renderMode is 'single'
    const hideRests = !!options.hideRests; // if true, use spacer rests 'x' instead of 'z'
    const showArticulations = options.showArticulations !== false; // default true

    // Pre-compute total project length (already have tracks)

    // Pre-compute total project length (in quarter notes) for padding
    const totalQuarters = (() => {
      let maxEnd = 0;
      tracks.forEach((track) => {
        const notes = track.notes || track;
        if (!Array.isArray(notes)) return;
        notes.forEach((n) => {
          const start = typeof n.time === "number" ? n.time : 0;
          const dur = typeof n.duration === "number" ? n.duration : 1;
          const end = start + dur;
          if (end > maxEnd) maxEnd = end;
        });
      });
      return maxEnd;
    })();
    const totalMeasures = Math.max(
      1,
      Math.ceil(totalQuarters / quarterNotesPerMeasure),
    );

    // Handle different rendering modes
    if (renderMode === "tracks" && tracks.length > 1) {
      // Add score configuration for multi-voice rendering
      abc += `%%score {`;
      tracks.forEach((track, trackIndex) => {
        if (trackIndex > 0) abc += " | ";
        abc += `${trackIndex + 1}`;
      });
      abc += `}\n`;

      // Render each track as a separate voice/staff
      tracks.forEach((track, trackIndex) => {
        const trackNotes = track.notes || track;
        if (trackNotes.length === 0) return;

        // Add voice header with proper naming
        const voiceId = trackIndex + 1;
        const trackName = track.label || `Track ${trackIndex + 1}`;
        const shortName = trackName.length > 12
          ? trackName.substring(0, 10) + ".."
          : trackName;
        const instrument = track.instrument ? ` [${track.instrument}]` : "";

        abc +=
          `V:${voiceId} name="${trackName}${instrument}" snm="${shortName}"\n`;

        const sortedNotes = trackNotes.filter((n) => n.pitch !== undefined)
          .sort((a, b) => (a.time || 0) - (b.time || 0));
        const { abcNotesStr } = this.convertNotesToAbc(
          sortedNotes,
          quarterNotesPerMeasure,
          measuresPerLine,
          lineBreaks,
          {
            hideRests,
            showArticulations,
            padMeasures: tracks.length > 1 ? totalMeasures : 0,
          },
          lValue,
        );

        if (abcNotesStr.trim()) {
          abc += abcNotesStr + "\n";
        }
      });
    } else if (renderMode === "drums") {
      // Merge all tracks into a single percussion staff
      abc += `V:1 clef=perc name="Drum Set" snm="Drums"\n`;
      // Build a mapping from track label to ABC pitch for staff position
      const defaultMap = options.percussionMap || {
        "kick": "C,,",
        "snare": "D,",
        "hat": "F",
        "hi-hat": "F",
        "hihat": "F",
      };
      const mapLabelToPitch = (label) => {
        const lower = (label || "").toLowerCase();
        for (const key of Object.keys(defaultMap)) {
          if (lower.includes(key)) return defaultMap[key];
        }
        return "E"; // default mid line
      };
      const merged = [];
      tracks.forEach((track) => {
        const notes = track.notes || track;
        const label = track.label || "";
        const staffPitch = mapLabelToPitch(label);
        (notes || []).forEach((n) => {
          if (n.pitch === undefined) return; // skip invalid
          merged.push({
            time: typeof n.time === "number" ? n.time : 0,
            duration: typeof n.duration === "number" ? n.duration : 1,
            // Use mapped ABC pitch string directly in converter
            pitch: staffPitch,
            articulations: Array.isArray(n.articulations) ? n.articulations : [],
          });
        });
      });
      const sorted = merged.sort((a, b) => (a.time || 0) - (b.time || 0));
      const { abcNotesStr } = this.convertNotesToAbc(
        sorted,
        quarterNotesPerMeasure,
        measuresPerLine,
        lineBreaks,
        {
          hideRests,
          showArticulations,
          padMeasures: tracks.length > 1 ? totalMeasures : 0,
        },
        lValue,
      );
      if (abcNotesStr.trim()) abc += abcNotesStr + "\n";
    } else if (renderMode === "single") {
      // Render only the specified track
      const track = tracks[trackIndex];
      if (track) {
        const notes = track.notes || track;
        const sortedNotes = notes.filter((n) => n.pitch !== undefined).sort((
          a,
          b,
        ) => (a.time || 0) - (b.time || 0));
        const { abcNotesStr } = this.convertNotesToAbc(
          sortedNotes,
          quarterNotesPerMeasure,
          measuresPerLine,
          lineBreaks,
          {
            hideRests,
            showArticulations,
            padMeasures: tracks.length > 1 ? totalMeasures : 0,
          },
          lValue,
        );

        if (abcNotesStr.trim()) {
          abc += abcNotesStr + "\n";
        }
      }
    } else {
      // Default: merge all tracks chronologically
      const allNotes = [];
      tracks.forEach((track) => {
        const trackNotes = track.notes || track;
        trackNotes.forEach((note) => {
          if (note.pitch !== undefined) {
            allNotes.push(note);
          }
        });
      });

      const sortedNotes = allNotes.sort((a, b) =>
        (a.time || 0) - (b.time || 0)
      );
      const { abcNotesStr } = this.convertNotesToAbc(
        sortedNotes,
        quarterNotesPerMeasure,
        measuresPerLine,
        lineBreaks,
        {
          hideRests,
          showArticulations,
          padMeasures: tracks.length > 1 ? totalMeasures : 0,
        },
        lValue,
      );

      if (abcNotesStr.trim()) {
        abc += abcNotesStr + "\n";
      }
    }
    return abc;
  }

  /**
   * Convert notes to ABC notation string
   */
  static convertNotesToAbc(
    sortedNotes,
    quarterNotesPerMeasure,
    measuresPerLine,
    lineBreaks,
    opts = {},
    lValue = 1 / 4,
  ) {
    let abcNotes = "";
    // Convert measure length to L: value units
    const lUnitsPerMeasure = quarterNotesPerMeasure / lValue;
    let currentMeasureBeat = 0; // in L: value units
    let measureCount = 0;
    let measuresOnCurrentLine = 0;
    let lastEnd = 0; // absolute time in quarter-note units

    const grid = opts?.quantizeBeats || 0.25; // user-definable grid
    const EPS = 1e-6;
    const q = (v) => quantize(v, grid, "nearest");
    const encodeDur = (d) => encodeAbcDuration(d, grid / lValue);

    const emitToken = (token) => {
      abcNotes += token + " ";
    };
    const emitBarsIfNeeded = () => {
      while (currentMeasureBeat >= lUnitsPerMeasure - EPS) {
        emitToken("|");
        currentMeasureBeat -= lUnitsPerMeasure;
        measureCount++;
        measuresOnCurrentLine++;
        const shouldBreakLine = lineBreaks.includes(measureCount) ||
          (measuresOnCurrentLine >= measuresPerLine);
        if (shouldBreakLine) {
          abcNotes += "\n";
          measuresOnCurrentLine = 0;
        }
      }
    };
    const emitRest = (dur, { forceVisible = false } = {}) => {
      // dur in quarter-note units; convert to L: units
      let remaining = dur / lValue;
      while (remaining > EPS) {
        const spaceLeft = q(lUnitsPerMeasure - currentMeasureBeat);
        const chunk = q(Math.min(remaining, spaceLeft));
        if (chunk > EPS) {
          let restToken = (opts.hideRests && !forceVisible) ? "x" : "z";
          restToken += encodeDur(chunk);
          emitToken(restToken);
          currentMeasureBeat = q(currentMeasureBeat + chunk);
          remaining = q(remaining - chunk);
        }
        emitBarsIfNeeded();
      }
    };

    for (const note of sortedNotes) {
      const start = (typeof note.time === "number") ? q(note.time) : 0; // quarters
      const duration = (typeof note.duration === "number")
        ? q(note.duration / lValue) // Convert to L: value units
        : (1.0 / lValue);

      // Insert rests for gaps
      const gap = q((start - lastEnd) / lValue); // Convert gap to L: units
      if (gap > EPS) emitRest(gap);

      // Build pitch token
      let token = "z";
      // PATCH: Support chords (arrays of pitch)
      if (Array.isArray(note.pitch)) {
        // Convert each MIDI pitch to ABC note and wrap in brackets
        const midiToAbc = (midi) => {
          const noteNames = [
            "C",
            "C#",
            "D",
            "D#",
            "E",
            "F",
            "F#",
            "G",
            "G#",
            "A",
            "A#",
            "B",
          ];
          const octave = Math.floor(midi / 12) - 1;
          const noteIndex = midi % 12;
          let abc = noteNames[noteIndex].replace("#", "^");
          if (octave >= 4) {
            abc = abc.toLowerCase();
            if (octave > 4) abc += "'".repeat(octave - 4);
          } else if (octave < 4) {
            abc = abc.toUpperCase();
            if (octave < 3) abc += ",".repeat(3 - octave);
          }
          return abc;
        };
        token = "[" + note.pitch.map(midiToAbc).join("") + "]";
      } else if (typeof note.pitch === "number") {
        const midi = note.pitch;
        const noteNames = [
          "C",
          "C#",
          "D",
          "D#",
          "E",
          "F",
          "F#",
          "G",
          "G#",
          "A",
          "A#",
          "B",
        ];
        const octave = Math.floor(midi / 12) - 1;
        const noteIndex = midi % 12;
        token = noteNames[noteIndex].replace("#", "^");
        if (octave >= 4) {
          token = token.toLowerCase();
          if (octave > 4) token += "'".repeat(octave - 4);
        } else if (octave < 4) {
          token = token.toUpperCase();
          if (octave < 3) token += ",".repeat(3 - octave);
        }
      } else if (typeof note.pitch === "string") {
        token = note.pitch;
      } else if (note.pitch === null) {
        token = opts.hideRests ? "x" : "z";
      }

      // Handle notes that span across measures
      let remainingDuration = duration;
      let isFirstPart = true;

      while (remainingDuration > EPS) {
        const spaceLeft = q(lUnitsPerMeasure - currentMeasureBeat);
        const chunk = q(Math.min(remainingDuration, spaceLeft));

        if (chunk > EPS) {
          let noteToken = token;
          noteToken += encodeDur(chunk);

          // Articulations via ABC decorations (from deriveVisualFromArticulations) - only on first part
          if (isFirstPart && opts.showArticulations) {
            const arr = Array.isArray(note.articulations) ? note.articulations : [];
            if (arr.length) {
              const hints = deriveVisualFromArticulations(arr);
              const decorations = (hints && hints.abc && Array.isArray(hints.abc.decorations))
                ? hints.abc.decorations.join("")
                : "";
              if (decorations) {
                noteToken = decorations + noteToken;
              }
            }
          }

          // Add tie if this chunk doesn't complete the note (more parts coming)
          if (remainingDuration > chunk + EPS) {
            noteToken += "-"; // tie to next part
          }

          emitToken(noteToken);
          currentMeasureBeat = q(currentMeasureBeat + chunk);
          remainingDuration = q(remainingDuration - chunk);
          isFirstPart = false;
        }

        emitBarsIfNeeded();
      }

      lastEnd = q(start + duration);
    }

    // Pad trailing measure(s) to align voices
    const padMeasures = opts.padMeasures || 0;
    while (measureCount < padMeasures) {
      const remaining = q(lUnitsPerMeasure - currentMeasureBeat);
      if (remaining > EPS) emitRest(remaining, { forceVisible: true });
      // ensure barline at end of measure
      emitToken("|");
      currentMeasureBeat = 0;
      measureCount++;
    }

    // Fill current incomplete measure with rests
    if (currentMeasureBeat > EPS) {
      const remaining = q(lUnitsPerMeasure - currentMeasureBeat);
      if (remaining > EPS) {
        emitRest(remaining, { forceVisible: true });
      }
    }

    // Final bar if needed
    const trimmed = abcNotes.trim();
    if (trimmed && !trimmed.endsWith("|")) abcNotes += "|";
    return { abcNotesStr: abcNotes };
  }
}
export function abc(composition, options = {}) {
  return ToAbc.convertToAbc(composition, options);
}
