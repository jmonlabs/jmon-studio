class Dt {
  constructor() {
    console.warn(
      "[JMON] Using simplified browser validator. For full validation, use Node.js environment."
    );
  }
  /**
   * Basic validation and normalization for browser use
   * @param {Object} obj - JMON object to validate
   * @returns {Object} { valid, errors, normalized }
   */
  validateAndNormalize(t) {
    const e = [];
    let n = { ...t };
    try {
      return !t || typeof t != "object" ? (e.push("Object must be a valid object"), { valid: !1, errors: e, normalized: null }) : (!n.tracks && !n.notes && (Array.isArray(t) ? n = { tracks: [{ notes: t }] } : n.tracks = n.tracks || []), n.notes && !n.tracks && (n.tracks = [{ notes: n.notes }], delete n.notes), Array.isArray(n.tracks) || (n.tracks = [n.tracks]), n.tracks.forEach((r, o) => {
        if (!r.notes) {
          e.push(`Track ${o} missing notes array`);
          return;
        }
        if (!Array.isArray(r.notes)) {
          e.push(`Track ${o} notes must be an array`);
          return;
        }
        r.notes.forEach((i, s) => {
          if (typeof i != "object") {
            e.push(
              `Track ${o}, note ${s}: must be an object`
            );
            return;
          }
          i.pitch === void 0 && (i.pitch = null), i.duration === void 0 && (i.duration = 1), i.time === void 0 && (i.time = 0);
        });
      }), n.format = n.format || "jmon", n.version = n.version || "1.0", n.timeSignature = n.timeSignature || "4/4", n.keySignature = n.keySignature || "C", {
        valid: e.length === 0,
        errors: e,
        normalized: n
      });
    } catch (r) {
      return e.push(`Validation error: ${r.message}`), {
        valid: !1,
        errors: e,
        normalized: null
      };
    }
  }
  /**
   * Simple validation without normalization
   * @param {Object} obj - JMON object to validate
   * @returns {boolean} true if valid
   */
  isValid(t) {
    return this.validateAndNormalize(t).valid;
  }
}
class ct {
  static chromatic_scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  static flat_to_sharp = {
    Bb: "A#",
    Db: "C#",
    Eb: "D#",
    Gb: "F#",
    Ab: "G#",
    "B♭": "A#",
    "D♭": "C#",
    "E♭": "D#",
    "G♭": "F#",
    "A♭": "G#",
    "B-": "A#",
    "D-": "C#",
    "E-": "D#",
    "G-": "F#",
    "A-": "G#"
  };
  static scale_intervals = {
    major: [0, 2, 4, 5, 7, 9, 11],
    // Ionian
    minor: [0, 2, 3, 5, 7, 8, 10],
    // Aeolian
    diminished: [0, 2, 3, 5, 6, 8, 9, 11],
    "major pentatonic": [0, 2, 4, 7, 9],
    "minor pentatonic": [0, 3, 5, 7, 10],
    chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    lydian: [0, 2, 4, 6, 7, 9, 11],
    mixolydian: [0, 2, 4, 5, 7, 9, 10],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    phrygian: [0, 1, 3, 5, 7, 8, 10],
    locrian: [0, 1, 3, 5, 6, 8, 10],
    "harmonic minor": [0, 2, 3, 5, 7, 8, 11],
    "melodic minor ascending": [0, 2, 3, 5, 7, 9, 11],
    "melodic minor descending": [0, 2, 3, 5, 7, 8, 10]
    // same as natural minor
  };
  static intervals = {
    P1: 0,
    m2: 1,
    M2: 2,
    m3: 3,
    M3: 4,
    P4: 5,
    P5: 7,
    m6: 8,
    M6: 9,
    m7: 10,
    M7: 11,
    P8: 12
  };
  /**
   * Convert flat notes to their equivalent sharp notes
   * @param {string} note - The note to convert
   * @returns {string} The converted note or original if no conversion needed
   */
  static convertFlatToSharp(t) {
    return this.flat_to_sharp[t] || t;
  }
  /**
   * Convert note name with octave to MIDI number
   * @param {string} noteName - Note name with octave (e.g. 'C4', 'F#5', 'Bb3')
   * @returns {number} MIDI note number
   */
  static noteNameToMidi(t) {
    const e = t.match(/^([A-G][#b♭-]?)(-?\d+)$/);
    if (!e)
      throw new Error(`Invalid note name format: ${t}`);
    const [, n, r] = e, o = this.convertFlatToSharp(n), i = this.chromatic_scale.indexOf(o);
    if (i === -1)
      throw new Error(`Invalid note name: ${n}`);
    return i + (parseInt(r) + 1) * 12;
  }
  /**
   * Convert MIDI number to note name
   * @param {number} midiNumber - MIDI note number
   * @param {boolean} [preferFlat=false] - Whether to prefer flat notation
   * @returns {string} Note name with octave (e.g. 'C4', 'F#5')
   */
  static midiToNoteName(t, e = !1) {
    const n = Math.floor(t / 12) - 1, r = t % 12;
    return `${this.chromatic_scale[r]}${n}`;
  }
  /**
   * Returns the intervals for a triad based on the given scale intervals
   * @param {Array} scale - Scale intervals
   * @returns {Array} Triad intervals [root, third, fifth]
   */
  static scaleToTriad(t) {
    return [t[0], t[2], t[4]];
  }
}
class me {
  /**
   * Create a Scale
   * @param {string} tonic - The tonic note of the scale
   * @param {string} mode - The type of scale
   */
  constructor(t, e = "major") {
    const n = ct.convertFlatToSharp(t);
    if (!ct.chromatic_scale.includes(n))
      throw new Error(`'${t}' is not a valid tonic note. Select one among '${ct.chromatic_scale.join(", ")}'.`);
    if (this.tonic = n, !Object.keys(ct.scale_intervals).includes(e))
      throw new Error(`'${e}' is not a valid scale. Select one among '${Object.keys(ct.scale_intervals).join(", ")}'.`);
    this.mode = e;
  }
  /**
  * Generate a scale with flexible start/end points
  * @param {Object} options - Configuration object
  * @param {number|string} [options.start] - Starting MIDI note number or note name (e.g. 'C4')
  * @param {number|string} [options.end] - Ending MIDI note number or note name
  * @param {number} [options.length] - Number of notes to generate
  * @returns {Array} Array of MIDI note numbers representing the scale
  */
  generate(t = {}) {
    const e = ct.scale_intervals[this.mode];
    if (!e)
      return console.warn(`Unknown scale mode: ${this.mode}`), [];
    typeof t.start == "string" && (t.start = ct.noteNameToMidi(t.start)), typeof t.end == "string" && (t.end = ct.noteNameToMidi(t.end));
    const n = t.start ?? 60;
    if (ct.chromatic_scale.indexOf(this.tonic) === -1)
      return console.warn(`Unknown tonic: ${this.tonic}`), [];
    const o = (s, a) => {
      const l = a % e.length, u = Math.floor(a / e.length) * 12, d = e[l];
      return s + d + u;
    }, i = [];
    if (t.end !== void 0)
      for (let s = 0; ; s++) {
        const a = o(n, s);
        if (a > t.end) break;
        i.push(a);
      }
    else if (t.length)
      for (let s = 0; s < t.length; s++)
        i.push(o(n, s));
    else
      return e.map((s) => n + s);
    return i;
  }
  /**
   * Get the note names of the scale
   * @returns {Array} Array of note names in the scale
   */
  getNoteNames() {
    const t = ct.scale_intervals[this.mode];
    if (!t) return [];
    const e = ct.chromatic_scale.indexOf(this.tonic);
    return e === -1 ? [] : t.map((n) => {
      const r = (e + n) % 12;
      return ct.chromatic_scale[r];
    });
  }
  /**
   * Check if a given pitch is in the scale
   * @param {number} pitch - MIDI note number
   * @returns {boolean} True if the pitch class is in the scale
   */
  isInScale(t) {
    const e = t % 12;
    return this.generate().map((r) => r % 12).includes(e);
  }
}
function Be(c) {
  if (typeof c == "object" && !Array.isArray(c))
    return c;
  if (Array.isArray(c)) {
    if (c.length === 0)
      return {};
    if (c.every((e) => Array.isArray(e) && e.length === 3))
      return { "track 1": c };
    const t = {};
    return c.forEach((e, n) => {
      t[`track ${n + 1}`] = e;
    }), t;
  }
  throw new Error("Input must be a list or dict of tracks.");
}
function pe(c, t) {
  return t.reduce(
    (e, n) => Math.abs(n - c) < Math.abs(e - c) ? n : e
  );
}
function fe(c) {
  return Math.floor(c / 12) - 1;
}
function Ve(c) {
  return {
    "D-": "C#",
    "E-": "D#",
    "G-": "F#",
    "A-": "G#",
    "B-": "A#",
    Db: "C#",
    Eb: "D#",
    Gb: "F#",
    Ab: "G#",
    Bb: "A#"
  }[c] || c;
}
function Ut(c, t, e) {
  typeof c == "string" && (c = Pt(c)), typeof e == "string" && (e = Pt(e));
  const n = t.indexOf(e);
  if (t.includes(c))
    return t.indexOf(c) - n;
  {
    const r = pe(c, t), o = t.indexOf(r), i = o > 0 ? o - 1 : o, s = t[i], a = r - c, l = c - s, u = a + l;
    if (u === 0) return o - n;
    const d = 1 - a / u, m = 1 - l / u, p = o - n, g = i - n;
    return p * d + g * m;
  }
}
function qe(c, t, e) {
  const n = t.indexOf(e), r = Math.round(n + c);
  if (r >= 0 && r < t.length)
    return t[r];
  {
    const o = Math.max(0, Math.min(r, t.length - 1)), i = Math.min(t.length - 1, Math.max(r, 0)), s = t[o], a = t[i], l = i - r, u = r - o, d = l + u;
    if (d === 0)
      return (a + s) / 2;
    const m = 1 - l / d, p = 1 - u / d;
    return a * m + s * p;
  }
}
function ge(c) {
  c.length > 0 && c[0].length === 2 && (c = c.map((n) => [n[0], n[1], 0]));
  const t = [];
  let e = 0;
  for (const [n, r, o] of c)
    t.push([n, r, e]), e += r;
  return t;
}
function ye(c, t = 0) {
  const e = [...c].sort((o, i) => o[2] - i[2]);
  let n = 0;
  const r = [];
  for (const o of e) {
    const [i, s, a] = o, l = t + a;
    if (l > n) {
      const d = [null, l - n, n - t];
      r.push(d);
    }
    r.push(o), n = Math.max(n, l + s);
  }
  return r;
}
function we(c) {
  c.sort((t, e) => t[2] - e[2]);
  for (let t = 0; t < c.length - 1; t++) {
    const e = c[t], n = c[t + 1];
    if (e[2] + e[1] > n[2]) {
      const o = n[2] - e[2];
      c[t] = [e[0], o, e[2]];
    }
  }
  return c;
}
function Ge(c) {
  return we(ye(c));
}
function Pt(c) {
  const t = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], e = {
    Db: "C#",
    Eb: "D#",
    Gb: "F#",
    Ab: "G#",
    Bb: "A#",
    Cb: "B"
  };
  let n = 4, r = c;
  if (c.includes("b")) {
    const s = c.slice(0, -1);
    e[s] && (r = e[s] + c.slice(-1));
  }
  let o;
  return r.length > 2 || r.length === 2 && !isNaN(r[1]) ? (o = r.slice(0, -1), n = parseInt(r.slice(-1))) : o = r[0], 12 * (n + 1) + t.indexOf(o);
}
function Ye(c) {
  const t = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], e = Math.floor(c / 12) - 1, n = c % 12;
  return t[n] + e.toString();
}
function Ue(c, t = "offsets") {
  const e = [];
  let n = 0;
  for (const [r, o, i] of c)
    e.push([r, o, n]), n += o;
  return e;
}
function Je(c) {
  return c.every((t) => Array.isArray(t)) ? "list of tuples" : c.every((t) => !Array.isArray(t)) ? "list" : "unknown";
}
function We(c, t, e, n = null, r = null) {
  const o = n !== null ? n : Math.min(...c), i = r !== null ? r : Math.max(...c);
  return o === i ? new Array(c.length).fill((t + e) / 2) : c.map(
    (s) => (s - o) * (e - t) / (i - o) + t
  );
}
function be(c, t) {
  return c.map(([e, n, r]) => [e, n, r + t]);
}
function He(c, t, e) {
  const n = [];
  for (const [r, o, i] of c) {
    const s = Math.round(i / e) * e, a = (Math.floor(s / t) + 1) * t;
    let l = Math.round(o / e) * e;
    l = Math.min(l, a - s), l > 0 && n.push([r, l, s]);
  }
  return n;
}
function Ke(c, t) {
  const n = c.filter(([s, , a]) => s !== null && a !== null).sort((s, a) => s[2] - a[2]), r = Math.max(...n.map(([, , s]) => s)), o = Math.floor(r / t) + 1, i = [];
  for (let s = 0; s < o; s++) {
    const a = s * t;
    let l = null, u = 1 / 0;
    for (const [d, , m] of n) {
      const p = a - m;
      if (p >= 0 && p < u && (u = p, l = d), m > a) break;
    }
    l !== null && i.push(l);
  }
  return i;
}
function Qe(c, t) {
  return t.reduce(
    (e, n) => Math.abs(n - c) < Math.abs(e - c) ? n : e
  );
}
function Xe(c, t) {
  return 60 / t * c;
}
function* Ze(c = 0, t = 1, e = 0, n = 1) {
  for (; ; )
    yield e + n * c, [c, t] = [t, c + t];
}
function tn(c, t, e) {
  const n = {};
  for (const [r, o] of Object.entries(c)) {
    const i = [];
    for (let s = 0; s < t; s++) {
      const a = s * e, l = be(o, a);
      i.push(...l);
    }
    n[r] = i;
  }
  return n;
}
const en = {
  "Acoustic Grand Piano": 0,
  "Bright Acoustic Piano": 1,
  "Electric Grand Piano": 2,
  "Honky-tonk Piano": 3,
  "Electric Piano 1": 4,
  "Electric Piano 2": 5,
  Harpsichord: 6,
  Clavinet: 7,
  // ... (full mapping truncated for brevity, but would include all 128 instruments)
  Gunshot: 127
}, nn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  adjustNoteDurationsToPreventOverlaps: we,
  cdeToMidi: Pt,
  checkInput: Je,
  fibonacci: Ze,
  fillGapsWithRests: ye,
  findClosestPitchAtMeasureStart: Ke,
  getDegreeFromPitch: Ut,
  getOctave: fe,
  getPitchFromDegree: qe,
  getSharp: Ve,
  instrumentMapping: en,
  midiToCde: Ye,
  noOverlap: Ue,
  offsetTrack: be,
  qlToSeconds: Xe,
  quantizeNotes: He,
  repairNotes: Ge,
  repeatPolyloops: tn,
  roundToList: pe,
  scaleList: We,
  setOffsetsAccordingToDurations: ge,
  tracksToDict: Be,
  tune: Qe
}, Symbol.toStringTag, { value: "Module" }));
class rn extends ct {
  /**
   * Initialize a Progression object
   * @param {string} tonicPitch - The tonic pitch of the progression (default: 'C4')
   * @param {string} circleOf - The interval to form the circle (default: 'P5')
   * @param {string} type - The type of progression ('chords' or 'pitches')
   * @param {Array} radius - Range for major, minor, and diminished chords [3, 3, 1]
   * @param {Array} weights - Weights for selecting chord types
   */
  constructor(t = "C4", e = "P5", n = "chords", r = [3, 3, 1], o = null) {
    if (super(), this.tonicMidi = Pt(t), this.circleOf = e, this.type = n, this.radius = r, this.weights = o || r, !Object.keys(this.intervals).includes(this.circleOf))
      throw new Error(`Select a circleOf among ${Object.keys(this.intervals).join(", ")}.`);
    if (!["chords", "pitches"].includes(this.type))
      throw new Error("Type must either be 'pitches' or 'chords'.");
  }
  /**
   * Compute chords based on the circle of fifths, thirds, etc., within the specified radius
   * @returns {Object} Object containing major, minor, and diminished chord roots
   */
  computeCircle() {
    const t = this.intervals[this.circleOf], e = [this.tonicMidi];
    for (let n = 0; n < Math.max(...this.radius); n++) {
      const r = (e[e.length - 1] + t) % 12 + Math.floor(e[e.length - 1] / 12) * 12;
      e.push(r);
    }
    return {
      major: e.slice(0, this.radius[0]),
      minor: e.slice(0, this.radius[1]),
      diminished: e.slice(0, this.radius[2])
    };
  }
  /**
   * Generate a chord based on root MIDI note and chord type
   * @param {number} rootNoteMidi - The root MIDI note of the chord
   * @param {string} chordType - The type of chord ('major', 'minor', 'diminished')
   * @returns {Array} Array of MIDI notes representing the chord
   */
  generateChord(t, e) {
    return ({
      major: [0, 4, 7],
      minor: [0, 3, 7],
      diminished: [0, 3, 6]
    }[e] || [0, 4, 7]).map((i) => t + i).map((i) => i > 127 ? i - 12 : i);
  }
  /**
   * Generate a musical progression
   * @param {number} length - The length of the progression in number of chords (default: 4)
   * @param {number} seed - The seed value for the random number generator
   * @returns {Array} Array of chord arrays representing the progression
   */
  generate(t = 4, e = null) {
    e !== null && (Math.seedrandom = e);
    const { major: n, minor: r, diminished: o } = this.computeCircle(), i = [n, r, o], s = ["major", "minor", "diminished"], a = [];
    for (let l = 0; l < t; l++) {
      const u = this.weightedRandomChoice(this.weights);
      if (i[u].length > 0) {
        const d = i[u][Math.floor(Math.random() * i[u].length)], m = s[u], p = Array.isArray(d) ? d[0] : d, g = this.generateChord(p, m);
        a.push(g);
      }
    }
    return a;
  }
  /**
   * Weighted random choice helper
   * @param {Array} weights - Array of weights
   * @returns {number} Selected index
   */
  weightedRandomChoice(t) {
    const e = t.reduce((r, o) => r + o, 0);
    let n = Math.random() * e;
    for (let r = 0; r < t.length; r++)
      if (n -= t[r], n <= 0)
        return r;
    return t.length - 1;
  }
}
class on extends ct {
  /**
   * Constructs all the necessary attributes for the voice object
   * @param {string} mode - The type of the scale (default: 'major')
   * @param {string} tonic - The tonic note of the scale (default: 'C')
   * @param {Array} degrees - Relative degrees for chord formation (default: [0, 2, 4])
   */
  constructor(t = "major", e = "C", n = [0, 2, 4]) {
    super(), this.tonic = e, this.scale = new me(e, t).generate(), this.degrees = n;
  }
  /**
   * Convert a MIDI note to a chord based on the scale using the specified degrees
   * @param {number} pitch - The MIDI note to convert
   * @returns {Array} Array of MIDI notes representing the chord
   */
  pitchToChord(t) {
    const e = fe(t), n = this.tonic + e.toString(), r = Pt(n), o = this.scale.map((a) => Ut(a, this.scale, r)), i = Math.round(Ut(t, this.scale, r)), s = [];
    for (const a of this.degrees) {
      const l = i + a, u = o.indexOf(l);
      u !== -1 && s.push(this.scale[u]);
    }
    return s;
  }
  /**
   * Generate chords or arpeggios based on the given notes
   * @param {Array} notes - The notes to generate chords or arpeggios from
   * @param {Array} durations - The durations of each note (optional)
   * @param {boolean} arpeggios - If true, generate arpeggios instead of chords (default: false)
   * @returns {Array} The generated chords or arpeggios
   */
  generate(t, e = null, n = !1) {
    if (!Array.isArray(t) || t.length === 0)
      return [];
    let r = t;
    if (typeof t[0] == "number") {
      e === null && (e = [1]);
      let i = 0, s = 0;
      r = t.map((a) => {
        const l = e[i % e.length], u = [a, l, s];
        return s += l, i++, u;
      });
    }
    const o = r.map(([i, s, a]) => [this.pitchToChord(i), s, a]);
    if (n) {
      const i = [];
      for (const [s, a, l] of o) {
        const u = a / s.length;
        s.forEach((d, m) => {
          i.push([d, u, l + m * u]);
        });
      }
      return i;
    } else
      return o;
  }
}
const ue = {
  grace_note: {
    requiredParams: ["graceNoteType"],
    optionalParams: ["gracePitches"],
    conflicts: [],
    description: "Single note before the main note",
    defaultParams: {
      graceNoteType: "acciaccatura"
    },
    validate: (c, t) => ["acciaccatura", "appoggiatura"].includes(t.graceNoteType) ? t.gracePitches && !Array.isArray(t.gracePitches) ? { valid: !1, error: "gracePitches must be an array of pitches" } : { valid: !0 } : { valid: !1, error: "graceNoteType must be either acciaccatura or appoggiatura" }
  },
  trill: {
    requiredParams: [],
    optionalParams: ["by", "trillRate"],
    conflicts: ["mordent"],
    minDuration: "8n",
    description: "Rapid alternation between main note and auxiliary note",
    defaultParams: {
      by: 1,
      trillRate: 0.125
    },
    validate: (c, t) => t.by && typeof t.by != "number" ? { valid: !1, error: "trill step (by) must be a number" } : t.trillRate && typeof t.trillRate != "number" ? { valid: !1, error: "trillRate must be a number" } : { valid: !0 }
  },
  mordent: {
    requiredParams: [],
    optionalParams: ["by"],
    conflicts: ["trill"],
    description: "Quick alternation with note above or below",
    defaultParams: {
      by: 1
    },
    validate: (c, t) => t.by && typeof t.by != "number" ? { valid: !1, error: "mordent step (by) must be a number" } : { valid: !0 }
  },
  turn: {
    requiredParams: [],
    optionalParams: ["scale"],
    conflicts: [],
    description: "Melodic turn around the main note",
    validate: (c, t) => t.scale && typeof t.scale != "string" ? { valid: !1, error: "scale must be a string" } : { valid: !0 }
  },
  arpeggio: {
    requiredParams: ["arpeggioDegrees"],
    optionalParams: ["direction"],
    conflicts: [],
    description: "Notes played in sequence",
    defaultParams: {
      direction: "up"
    },
    validate: (c, t) => Array.isArray(t.arpeggioDegrees) ? t.direction && !["up", "down", "both"].includes(t.direction) ? { valid: !1, error: "direction must be up, down, or both" } : { valid: !0 } : { valid: !1, error: "arpeggioDegrees must be an array" }
  }
};
class Jt {
  /**
   * Validate ornament parameters and compatibility
   * @param {Object} note - The note to apply the ornament to
   * @param {string} type - The type of ornament
   * @param {Object} params - Parameters for the ornament
   * @returns {Object} Validation result with success status and any messages
   */
  static validateOrnament(t, e, n = {}) {
    const r = {
      valid: !1,
      warnings: [],
      errors: []
    }, o = ue[e];
    if (!o)
      return r.errors.push(`Unknown ornament type: ${e}`), r;
    if (o.requiredParams) {
      for (const i of o.requiredParams)
        if (!(i in n))
          return r.errors.push(`Missing required parameter '${i}' for ${e}`), r;
    }
    if (o.minDuration && r.warnings.push(`Duration check not implemented for ${e}`), t.ornaments && o.conflicts) {
      const i = t.ornaments.filter((s) => o.conflicts.includes(s.type)).map((s) => s.type);
      if (i.length > 0)
        return r.errors.push(`${e} conflicts with existing ornaments: ${i.join(", ")}`), r;
    }
    if (o.validate) {
      const i = o.validate(t, n);
      if (!i.valid)
        return r.errors.push(i.error), r;
    }
    return r.valid = !0, r;
  }
  /**
   * Create a new ornament instance with validation
   * @param {Object} options - Ornament configuration
   */
  constructor(t) {
    const e = ue[t.type];
    if (!e)
      throw new Error(`Unknown ornament type: ${t.type}`);
    this.type = t.type, this.params = {
      ...e.defaultParams,
      ...t.parameters
    }, t.tonic && t.mode ? (this.tonicIndex = ct.chromatic_scale.indexOf(t.tonic), this.scale = this.generateScale(t.tonic, t.mode)) : this.scale = null;
  }
  /**
   * Generate a scale for pitch-based ornaments
   */
  generateScale(t, e) {
    const n = ct.scale_intervals[e], r = ct.chromatic_scale.indexOf(t), o = n.map((s) => (r + s) % 12), i = [];
    for (let s = -1; s < 10; s++)
      for (const a of o) {
        const l = 12 * s + a;
        l >= 0 && l <= 127 && i.push(l);
      }
    return i;
  }
  /**
   * Apply the ornament to notes
   */
  apply(t, e = null) {
    if (!Array.isArray(t) || t.length === 0 || (e === null && (e = Math.floor(Math.random() * t.length)), e < 0 || e >= t.length))
      return t;
    const n = t[e], r = Jt.validateOrnament(n, this.type, this.params);
    if (!r.valid)
      return console.warn(`Ornament validation failed: ${r.errors.join(", ")}`), t;
    switch (this.type) {
      case "grace_note":
        return this.addGraceNote(t, e);
      case "trill":
        return this.addTrill(t, e);
      case "mordent":
        return this.addMordent(t, e);
      case "turn":
        return this.addTurn(t, e);
      case "arpeggio":
        return this.addArpeggio(t, e);
      default:
        return t;
    }
  }
  /**
   * Add a grace note
   */
  addGraceNote(t, e) {
    const n = t[e], r = n.pitch, o = n.duration, i = n.time, s = this.params.gracePitches ? this.params.gracePitches[Math.floor(Math.random() * this.params.gracePitches.length)] : r + 1;
    if (this.params.graceNoteType === "acciaccatura") {
      const a = o * 0.125, l = { pitch: r, duration: o, time: i + a };
      return [
        ...t.slice(0, e),
        { pitch: s, duration: a, time: i },
        l,
        ...t.slice(e + 1)
      ];
    } else {
      const a = o / 2, l = { pitch: r, duration: a, time: i + a };
      return [
        ...t.slice(0, e),
        { pitch: s, duration: a, time: i },
        l,
        ...t.slice(e + 1)
      ];
    }
  }
  /**
   * Add a trill
   */
  addTrill(t, e) {
    const n = t[e], r = n.pitch, o = n.duration, i = n.time, s = [];
    let a = i;
    const l = this.params.by || 1, u = this.params.trillRate || 0.125;
    let d;
    if (this.scale && this.scale.includes(r)) {
      const p = (this.scale.indexOf(r) + Math.round(l)) % this.scale.length;
      d = this.scale[p];
    } else
      d = r + l;
    for (; a < i + o; ) {
      const m = i + o - a, p = Math.min(u, m / 2);
      if (m >= p * 2)
        s.push({ pitch: r, duration: p, time: a }), s.push({ pitch: d, duration: p, time: a + p }), a += 2 * p;
      else
        break;
    }
    return [
      ...t.slice(0, e),
      ...s,
      ...t.slice(e + 1)
    ];
  }
  /**
   * Add a mordent
   */
  addMordent(t, e) {
    const n = t[e], r = n.pitch, o = n.duration, i = n.time, s = this.params.by || 1;
    let a;
    if (this.scale && this.scale.includes(r)) {
      const m = this.scale.indexOf(r) + Math.round(s);
      a = this.scale[m] || r + s;
    } else
      a = r + s;
    const l = o / 3, u = [
      { pitch: r, duration: l, time: i },
      { pitch: a, duration: l, time: i + l },
      { pitch: r, duration: l, time: i + 2 * l }
    ];
    return [
      ...t.slice(0, e),
      ...u,
      ...t.slice(e + 1)
    ];
  }
  /**
   * Add a turn
   */
  addTurn(t, e) {
    const n = t[e], r = n.pitch, o = n.duration, i = n.time, s = o / 4;
    let a, l;
    if (this.scale && this.scale.includes(r)) {
      const d = this.scale.indexOf(r);
      a = this.scale[d + 1] || r + 2, l = this.scale[d - 1] || r - 2;
    } else
      a = r + 2, l = r - 2;
    const u = [
      { pitch: r, duration: s, time: i },
      { pitch: a, duration: s, time: i + s },
      { pitch: r, duration: s, time: i + 2 * s },
      { pitch: l, duration: s, time: i + 3 * s }
    ];
    return [
      ...t.slice(0, e),
      ...u,
      ...t.slice(e + 1)
    ];
  }
  /**
   * Add an arpeggio
   */
  addArpeggio(t, e) {
    const n = t[e], r = n.pitch, o = n.duration, i = n.time, { arpeggioDegrees: s, direction: a = "up" } = this.params;
    if (!s || !Array.isArray(s))
      return t;
    const l = [];
    if (this.scale && this.scale.includes(r)) {
      const m = this.scale.indexOf(r);
      l.push(...s.map((p) => this.scale[m + p] || r + p));
    } else
      l.push(...s.map((m) => r + m));
    a === "down" && l.reverse(), a === "both" && l.push(...l.slice(0, -1).reverse());
    const u = o / l.length, d = l.map((m, p) => ({
      pitch: m,
      duration: u,
      time: i + p * u
    }));
    return [
      ...t.slice(0, e),
      ...d,
      ...t.slice(e + 1)
    ];
  }
}
const zt = {
  // Simple articulations
  staccato: {
    complex: !1,
    description: "Shortens note duration to ~50%"
  },
  accent: {
    complex: !1,
    description: "Increases note velocity/emphasis"
  },
  tenuto: {
    complex: !1,
    description: "Holds note for full duration with emphasis"
  },
  legato: {
    complex: !1,
    description: "Smooth connection between notes"
  },
  marcato: {
    complex: !1,
    description: "Strong accent with slight separation"
  },
  // Complex articulations
  glissando: {
    complex: !0,
    requiredParams: ["target"],
    description: "Smooth slide from note to target pitch"
  },
  portamento: {
    complex: !0,
    requiredParams: ["target"],
    optionalParams: ["curve", "speed"],
    description: "Expressive slide between pitches"
  },
  bend: {
    complex: !0,
    requiredParams: ["amount"],
    optionalParams: ["curve", "returnToOriginal"],
    description: "Pitch bend up or down in cents"
  },
  vibrato: {
    complex: !0,
    optionalParams: ["rate", "depth", "delay"],
    description: "Periodic pitch variation"
  },
  tremolo: {
    complex: !0,
    optionalParams: ["rate", "depth"],
    description: "Rapid volume variation"
  },
  crescendo: {
    complex: !0,
    requiredParams: ["endVelocity"],
    optionalParams: ["curve"],
    description: "Gradual volume increase"
  },
  diminuendo: {
    complex: !0,
    requiredParams: ["endVelocity"],
    optionalParams: ["curve"],
    description: "Gradual volume decrease"
  }
};
class _t {
  /**
   * Add articulation to a note in a sequence
   * @param {Array} sequence - The note sequence
   * @param {string} articulationType - Type of articulation
   * @param {number} noteIndex - Index of note to articulate
   * @param {Object} params - Parameters for complex articulations
   * @returns {Object} Result with success status and any warnings
   */
  static addArticulation(t, e, n, r = {}) {
    const o = {
      success: !1,
      warnings: [],
      errors: []
    };
    if (!Array.isArray(t))
      return o.errors.push("Sequence must be an array"), o;
    if (n < 0 || n >= t.length)
      return o.errors.push(`Note index ${n} out of bounds (sequence length: ${t.length})`), o;
    const i = zt[e];
    if (!i)
      return o.errors.push(`Unknown articulation type: ${e}`), o;
    const s = t[n];
    return !s || typeof s != "object" ? (o.errors.push(`Invalid note at index ${n}`), o) : i.complex ? this._addComplexArticulation(s, e, i, r, o) : (s.articulation = e, o.success = !0, o);
  }
  /**
   * Add complex articulation with parameter validation and synchronization
   */
  static _addComplexArticulation(t, e, n, r, o) {
    if (n.requiredParams) {
      for (const i of n.requiredParams)
        if (!(i in r))
          return o.errors.push(`Missing required parameter '${i}' for ${e}`), o;
    }
    switch (e) {
      case "glissando":
      case "portamento":
        return this._applyGlissando(t, e, r, o);
      case "bend":
        return this._applyBend(t, r, o);
      case "vibrato":
        return this._applyVibrato(t, r, o);
      case "tremolo":
        return this._applyTremolo(t, r, o);
      case "crescendo":
      case "diminuendo":
        return this._applyDynamicChange(t, e, r, o);
      default:
        return o.errors.push(`Complex articulation ${e} not implemented`), o;
    }
  }
  /**
   * Apply glissando/portamento articulation
   */
  static _applyGlissando(t, e, n, r) {
    t.articulation = e, t.glissTarget = n.target, t.modulations || (t.modulations = []);
    const o = {
      type: "pitch",
      subtype: e,
      target: n.target,
      curve: n.curve || "linear",
      timing: "note_duration"
    };
    return n.speed !== void 0 && (o.speed = n.speed), t.modulations = t.modulations.filter(
      (i) => !(i.type === "pitch" && i.subtype === e)
    ), t.modulations.push(o), r.success = !0, r.warnings.push(`Added ${e} modulation synchronized with articulation`), r;
  }
  /**
   * Apply pitch bend articulation
   */
  static _applyBend(t, e, n) {
    t.articulation = "bend", t.modulations || (t.modulations = []);
    const r = {
      type: "pitch",
      subtype: "bend",
      amount: e.amount,
      // in cents
      curve: e.curve || "linear",
      timing: e.returnToOriginal ? "note_duration" : "sustain",
      returnToOriginal: e.returnToOriginal ?? !0
    };
    return t.modulations = t.modulations.filter(
      (o) => !(o.type === "pitch" && o.subtype === "bend")
    ), t.modulations.push(r), n.success = !0, n.warnings.push("Added pitch bend modulation synchronized with articulation"), n;
  }
  /**
   * Apply vibrato articulation
   */
  static _applyVibrato(t, e, n) {
    t.articulation = "vibrato", t.modulations || (t.modulations = []);
    const r = {
      type: "pitch",
      subtype: "vibrato",
      rate: e.rate || 5,
      // Hz
      depth: e.depth || 50,
      // cents
      delay: e.delay || 0,
      // seconds
      timing: "note_duration"
    };
    return t.modulations = t.modulations.filter(
      (o) => !(o.type === "pitch" && o.subtype === "vibrato")
    ), t.modulations.push(r), n.success = !0, n.warnings.push("Added vibrato modulation synchronized with articulation"), n;
  }
  /**
   * Apply tremolo articulation
   */
  static _applyTremolo(t, e, n) {
    t.articulation = "tremolo", t.modulations || (t.modulations = []);
    const r = {
      type: "amplitude",
      subtype: "tremolo",
      rate: e.rate || 8,
      // Hz
      depth: e.depth || 0.3,
      // 0-1
      timing: "note_duration"
    };
    return t.modulations = t.modulations.filter(
      (o) => !(o.type === "amplitude" && o.subtype === "tremolo")
    ), t.modulations.push(r), n.success = !0, n.warnings.push("Added tremolo modulation synchronized with articulation"), n;
  }
  /**
   * Apply dynamic change (crescendo/diminuendo)
   */
  static _applyDynamicChange(t, e, n, r) {
    t.articulation = e, t.modulations || (t.modulations = []);
    const o = {
      type: "amplitude",
      subtype: e,
      startVelocity: t.velocity || 0.8,
      endVelocity: n.endVelocity,
      curve: n.curve || "linear",
      timing: "note_duration"
    };
    return t.modulations = t.modulations.filter(
      (i) => !(i.type === "amplitude" && (i.subtype === "crescendo" || i.subtype === "diminuendo"))
    ), t.modulations.push(o), r.success = !0, r.warnings.push(`Added ${e} modulation synchronized with articulation`), r;
  }
  /**
   * Remove articulation from a note
   */
  static removeArticulation(t, e) {
    if (!Array.isArray(t) || e < 0 || e >= t.length)
      return { success: !1, error: "Invalid sequence or note index" };
    const n = t[e];
    if (!n || typeof n != "object")
      return { success: !1, error: "Invalid note" };
    const r = n.articulation;
    if (delete n.articulation, delete n.glissTarget, n.modulations && r) {
      const o = zt[r];
      o && o.complex && (n.modulations = n.modulations.filter((i) => i.subtype !== r), n.modulations.length === 0 && delete n.modulations);
    }
    return {
      success: !0,
      removed: r,
      message: `Removed ${r} articulation and related modulations`
    };
  }
  /**
   * Validate articulation consistency in a sequence
   */
  static validateSequence(t) {
    const e = [];
    return t.forEach((n, r) => {
      if (n.articulation) {
        const o = this.ARTICULATION_TYPES[n.articulation];
        if (!o) {
          e.push({
            type: "unknown_articulation",
            noteIndex: r,
            articulation: n.articulation,
            message: `Unknown articulation type: ${n.articulation}`
          });
          return;
        }
        n.articulation === "glissando" && !n.glissTarget && e.push({
          type: "missing_parameter",
          noteIndex: r,
          articulation: n.articulation,
          message: "Glissando missing glissTarget parameter"
        }), o.complex && n.modulations && (n.modulations.some(
          (s) => s.subtype === n.articulation
        ) || e.push({
          type: "modulation_sync",
          noteIndex: r,
          articulation: n.articulation,
          message: `Complex articulation ${n.articulation} should have corresponding modulation`
        }));
      }
    }), {
      valid: e.length === 0,
      issues: e
    };
  }
  /**
   * Get available articulation types with descriptions
   */
  static getAvailableTypes() {
    return Object.entries(zt).map(([t, e]) => ({
      type: t,
      complex: e.complex,
      description: e.description,
      requiredParams: e.requiredParams || [],
      optionalParams: e.optionalParams || []
    }));
  }
}
function xe(c, t, e, n) {
  return _t.addArticulation(c, t, e, n);
}
function ve(c, t) {
  return _t.removeArticulation(c, t);
}
function sn(c) {
  return _t.validateSequence(c);
}
const an = xe, cn = ve, ln = {
  Scale: me,
  Progression: rn,
  Voice: on,
  Ornament: Jt,
  Articulation: _t,
  addArticulation: xe,
  addOrnament: an,
  // Include the alias
  removeArticulation: ve,
  removeOrnament: cn,
  // Include the alias
  validateArticulations: sn
};
class un {
  /**
   * Constructs all the necessary attributes for the Rhythm object
   * @param {number} measureLength - The length of the measure
   * @param {Array} durations - The durations of the notes
   */
  constructor(t, e) {
    this.measureLength = t, this.durations = e;
  }
  /**
   * Generate a random rhythm as a list of (duration, offset) tuples
   * @param {number} seed - Random seed for reproducibility
   * @param {number} restProbability - Probability of a rest (0-1)
   * @param {number} maxIter - Maximum number of iterations
   * @returns {Array} Array of [duration, offset] tuples representing the rhythm
   */
  random(t = null, e = 0, n = 100) {
    t !== null && (Math.seedrandom = t);
    const r = [];
    let o = 0, i = 0;
    for (; o < this.measureLength && i < n; ) {
      const s = this.durations[Math.floor(Math.random() * this.durations.length)];
      if (o + s > this.measureLength) {
        i++;
        continue;
      }
      if (Math.random() < e) {
        i++;
        continue;
      }
      r.push([s, o]), o += s, i++;
    }
    return i >= n && console.warn("Max iterations reached. The sum of the durations may not equal the measure length."), r;
  }
  /**
   * Executes the Darwinian evolution algorithm to generate the best rhythm
   * @param {number} seed - Random seed for reproducibility
   * @param {number} populationSize - Number of rhythms in each generation
   * @param {number} maxGenerations - Maximum number of generations
   * @param {number} mutationRate - Probability of mutation (0-1)
   * @returns {Array} The best rhythm found after evolution
   */
  darwin(t = null, e = 10, n = 50, r = 0.1) {
    return new hn(
      t,
      e,
      this.measureLength,
      n,
      r,
      this.durations
    ).generate();
  }
}
class hn {
  constructor(t, e, n, r, o, i) {
    t !== null && (Math.seedrandom = t), this.populationSize = e, this.measureLength = n, this.maxGenerations = r, this.mutationRate = o, this.durations = i, this.population = this.initializePopulation();
  }
  /**
   * Initialize a population of random rhythms
   */
  initializePopulation() {
    const t = [];
    for (let e = 0; e < this.populationSize; e++)
      t.push(this.createRandomRhythm());
    return t;
  }
  /**
   * Create a random rhythm ensuring it respects the measure length
   * @returns {Array} Array of [duration, offset] tuples
   */
  createRandomRhythm() {
    const t = [];
    let e = 0;
    for (; e < this.measureLength; ) {
      const n = this.measureLength - e, r = this.durations[Math.floor(Math.random() * this.durations.length)];
      if (r <= n)
        t.push([r, e]), e += r;
      else
        break;
    }
    return t;
  }
  /**
   * Evaluate the fitness of a rhythm
   * @param {Array} rhythm - The rhythm to evaluate
   * @returns {number} Fitness score (lower is better)
   */
  evaluateFitness(t) {
    const e = t.reduce((n, r) => n + r[0], 0);
    return Math.abs(this.measureLength - e);
  }
  /**
   * Select a parent using simple random selection with fitness bias
   * @returns {Array} Selected parent rhythm
   */
  selectParent() {
    const t = this.population[Math.floor(Math.random() * this.population.length)], e = this.population[Math.floor(Math.random() * this.population.length)];
    return this.evaluateFitness(t) < this.evaluateFitness(e) ? t : e;
  }
  /**
   * Perform crossover between two parents
   * @param {Array} parent1 - First parent rhythm
   * @param {Array} parent2 - Second parent rhythm
   * @returns {Array} Child rhythm
   */
  crossover(t, e) {
    if (t.length === 0 || e.length === 0)
      return t.length > 0 ? [...t] : [...e];
    const n = Math.floor(Math.random() * (t.length - 1)) + 1, r = [...t.slice(0, n), ...e.slice(n)];
    return this.ensureMeasureLength(r);
  }
  /**
   * Ensure rhythm respects measure length
   * @param {Array} rhythm - The rhythm to adjust
   * @returns {Array} Adjusted rhythm
   */
  ensureMeasureLength(t) {
    return t.reduce((n, r) => n + r[0], 0) > this.measureLength && t.length > 0 && t.pop(), t;
  }
  /**
   * Mutate a rhythm with certain probability
   * @param {Array} rhythm - The rhythm to mutate
   * @returns {Array} Mutated rhythm
   */
  mutate(t) {
    if (Math.random() < this.mutationRate && t.length > 1) {
      const e = Math.floor(Math.random() * (t.length - 1)), [n, r] = t[e], i = (e === t.length - 1 ? this.measureLength : t[e + 1][1]) - r, s = this.durations.filter((a) => a <= i);
      if (s.length > 0) {
        const a = s[Math.floor(Math.random() * s.length)];
        t[e] = [a, r];
      }
    }
    return t;
  }
  /**
   * Execute the genetic algorithm
   * @returns {Array} Best rhythm found, sorted by offset
   */
  generate() {
    for (let e = 0; e < this.maxGenerations; e++) {
      const n = [];
      for (let r = 0; r < this.populationSize; r++) {
        const o = this.selectParent(), i = this.selectParent();
        let s = this.crossover(o, i);
        s = this.mutate(s), s.sort((a, l) => a[1] - l[1]), n.push(s);
      }
      this.population = n;
    }
    return this.population.reduce(
      (e, n) => this.evaluateFitness(n) < this.evaluateFitness(e) ? n : e
    ).sort((e, n) => e[1] - n[1]);
  }
}
function wt(c, t = 4, e = 480) {
  const n = Math.floor(c / t), r = c - n * t, o = Math.floor(r), i = r - o, s = Math.round(i * e);
  return `${n}:${o}:${s}`;
}
function kt(c, t = 4, e = 480) {
  if (typeof c == "number") return c;
  if (typeof c != "string") return 0;
  const n = c.split(":").map((s) => parseFloat(s || "0")), [r = 0, o = 0, i = 0] = n;
  return r * t + o + i / e;
}
function Me(c, t = "Untitled Part", e = {}) {
  const n = Wt(c);
  return {
    name: t,
    notes: n,
    ...e
  };
}
function dn(c, t = {}) {
  const e = c.map((r, o) => Array.isArray(r) ? Me(r, `Track ${o + 1}`) : r.name && r.notes ? {
    ...r,
    notes: Wt(r.notes)
  } : r), n = {
    format: "jmon",
    version: "1.0",
    bpm: t.bpm || 120,
    keySignature: t.keySignature || "C",
    timeSignature: t.timeSignature || "4/4",
    tracks: e,
    ...t
  };
  return delete n.metadata?.bpm, delete n.metadata?.keySignature, delete n.metadata?.timeSignature, n;
}
function Wt(c) {
  return Array.isArray(c) ? c.map((t, e) => {
    if (Array.isArray(t)) {
      const [n, r, o = 0] = t;
      return {
        pitch: n,
        duration: r,
        time: wt(o)
      };
    }
    if (typeof t == "object" && t !== null) {
      const { pitch: n, duration: r } = t;
      let o = "0:0:0";
      return typeof t.time == "string" ? o = t.time : typeof t.time == "number" ? o = wt(t.time) : typeof t.offset == "number" && (o = wt(t.offset)), {
        pitch: n,
        duration: r,
        time: o,
        // Preserve other properties
        ...Object.fromEntries(
          Object.entries(t).filter(
            ([i]) => !["time", "offset"].includes(i)
          )
        )
      };
    }
    return console.warn(`Unexpected note format at index ${e}:`, t), {
      pitch: 60,
      // Default to middle C
      duration: 1,
      time: "0:0:0"
    };
  }) : [];
}
function mn(c) {
  return c.map(([t, e, n = 0]) => ({
    pitch: t,
    duration: e,
    time: wt(n)
  }));
}
function pn(c) {
  return c.map((t) => [
    t.pitch,
    t.duration,
    kt(t.time)
  ]);
}
function fn(c, t = 1, e = 0) {
  let n = e;
  return c.map((r) => {
    const o = {
      pitch: r,
      duration: t,
      time: wt(n)
    };
    return n += t, o;
  });
}
function Te(c, t) {
  return c.map((e) => ({
    ...e,
    time: wt(kt(e.time) + t)
  }));
}
function gn(c) {
  if (c.length === 0) return [];
  const t = [];
  let e = 0;
  for (const n of c) {
    const r = Te(n, e);
    t.push(...r);
    const o = r.map(
      (i) => kt(i.time) + i.duration
    );
    e = Math.max(...o, e);
  }
  return t;
}
function yn(c) {
  return c.flat();
}
function wn(c) {
  if (c.length === 0) return { start: 0, end: 0, duration: 0 };
  const t = c.map((o) => kt(o.time)), e = c.map((o) => kt(o.time) + o.duration), n = Math.min(...t), r = Math.max(...e);
  return {
    start: n,
    end: r,
    duration: r - n,
    startTime: wt(n),
    endTime: wt(r)
  };
}
const bn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  beatsToTime: wt,
  combineSequences: yn,
  concatenateSequences: gn,
  createComposition: dn,
  createPart: Me,
  createScale: fn,
  getTimingInfo: wn,
  jmonToTuples: pn,
  normalizeNotes: Wt,
  offsetNotes: Te,
  timeToBeats: kt,
  tuplesToJmon: mn
}, Symbol.toStringTag, { value: "Module" }));
function xn(c, t, e = {}) {
  const n = c.map((l) => Array.isArray(l) || typeof l == "object" && l.length ? l[0] : l), r = vn(n.length, t.length), o = [], i = [];
  for (let l = 0; l < r; l++)
    o.push(n[l % n.length]), i.push(t[l % t.length]);
  const s = o.map((l, u) => [l, i[u], 1]), a = ge(s);
  return e.legacy ? a : a.map(([l, u, d]) => ({
    pitch: l,
    duration: u,
    time: e.useStringTime ? wt(d) : d
  }));
}
function vn(c, t) {
  const e = (n, r) => r === 0 ? n : e(r, n % r);
  return Math.abs(c * t) / e(c, t);
}
function Mn(c, t) {
  const e = [];
  let n = 0, r = 0;
  for (const o of c) {
    const i = t[r % t.length];
    e.push([o, i, n]), n += i, r++;
  }
  return e;
}
const Tn = {
  Rhythm: un,
  isorhythm: xn,
  beatcycle: Mn
};
class kn {
  // Dummy implementation, replace with actual logic
  constructor() {
  }
}
class yt {
  data;
  // rows: number;
  // columns: number;
  constructor(t, e) {
    if (typeof t == "number") {
      if (e === void 0)
        throw new Error("Columns parameter required when creating matrix from dimensions");
      this.rows = t, this.columns = e, this.data = Array(this.rows).fill(0).map(() => Array(this.columns).fill(0));
    } else
      this.data = t.map((n) => [...n]), this.rows = this.data.length, this.columns = this.data[0]?.length || 0;
  }
  static zeros(t, e) {
    return new yt(t, e);
  }
  static from2DArray(t) {
    return new yt(t);
  }
  get(t, e) {
    if (t < 0 || t >= this.rows || e < 0 || e >= this.columns)
      throw new Error(`Index out of bounds: (${t}, ${e})`);
    return this.data[t][e];
  }
  set(t, e, n) {
    if (t < 0 || t >= this.rows || e < 0 || e >= this.columns)
      throw new Error(`Index out of bounds: (${t}, ${e})`);
    this.data[t][e] = n;
  }
  getRow(t) {
    if (t < 0 || t >= this.rows)
      throw new Error(`Row index out of bounds: ${t}`);
    return [...this.data[t]];
  }
  getColumn(t) {
    if (t < 0 || t >= this.columns)
      throw new Error(`Column index out of bounds: ${t}`);
    return this.data.map((e) => e[t]);
  }
  transpose() {
    const t = Array(this.columns).fill(0).map(() => Array(this.rows).fill(0));
    for (let e = 0; e < this.rows; e++)
      for (let n = 0; n < this.columns; n++)
        t[n][e] = this.data[e][n];
    return new yt(t);
  }
  clone() {
    return new yt(this.data);
  }
  toArray() {
    return this.data.map((t) => [...t]);
  }
}
function Bt(c) {
  return Array.isArray(c[0]) ? yt.from2DArray(c) : yt.from2DArray([c]);
}
function ke(c) {
  if (c.rows !== c.columns)
    throw new Error("Matrix must be square for Cholesky decomposition");
  const t = c.rows, e = yt.zeros(t, t);
  for (let n = 0; n < t; n++)
    for (let r = 0; r <= n; r++)
      if (n === r) {
        let o = 0;
        for (let s = 0; s < r; s++)
          o += e.get(r, s) * e.get(r, s);
        const i = c.get(r, r) - o;
        if (i <= 0)
          throw new Error(`Matrix is not positive definite at position (${r}, ${r})`);
        e.set(r, r, Math.sqrt(i));
      } else {
        let o = 0;
        for (let i = 0; i < r; i++)
          o += e.get(n, i) * e.get(r, i);
        e.set(n, r, (c.get(n, r) - o) / e.get(r, r));
      }
  return e;
}
class Sn {
  constructor(t = {}) {
    this.params = { ...t };
  }
  call(t, e) {
    const n = e || t, r = yt.zeros(t.rows, n.rows);
    for (let o = 0; o < t.rows; o++)
      for (let i = 0; i < n.rows; i++)
        r.set(o, i, this.compute(t.getRow(o), n.getRow(i)));
    return r;
  }
  // compute(x1, x2) { throw new Error('Not implemented'); }
  getParams() {
    return { ...this.params };
  }
  setParams(t) {
    Object.assign(this.params, t);
  }
  euclideanDistance(t, e) {
    let n = 0;
    for (let r = 0; r < t.length; r++)
      n += Math.pow(t[r] - e[r], 2);
    return Math.sqrt(n);
  }
  squaredEuclideanDistance(t, e) {
    let n = 0;
    for (let r = 0; r < t.length; r++)
      n += Math.pow(t[r] - e[r], 2);
    return n;
  }
}
class Se {
  kernel;
  alpha;
  XTrain;
  yTrain;
  L;
  alphaVector;
  constructor(t, e = {}) {
    this.kernel = t, this.alpha = e.alpha || 1e-10;
  }
  fit(t, e) {
    this.XTrain = Bt(t), this.yTrain = [...e];
    const n = this.kernel.call(this.XTrain);
    for (let r = 0; r < n.rows; r++)
      n.set(r, r, n.get(r, r) + this.alpha);
    try {
      this.L = ke(n);
    } catch (r) {
      throw new Error(`Failed to compute Cholesky decomposition: ${r instanceof Error ? r.message : "Unknown error"}`);
    }
    this.alphaVector = this.solveCholesky(this.L, this.yTrain);
  }
  predict(t, e = !1) {
    if (!this.XTrain || !this.yTrain || !this.L || !this.alphaVector)
      throw new Error("Model must be fitted before prediction");
    const n = Bt(t), r = this.kernel.call(this.XTrain, n), o = new Array(n.rows);
    for (let s = 0; s < n.rows; s++) {
      o[s] = 0;
      for (let a = 0; a < this.XTrain.rows; a++)
        o[s] += r.get(a, s) * this.alphaVector[a];
    }
    const i = { mean: o };
    if (e) {
      const s = this.computeStd(n, r);
      i.std = s;
    }
    return i;
  }
  sampleY(t, e = 1) {
    if (!this.XTrain || !this.yTrain || !this.L || !this.alphaVector)
      throw new Error("Model must be fitted before sampling");
    const n = Bt(t), r = this.predict(t, !0);
    if (!r.std)
      throw new Error("Standard deviation computation failed");
    const o = [];
    for (let i = 0; i < e; i++) {
      const s = new Array(n.rows);
      for (let a = 0; a < n.rows; a++) {
        const l = r.mean[a], u = r.std[a];
        s[a] = l + u * this.sampleStandardNormal();
      }
      o.push(s);
    }
    return o;
  }
  logMarginalLikelihood() {
    if (!this.XTrain || !this.yTrain || !this.L || !this.alphaVector)
      throw new Error("Model must be fitted before computing log marginal likelihood");
    let t = 0;
    for (let e = 0; e < this.yTrain.length; e++)
      t -= 0.5 * this.yTrain[e] * this.alphaVector[e];
    for (let e = 0; e < this.L.rows; e++)
      t -= Math.log(this.L.get(e, e));
    return t -= 0.5 * this.yTrain.length * Math.log(2 * Math.PI), t;
  }
  computeStd(t, e) {
    if (!this.L)
      throw new Error("Cholesky decomposition not available");
    const n = new Array(t.rows);
    for (let r = 0; r < t.rows; r++) {
      const o = this.kernel.compute(t.getRow(r), t.getRow(r)), i = e.getColumn(r), s = this.forwardSubstitution(this.L, i);
      let a = 0;
      for (let u = 0; u < s.length; u++)
        a += s[u] * s[u];
      const l = o - a;
      n[r] = Math.sqrt(Math.max(0, l));
    }
    return n;
  }
  solveCholesky(t, e) {
    const n = this.forwardSubstitution(t, e);
    return this.backSubstitution(t, n);
  }
  forwardSubstitution(t, e) {
    const n = t.rows, r = new Array(n);
    for (let o = 0; o < n; o++) {
      r[o] = e[o];
      for (let i = 0; i < o; i++)
        r[o] -= t.get(o, i) * r[i];
      r[o] /= t.get(o, o);
    }
    return r;
  }
  backSubstitution(t, e) {
    const n = t.rows, r = new Array(n);
    for (let o = n - 1; o >= 0; o--) {
      r[o] = e[o];
      for (let i = o + 1; i < n; i++)
        r[o] -= t.get(i, o) * r[i];
      r[o] /= t.get(o, o);
    }
    return r;
  }
  sampleStandardNormal() {
    const t = Math.random(), e = Math.random();
    return Math.sqrt(-2 * Math.log(t)) * Math.cos(2 * Math.PI * e);
  }
}
class he extends Sn {
  constructor(t = 1, e = 1) {
    super({ length_scale: t, variance: e }), this.lengthScale = t, this.variance = e;
  }
  compute(t, e) {
    const n = this.euclideanDistance(t, e);
    return this.variance * Math.exp(-0.5 * Math.pow(n / this.lengthScale, 2));
  }
  getParams() {
    return {
      length_scale: this.lengthScale,
      variance: this.variance
    };
  }
}
function An(c = 0, t = 1) {
  const e = Math.random(), n = Math.random(), r = Math.sqrt(-2 * Math.log(e)) * Math.cos(2 * Math.PI * n);
  return c + t * r;
}
function En(c, t) {
  const e = c.length, n = ke(t), r = Array.from({ length: e }, () => An()), o = new Array(e);
  for (let i = 0; i < e; i++) {
    o[i] = c[i];
    for (let s = 0; s <= i; s++)
      o[i] += n.get(i, s) * r[s];
  }
  return o;
}
const bt = {
  timeSignature: [4, 4],
  // 4/4 time
  ticksPerQuarterNote: 480,
  // Standard MIDI resolution
  beatsPerBar: 4
  // Derived from time signature
};
function At(c, t = bt) {
  const { timeSignature: e, ticksPerQuarterNote: n } = t, [r, o] = e, i = r * 4 / o, s = Math.floor(c / i), a = c % i, l = Math.floor(a), u = a - l, d = Math.round(u * n);
  return `${s}:${l}:${d}`;
}
function Ht(c, t = bt) {
  const { timeSignature: e, ticksPerQuarterNote: n } = t, [r, o] = e, i = c.split(":");
  if (i.length !== 3)
    throw new Error(`Invalid bars:beats:ticks format: ${c}`);
  const s = parseInt(i[0], 10), a = parseFloat(i[1]), l = parseInt(i[2], 10);
  if (isNaN(s) || isNaN(a) || isNaN(l))
    throw new Error(`Invalid numeric values in bars:beats:ticks: ${c}`);
  const u = r * 4 / o;
  return s * u + a + l / n;
}
function Pn(c, t = bt, e = !0) {
  return c.map((n) => {
    const r = { ...n };
    if (n.offset !== void 0 && (r.time = n.offset, delete r.offset), typeof n.time == "string" && n.time.includes(":") && (r.time = Ht(n.time, t)), typeof n.duration == "number" && !e) {
      const o = n.duration;
      o === 1 ? r.duration = "4n" : o === 0.5 ? r.duration = "8n" : o === 0.25 ? r.duration = "16n" : o === 2 ? r.duration = "2n" : o === 4 && (r.duration = "1n");
    }
    return r;
  });
}
function Nt(c, t = {}) {
  const {
    label: e = "track",
    midiChannel: n = 0,
    synth: r = { type: "Synth" },
    timingConfig: o = bt,
    keepNumericDuration: i = !0
    // Default to numeric for MIDI consistency
  } = t, s = Pn(c, o, i);
  return {
    label: e,
    midiChannel: n,
    synth: r,
    notes: s
  };
}
class Cn {
  data;
  lengthScale;
  amplitude;
  noiseLevel;
  walkAround;
  timingConfig;
  isFitted;
  gpr;
  constructor(t = [], e = 1, n = 1, r = 0.1, o = !1, i = bt) {
    this.data = [...t], this.lengthScale = e, this.amplitude = n, this.noiseLevel = r, this.walkAround = o, this.timingConfig = i, this.isFitted = !1, this.gpr = null;
  }
  generate(t = {}) {
    t.length, t.nsamples;
    const e = t.seed;
    return t.useStringTime, e !== void 0 && (Math.seedrandom = this.seededRandom(e)), this.data.length > 0 && Array.isArray(this.data[0]) ? this.generateFitted(t) : this.generateUnfitted(t);
  }
  /**
   * Generate from unfitted Gaussian Process
   */
  generateUnfitted(t = {}) {
    const e = t.length || 100, n = t.nsamples || 1, r = t.lengthScale || this.lengthScale, o = t.amplitude || this.amplitude, i = t.noiseLevel || this.noiseLevel;
    t.useStringTime;
    const s = [];
    for (let a = 0; a < n; a++) {
      const l = Array.from({ length: e }, (f, C) => [C]), u = new yt(l), m = new he(r, o).call(u);
      for (let f = 0; f < m.rows; f++)
        m.set(f, f, m.get(f, f) + i);
      let p = new Array(e).fill(this.walkAround || 0);
      this.walkAround && typeof this.walkAround == "number" && (p = new Array(e).fill(this.walkAround));
      const g = En(p, m);
      s.push(g);
    }
    return n === 1 ? s[0] : s;
  }
  /**
   * Generate from fitted Gaussian Process using training data
   */
  generateFitted(t = {}) {
    const e = t.length || 100, n = t.nsamples || 1, r = t.lengthScale || this.lengthScale, o = t.amplitude || this.amplitude, i = this.data.map((f) => [f[0]]), s = this.data.map((f) => f[1]), a = new he(r, o);
    this.gpr = new Se(a);
    try {
      this.gpr.fit(i, s), this.isFitted = !0;
    } catch (f) {
      throw new Error(`Failed to fit Gaussian Process: ${f.message}`);
    }
    const l = Math.min(...this.data.map((f) => f[0])), d = (Math.max(...this.data.map((f) => f[0])) - l) / (e - 1), m = Array.from({ length: e }, (f, C) => [l + C * d]), p = this.gpr.sampleY(m, n), g = m.map((f) => f[0]);
    return n === 1 ? [g, p[0]] : [g, p];
  }
  rbfKernel(t, e) {
    let n = 0;
    for (let r = 0; r < t.length; r++)
      n += Math.pow(t[r] - e[r], 2);
    return this.amplitude * Math.exp(-n / (2 * Math.pow(this.lengthScale, 2)));
  }
  setData(t) {
    this.data = [...t];
  }
  getData() {
    return [...this.data];
  }
  setLengthScale(t) {
    this.lengthScale = t;
  }
  setAmplitude(t) {
    this.amplitude = t;
  }
  setNoiseLevel(t) {
    this.noiseLevel = t;
  }
  /**
   * Convert GP samples to JMON notes
   * @param {Array|Array<Array>} samples - GP samples (single array or array of arrays)
   * @param {Array} durations - Duration sequence
   * @param {Array} timePoints - Time points (for fitted GP)
   * @param {Object} options - Conversion options
   * @returns {Array} JMON note objects
   */
  toJmonNotes(t, e = [1], n = null, r = {}) {
    const {
      useStringTime: o = !1,
      mapToScale: i = null,
      scaleRange: s = [60, 72],
      quantize: a = !1
    } = r, l = [];
    let u = 0;
    const d = Array.isArray(t[0]) ? t : [t], m = n || Array.from({ length: d[0].length }, (p, g) => g);
    for (let p = 0; p < d[0].length; p++) {
      const g = e[p % e.length], f = n ? m[p] : u, C = d.map((et) => {
        let O = et[p];
        if (i) {
          const J = Math.min(...et), S = Math.max(...et) - J || 1, j = (O - J) / S, I = Math.floor(j * i.length), F = Math.max(0, Math.min(I, i.length - 1));
          O = i[F];
        } else {
          const J = Math.min(...et), S = Math.max(...et) - J || 1, j = (O - J) / S;
          O = s[0] + j * (s[1] - s[0]);
        }
        return a && (O = Math.round(O)), O;
      }), it = C.length === 1 ? C[0] : C;
      l.push({
        pitch: it,
        duration: g,
        time: o ? At(f, this.timingConfig) : f
      }), n || (u += g);
    }
    return l;
  }
  /**
   * Generate JMON track directly from GP
   * @param {Object} options - Generation options
   * @param {Object} trackOptions - Track options
   * @returns {Object} JMON track
   */
  generateTrack(t = {}, e = {}) {
    const n = this.generate(t), r = t.durations || [1];
    let o;
    if (this.isFitted || this.data.length > 0 && Array.isArray(this.data[0])) {
      const [i, s] = n;
      o = this.toJmonNotes(s, r, i, t);
    } else
      o = this.toJmonNotes(n, r, null, t);
    return Nt(o, {
      label: "gaussian-process",
      midiChannel: 0,
      synth: { type: "Synth" },
      ...e
    });
  }
  /**
   * Simple seeded random number generator
   */
  seededRandom(t) {
    return function() {
      return t = (t * 9301 + 49297) % 233280, t / 233280;
    };
  }
}
class Nn {
  /**
   * @param {CellularAutomataOptions} [options={}] - Configuration options
   */
  constructor(t = {}) {
    this.width = t.width || 51, this.ruleNumber = t.ruleNumber || 30, this.initialState = t.initialState || this.generateRandomInitialState(), this.state = [...this.initialState], this.rules = this.loadRules(this.ruleNumber), this.history = [];
  }
  /**
   * Generate cellular automaton evolution
   * @param {number} steps - Number of evolution steps
   * @returns {Matrix2D} Evolution history
   */
  generate(t) {
    this.history = [], this.state = [...this.initialState], this.history.push([...this.state]);
    for (let e = 0; e < t; e++)
      this.updateState(), this.history.push([...this.state]);
    return this.history;
  }
  /**
   * Generate cellular automaton evolution with binary output
   * @param {number} steps - Number of evolution steps
   * @returns {Matrix2D} Binary evolution history
   */
  generate01(t) {
    return this.generate(t).map((n) => n.map((r) => r > 0 ? 1 : 0));
  }
  /**
   * Load rules based on rule number
   * @param {number} ruleNumber - Rule number (0-255)
   * @returns {CellularAutomataRule} Rule mapping
   */
  loadRules(t) {
    const e = t.toString(2).padStart(8, "0"), n = {}, r = ["111", "110", "101", "100", "011", "010", "001", "000"];
    for (let o = 0; o < 8; o++)
      n[r[o]] = parseInt(e[o], 10);
    return n;
  }
  /**
   * Update the current state based on rules
   */
  updateState() {
    const t = new Array(this.width);
    for (let e = 0; e < this.width; e++) {
      const n = this.state[(e - 1 + this.width) % this.width], r = this.state[e], o = this.state[(e + 1) % this.width], i = `${n}${r}${o}`;
      t[e] = this.rules[i] || 0;
    }
    this.state = t;
  }
  /**
   * Validate strips matrix format
   * @param {Matrix2D} strips - Matrix to validate
   * @returns {boolean} Whether the matrix is valid
   */
  validateStrips(t) {
    if (!Array.isArray(t) || t.length === 0)
      return !1;
    const e = t[0]?.length;
    return e ? t.every(
      (n) => Array.isArray(n) && n.length === e && n.every((r) => typeof r == "number" && (r === 0 || r === 1))
    ) : !1;
  }
  /**
   * Validate values array
   * @param {number[]} values - Values to validate
   * @returns {boolean} Whether the values are valid
   */
  validateValues(t) {
    return Array.isArray(t) && t.length === this.width && t.every((e) => typeof e == "number" && (e === 0 || e === 1));
  }
  /**
   * Set initial state
   * @param {number[]} state - New initial state
   */
  setInitialState(t) {
    if (this.validateValues(t))
      this.initialState = [...t], this.state = [...t];
    else
      throw new Error("Invalid initial state");
  }
  /**
   * Set rule number
   * @param {number} ruleNumber - New rule number (0-255)
   */
  setRuleNumber(t) {
    if (t >= 0 && t <= 255)
      this.ruleNumber = t, this.rules = this.loadRules(t);
    else
      throw new Error("Rule number must be between 0 and 255");
  }
  /**
   * Get evolution history
   * @returns {Matrix2D} Copy of evolution history
   */
  getHistory() {
    return this.history.map((t) => [...t]);
  }
  /**
   * Get current state
   * @returns {number[]} Copy of current state
   */
  getCurrentState() {
    return [...this.state];
  }
  /**
   * Generate random initial state with single center cell
   * @returns {number[]} Initial state array
   */
  generateRandomInitialState() {
    const t = new Array(this.width).fill(0);
    return t[Math.floor(this.width / 2)] = 1, t;
  }
  /**
   * Generate completely random state
   * @returns {number[]} Random state array
   */
  generateRandomState() {
    return Array.from({ length: this.width }, () => Math.random() > 0.5 ? 1 : 0);
  }
  /**
   * Get plot data
   * @returns {Object} Plot data with dimensions
   */
  plot() {
    return {
      data: this.getHistory(),
      width: this.width,
      height: this.history.length
    };
  }
  /**
   * Create Observable Plot visualization of CA evolution
   * @param {Object} [options] - Plot options
   * @returns {Object} Observable Plot spec
   */
  async plotEvolution(t) {
    return (await import("./CAVisualizer-CmIzAtiX.js")).CAVisualizer.plotEvolution(this.getHistory(), t);
  }
  /**
   * Create Observable Plot visualization of current generation
   * @param {Object} [options] - Plot options
   * @returns {Object} Observable Plot spec
   */
  async plotGeneration(t) {
    return (await import("./CAVisualizer-CmIzAtiX.js")).CAVisualizer.plotGeneration(this.getCurrentState(), t);
  }
  /**
   * Create Observable Plot density visualization
   * @param {Object} [options] - Plot options
   * @returns {Object} Observable Plot spec
   */
  async plotDensity(t) {
    return (await import("./CAVisualizer-CmIzAtiX.js")).CAVisualizer.plotDensity(this.getHistory(), t);
  }
}
class Ft {
  /**
   * Initializes a Loop object.
   * 
   * @param {Object|Array} loops - Dictionary or array of JMON tracks. Each track has notes: [{pitch, duration, time, velocity}, ...]
   * @param {number} measureLength - The length of a measure in beats. Defaults to 4.
   * @param {boolean} insertRests - Whether to insert rests. Defaults to true.
   */
  constructor(t, e = 4, n = !0) {
    if (!t)
      throw new Error("Loops parameter is required");
    if (typeof e != "number" || e <= 0)
      throw new Error("measureLength must be a positive number");
    if (typeof n != "boolean")
      throw new Error("insertRests must be a boolean");
    if (this.measureLength = e, Array.isArray(t)) {
      if (t.length === 0)
        throw new Error("Loops array cannot be empty");
      const r = {};
      t.forEach((o, i) => {
        const s = o?.label || `Loop ${i + 1}`;
        r[s] = o;
      }), t = r;
    }
    if (typeof t != "object" || Object.keys(t).length === 0)
      throw new Error("Loops must be a non-empty object or array");
    this.loops = {};
    for (const [r, o] of Object.entries(t)) {
      if (!o)
        throw new Error(`Loop data for "${r}" is null or undefined`);
      const i = Array.isArray(o) ? o : o.notes || [];
      if (!Array.isArray(i))
        throw new Error(`Notes for loop "${r}" must be an array`);
      const s = i.map((a, l) => {
        if (!a || typeof a != "object")
          throw new Error(`Note ${l} in loop "${r}" must be an object`);
        if (a.pitch !== null && (typeof a.pitch != "number" || a.pitch < 0 || a.pitch > 127))
          throw new Error(`Note ${l} in loop "${r}" has invalid pitch: ${a.pitch}`);
        if (typeof a.time != "number" || a.time < 0)
          throw new Error(`Note ${l} in loop "${r}" has invalid time: ${a.time}`);
        if (typeof a.duration != "number" || a.duration <= 0)
          throw new Error(`Note ${l} in loop "${r}" has invalid duration: ${a.duration}`);
        return {
          pitch: a.pitch,
          time: a.time,
          duration: a.duration,
          velocity: typeof a.velocity == "number" ? Math.max(0, Math.min(1, a.velocity)) : 0.8
        };
      });
      this.loops[r] = {
        label: o.label || r,
        notes: n ? this.fillGapsWithRests(s) : s,
        synth: o.synth || {
          type: "Synth",
          options: {
            oscillator: { type: "sine" },
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.5 }
          }
        }
      };
    }
  }
  /**
   * Fill gaps between notes with rests (JMON format)
   */
  fillGapsWithRests(t) {
    if (t.length === 0) return t;
    const e = [];
    let n = 0;
    const r = [...t].sort((o, i) => o.time - i.time);
    for (const o of r)
      o.time > n && e.push({
        pitch: null,
        // null indicates rest
        duration: o.time - n,
        time: n,
        velocity: 0
      }), e.push({
        pitch: o.pitch,
        duration: o.duration,
        time: o.time,
        velocity: o.velocity || 0.8
      }), n = o.time + o.duration;
    return e;
  }
  /**
   * Create a loop from a single JMON track
   */
  static fromTrack(t, e = 4) {
    if ((t.notes || []).length === 0)
      throw new Error("Track must have notes to create loop");
    return new Ft({ [t.label || "Track"]: t }, e);
  }
  /**
   * Create loop from Euclidean rhythm (JMON format)
   */
  static euclidean(t, e, n = [60], r = null) {
    if (typeof t != "number" || t <= 0 || !Number.isInteger(t))
      throw new Error("beats must be a positive integer");
    if (typeof e != "number" || e < 0 || !Number.isInteger(e))
      throw new Error("pulses must be a non-negative integer");
    if (e > t)
      throw new Error("pulses cannot be greater than beats");
    if (!Array.isArray(n) || n.length === 0)
      throw new Error("pitches must be a non-empty array");
    const o = this.generateEuclideanRhythm(t, e), i = [], s = 1;
    o.forEach((l, u) => {
      if (l) {
        const d = u * s, m = n[u % n.length];
        i.push({
          pitch: m,
          duration: s * 0.8,
          time: d,
          velocity: 0.8
        });
      }
    });
    const a = {
      label: r || `Euclidean ${e}/${t}`,
      notes: i,
      synth: {
        type: "Synth",
        options: {
          oscillator: { type: "sine" },
          envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.5 }
        }
      }
    };
    return new Ft({ [a.label]: a }, t);
  }
  /**
   * Generate Euclidean rhythm pattern using Bjorklund algorithm
   * This creates the most even distribution of pulses across beats
   */
  static generateEuclideanRhythm(t, e) {
    if (e === 0)
      return Array(t).fill(!1);
    if (e >= t)
      return Array(t).fill(!0);
    let n = [
      { pattern: [1], count: e },
      // Groups with pulses
      { pattern: [0], count: t - e }
      // Groups without pulses
    ];
    for (; n.length > 1; ) {
      const [i, s] = n;
      if (i.count <= s.count) {
        const a = i.count, l = s.count - i.count;
        n = [
          { pattern: [...s.pattern, ...i.pattern], count: a }
        ], l > 0 && n.push({ pattern: s.pattern, count: l });
      } else {
        const a = s.count, l = i.count - s.count;
        n = [
          { pattern: [...i.pattern, ...s.pattern], count: a }
        ], l > 0 && n.push({ pattern: i.pattern, count: l });
      }
    }
    const r = n[0], o = [];
    for (let i = 0; i < r.count; i++)
      o.push(...r.pattern);
    return o.map((i) => i === 1);
  }
  /**
   * Get loops as JMON tracks (already in JMON format)
   */
  toJMonSequences() {
    return Object.values(this.loops);
  }
  /**
   * Simple plotting method matching Python implementation
   */
  async plot(t = 1 / 4, e = null, n = {}) {
    const { LoopVisualizer: r } = await import("./LoopVisualizer-DS22P85c.js");
    return r.plotLoops(
      this.loops,
      this.measureLength,
      t,
      e,
      n
    );
  }
}
class Lt {
  /**
   * Create a musical index analyzer for a sequence
   * @param {Array} sequence - Array of musical values (pitches, durations, etc.)
   */
  constructor(t) {
    this.sequence = t.filter((e) => e != null), this.originalSequence = t;
  }
  /**
   * Calculate Gini coefficient (measure of inequality/diversity)
   * 0 = perfect equality, 1 = maximum inequality
   * @returns {number} Gini coefficient
   */
  gini() {
    if (this.sequence.length === 0) return 0;
    const t = [...this.sequence].sort((o, i) => o - i), e = t.length;
    let n = 0;
    for (let o = 0; o < e; o++)
      n += (2 * (o + 1) - e - 1) * t[o];
    const r = t.reduce((o, i) => o + i, 0);
    return r === 0 ? 0 : n / (e * r);
  }
  /**
   * Calculate balance (measure of how evenly distributed values are around the mean)
   * Lower values indicate better balance around the center
   * @returns {number} Balance metric
   */
  balance() {
    if (this.sequence.length === 0) return 0;
    const t = this.sequence.reduce((n, r) => n + r, 0) / this.sequence.length, e = this.sequence.reduce((n, r) => n + Math.pow(r - t, 2), 0) / this.sequence.length;
    return t === 0 ? 0 : Math.sqrt(e) / Math.abs(t);
  }
  /**
   * Calculate motif strength (measure of repetitive patterns)
   * Higher values indicate stronger motif presence
   * @param {number} maxMotifLength - Maximum motif length to consider
   * @returns {number} Motif strength
   */
  motif(t = 4) {
    if (this.sequence.length < 2) return 0;
    const e = /* @__PURE__ */ new Map();
    let n = 0;
    for (let o = 2; o <= Math.min(t, this.sequence.length); o++)
      for (let i = 0; i <= this.sequence.length - o; i++) {
        const s = this.sequence.slice(i, i + o).join(",");
        e.set(s, (e.get(s) || 0) + 1), n++;
      }
    let r = 0;
    for (const o of e.values())
      o > 1 && (r += o * o);
    return n === 0 ? 0 : r / n;
  }
  /**
   * Calculate dissonance relative to a musical scale
   * 0 = all notes in scale, higher values = more dissonance
   * @param {Array} scale - Array of pitches considered consonant
   * @returns {number} Dissonance level
   */
  dissonance(t) {
    if (!t || t.length === 0 || this.sequence.length === 0) return 0;
    const e = new Set(t.map((r) => r % 12));
    let n = 0;
    for (const r of this.sequence)
      if (r != null) {
        const o = r % 12;
        e.has(o) || n++;
      }
    return n / this.sequence.length;
  }
  /**
   * Calculate rhythmic fitness (how well durations fit within measure boundaries)
   * 1 = perfect fit, lower values = poor rhythmic alignment
   * @param {number} measureLength - Length of a measure in beats
   * @returns {number} Rhythmic fitness
   */
  rhythmic(t = 4) {
    if (this.sequence.length === 0) return 0;
    let e = 0, n = 0;
    const r = this.sequence.reduce(
      (o, i) => o + i,
      0
    );
    for (const o of this.sequence) {
      const i = e + o, s = Math.floor(e / t), a = Math.floor(i / t);
      if (s !== a) {
        const l = t - e % t;
        l < o && l > 0 && (n += Math.min(
          l,
          o - l
        ));
      }
      e = i;
    }
    return r === 0 ? 0 : 1 - n / r;
  }
  /**
   * Calculate proportion of rests in the sequence
   * @returns {number} Proportion of rests (0-1)
   */
  restProportion() {
    return this.originalSequence.length === 0 ? 0 : this.originalSequence.filter((e) => e == null).length / this.originalSequence.length;
  }
  /**
   * Calculate all metrics at once for efficiency
   * @param {Array} scale - Musical scale for dissonance calculation
   * @param {number} measureLength - Measure length for rhythmic analysis
   * @returns {Object} All calculated metrics
   */
  calculateAll(t = null, e = 4) {
    return {
      gini: this.gini(),
      balance: this.balance(),
      motif: this.motif(),
      dissonance: t ? this.dissonance(t) : 0,
      rhythmic: this.rhythmic(e),
      rest: this.restProportion()
    };
  }
  /**
   * Calculate statistical properties of the sequence
   * @returns {Object} Statistical properties
   */
  getStats() {
    if (this.sequence.length === 0)
      return { mean: 0, std: 0, min: 0, max: 0, range: 0 };
    const t = this.sequence.reduce((i, s) => i + s, 0) / this.sequence.length, e = this.sequence.reduce((i, s) => i + Math.pow(s - t, 2), 0) / this.sequence.length, n = Math.sqrt(e), r = Math.min(...this.sequence), o = Math.max(...this.sequence);
    return {
      mean: t,
      std: n,
      min: r,
      max: o,
      range: o - r
    };
  }
  /**
   * Compare two sequences and return similarity score
   * @param {MusicalIndex} other - Another MusicalIndex to compare with
   * @param {Array} scale - Scale for dissonance comparison
   * @param {number} measureLength - Measure length for rhythmic comparison
   * @returns {number} Similarity score (0-1, higher is more similar)
   */
  similarity(t, e = null, n = 4) {
    const r = this.calculateAll(e, n), o = t.calculateAll(e, n);
    let i = 0, s = 0;
    for (const [a, l] of Object.entries(r)) {
      const u = o[a];
      if (typeof l == "number" && typeof u == "number") {
        const d = Math.max(Math.abs(l), Math.abs(u), 1), m = 1 - Math.abs(l - u) / d;
        i += m, s++;
      }
    }
    return s === 0 ? 0 : i / s;
  }
}
class Rn {
  /**
   * Initialize the Darwin genetic algorithm
   * @param {Object} config - Configuration object
   */
  constructor(t = {}) {
    const {
      initialPhrases: e = [],
      mutationRate: n = 0.05,
      populationSize: r = 50,
      mutationProbabilities: o = null,
      scale: i = null,
      measureLength: s = 4,
      timeResolution: a = [0.125, 4],
      weights: l = null,
      targets: u = null,
      seed: d = null
    } = t;
    this.initialPhrases = e, this.mutationRate = n, this.populationSize = r, this.scale = i, this.measureLength = s, this.timeResolution = a, d !== null ? (this.seed = d, this.randomState = this.createSeededRandom(d)) : this.randomState = Math;
    const m = [0.125, 0.25, 0.5, 1, 2, 3, 4, 8];
    this.possibleDurations = m.filter(
      (p) => p >= a[0] && p <= Math.min(a[1], s)
    ), this.mutationProbabilities = o || {
      pitch: () => Math.max(0, Math.min(127, Math.floor(this.gaussianRandom(60, 5)))),
      duration: () => {
        const p = this.possibleDurations.map((g, f) => Math.pow(2, -f));
        return this.weightedChoice(this.possibleDurations, p);
      },
      rest: () => this.randomState.random() < 0.02 ? null : 1
    }, this.weights = l || {
      gini: [1, 1, 0],
      // [pitch, duration, offset]
      balance: [1, 1, 0],
      motif: [10, 1, 0],
      dissonance: [1, 0, 0],
      rhythmic: [0, 10, 0],
      rest: [1, 0, 0]
    }, this.targets = u || {
      gini: [0.05, 0.5, 0],
      balance: [0.1, 0.1, 0],
      motif: [1, 1, 0],
      dissonance: [0, 0, 0],
      rhythmic: [0, 1, 0],
      rest: [0, 0, 0]
    }, this.population = this.initializePopulation(), this.bestIndividuals = [], this.bestScores = [], this.generationCount = 0;
  }
  /**
   * Create a seeded random number generator
   * @param {number} seed - Random seed
   * @returns {Object} Random number generator with seeded methods
   */
  createSeededRandom(t) {
    let e = t;
    const n = () => (e = (e * 9301 + 49297) % 233280, e / 233280);
    return {
      random: n,
      choice: (r) => r[Math.floor(n() * r.length)],
      sample: (r, o) => [...r].sort(() => n() - 0.5).slice(0, o)
    };
  }
  /**
   * Generate Gaussian random number using Box-Muller transform
   * @param {number} mean - Mean of distribution
   * @param {number} stdDev - Standard deviation
   * @returns {number} Gaussian random number
   */
  gaussianRandom(t = 0, e = 1) {
    if (this.gaussianSpare !== void 0) {
      const i = this.gaussianSpare;
      return this.gaussianSpare = void 0, t + e * i;
    }
    const n = this.randomState.random(), r = this.randomState.random(), o = e * Math.sqrt(-2 * Math.log(n));
    return this.gaussianSpare = o * Math.cos(2 * Math.PI * r), t + o * Math.sin(2 * Math.PI * r);
  }
  /**
   * Choose random element from array with weights
   * @param {Array} choices - Array of choices
   * @param {Array} weights - Array of weights
   * @returns {*} Weighted random choice
   */
  weightedChoice(t, e) {
    const n = e.reduce((o, i) => o + i, 0);
    let r = this.randomState.random() * n;
    for (let o = 0; o < t.length; o++)
      if (r -= e[o], r <= 0)
        return t[o];
    return t[t.length - 1];
  }
  /**
   * Initialize population by mutating initial phrases
   * @returns {Array} Initial population
   */
  initializePopulation() {
    const t = [], e = Math.floor(this.populationSize / this.initialPhrases.length);
    for (const n of this.initialPhrases)
      for (let r = 0; r < e; r++)
        t.push(this.mutate(n, 0));
    for (; t.length < this.populationSize; ) {
      const n = this.randomState.choice(this.initialPhrases);
      t.push(this.mutate(n, 0));
    }
    return t;
  }
  /**
   * Calculate fitness components for a musical phrase
   * @param {Array} phrase - Musical phrase as [pitch, duration, offset] tuples
   * @returns {Object} Fitness components
   */
  calculateFitnessComponents(t) {
    if (t.length === 0) return {};
    const e = t.map((s) => s[0]), n = t.map((s) => s[1]), r = t.map((s) => s[2]), o = {};
    if (e.length > 0) {
      const s = new Lt(e);
      o.gini_pitch = s.gini(), o.balance_pitch = s.balance(), o.motif_pitch = s.motif(), this.scale && (o.dissonance_pitch = s.dissonance(this.scale));
    }
    if (n.length > 0) {
      const s = new Lt(n);
      o.gini_duration = s.gini(), o.balance_duration = s.balance(), o.motif_duration = s.motif(), o.rhythmic = s.rhythmic(this.measureLength);
    }
    if (r.length > 0) {
      const s = new Lt(r);
      o.gini_offset = s.gini(), o.balance_offset = s.balance(), o.motif_offset = s.motif();
    }
    const i = e.filter((s) => s == null).length / e.length;
    return o.rest = i, o;
  }
  /**
   * Calculate fitness score for a musical phrase
   * @param {Array} phrase - Musical phrase
   * @returns {number} Fitness score
   */
  fitness(t) {
    const e = this.calculateFitnessComponents(t);
    let n = 0;
    for (const [r, o] of Object.entries(this.targets)) {
      const i = this.weights[r];
      for (let s = 0; s < 3; s++) {
        const a = s === 0 ? `${r}_pitch` : s === 1 ? `${r}_duration` : `${r}_offset`, l = e[a] || 0, u = o[s], d = i[s];
        if (d > 0 && u !== void 0) {
          const m = Math.max(Math.abs(u), 1), p = 1 - Math.abs(l - u) / m;
          n += Math.max(0, p) * d;
        }
      }
    }
    if (this.weights.rest[0] > 0) {
      const r = e.rest || 0, o = this.targets.rest[0], i = 1 - Math.abs(r - o) / Math.max(o, 1);
      n += Math.max(0, i) * this.weights.rest[0];
    }
    return n;
  }
  /**
   * Mutate a musical phrase
   * @param {Array} phrase - Original phrase
   * @param {number} rate - Mutation rate (null to use default)
   * @returns {Array} Mutated phrase
   */
  mutate(t, e = null) {
    e === null && (e = this.mutationRate);
    const n = [];
    let r = 0;
    for (const o of t) {
      let [i, s, a] = o;
      this.randomState.random() < e && (i = this.mutationProbabilities.pitch()), this.randomState.random() < e && (s = this.mutationProbabilities.duration()), this.randomState.random() < e && this.mutationProbabilities.rest() === null && (i = null);
      const l = r;
      r += s, n.push([i, s, l]);
    }
    return n;
  }
  /**
   * Select top performers from population
   * @param {number} k - Number of individuals to select
   * @returns {Array} Selected phrases
   */
  select(t = 25) {
    const e = this.population.map((n) => ({
      phrase: n,
      fitness: this.fitness(n)
    }));
    return e.sort((n, r) => r.fitness - n.fitness), e.slice(0, t).map((n) => n.phrase);
  }
  /**
   * Crossover (breed) two parent phrases
   * @param {Array} parent1 - First parent phrase
   * @param {Array} parent2 - Second parent phrase
   * @returns {Array} Child phrase
   */
  crossover(t, e) {
    if (t.length === 0 || e.length === 0)
      return t.length > 0 ? [...t] : [...e];
    const n = Math.min(t.length, e.length), r = Math.floor(this.randomState.random() * n), o = Math.floor(this.randomState.random() * n), [i, s] = [Math.min(r, o), Math.max(r, o)], a = [];
    for (let u = 0; u < i; u++)
      u < t.length && a.push([...t[u]]);
    for (let u = i; u < s; u++)
      u < e.length && a.push([...e[u]]);
    for (let u = s; u < Math.max(t.length, e.length); u++)
      u < t.length ? a.push([...t[u]]) : u < e.length && a.push([...e[u]]);
    let l = 0;
    for (let u = 0; u < a.length; u++)
      a[u][2] = l, l += a[u][1];
    return a;
  }
  /**
   * Evolve the population for one generation
   * @param {number} k - Number of parents to select
   * @param {number} restRate - Rate for introducing rests (unused, kept for compatibility)
   * @returns {Object} Evolution statistics
   */
  evolve(t = 25) {
    const e = this.select(t), n = this.fitness(e[0]);
    this.bestIndividuals.push([...e[0]]), this.bestScores.push(n);
    const r = [];
    for (; r.length < this.populationSize; ) {
      const o = this.randomState.choice(e), i = this.randomState.choice(e), s = this.crossover([...o], [...i]), a = this.mutate(s);
      r.push(a);
    }
    return this.population = r, this.generationCount++, {
      generation: this.generationCount,
      bestFitness: n,
      averageFitness: e.reduce((o, i) => o + this.fitness(i), 0) / e.length,
      populationSize: this.populationSize
    };
  }
  /**
   * Evolve for multiple generations
   * @param {number} generations - Number of generations to evolve
   * @param {number} k - Number of parents per generation
   * @param {Function} callback - Optional callback for progress updates
   * @returns {Array} Array of evolution statistics
   */
  evolveGenerations(t, e = 25, n = null) {
    const r = [];
    for (let o = 0; o < t; o++) {
      const i = this.evolve(e);
      r.push(i), n && n(i, o, t);
    }
    return r;
  }
  /**
   * Get the current best individual
   * @returns {Array} Best musical phrase
   */
  getBestIndividual() {
    return this.bestIndividuals.length > 0 ? [...this.bestIndividuals[this.bestIndividuals.length - 1]] : null;
  }
  /**
   * Get evolution history
   * @returns {Object} Evolution history with individuals and scores
   */
  getEvolutionHistory() {
    return {
      individuals: this.bestIndividuals.map((t) => [...t]),
      scores: [...this.bestScores],
      generations: this.generationCount
    };
  }
  /**
   * Reset the evolution state
   */
  reset() {
    this.population = this.initializePopulation(), this.bestIndividuals = [], this.bestScores = [], this.generationCount = 0;
  }
  /**
   * Get population statistics
   * @returns {Object} Population statistics
   */
  getPopulationStats() {
    const t = this.population.map((r) => this.fitness(r)), e = t.reduce((r, o) => r + o, 0) / t.length, n = t.reduce((r, o) => r + Math.pow(o - e, 2), 0) / t.length;
    return {
      populationSize: this.population.length,
      meanFitness: e,
      standardDeviation: Math.sqrt(n),
      minFitness: Math.min(...t),
      maxFitness: Math.max(...t),
      generation: this.generationCount
    };
  }
}
class jn {
  options;
  walkers;
  history;
  constructor(t = {}) {
    this.options = {
      length: t.length || 100,
      dimensions: t.dimensions || 1,
      stepSize: t.stepSize || 1,
      bounds: t.bounds || [-100, 100],
      branchProbability: t.branchProbability || 0.05,
      mergeProbability: t.mergeProbability || 0.02,
      attractorStrength: t.attractorStrength || 0,
      attractorPosition: t.attractorPosition || Array(t.dimensions || 1).fill(0)
    }, this.walkers = [], this.history = [];
  }
  /**
   * Generate random walk sequence
   */
  generate(t) {
    this.initialize(t), this.history = [];
    for (let e = 0; e < this.options.length; e++)
      this.updateWalkers(), this.recordState(), this.handleBranching(), this.handleMerging();
    return this.history;
  }
  /**
   * Initialize walker(s)
   */
  initialize(t) {
    const e = t || Array(this.options.dimensions).fill(0);
    this.walkers = [{
      position: [...e],
      velocity: Array(this.options.dimensions).fill(0),
      branches: [],
      age: 0,
      active: !0
    }];
  }
  /**
   * Update all active walkers
   */
  updateWalkers() {
    for (const t of this.walkers)
      if (t.active) {
        for (let e = 0; e < this.options.dimensions; e++) {
          const n = (Math.random() - 0.5) * 2 * this.options.stepSize;
          let r = 0;
          if (this.options.attractorStrength > 0) {
            const o = t.position[e] - this.options.attractorPosition[e];
            r = -this.options.attractorStrength * o;
          }
          t.velocity[e] = t.velocity[e] * 0.9 + n + r, t.position[e] += t.velocity[e], t.position[e] < this.options.bounds[0] ? (t.position[e] = this.options.bounds[0], t.velocity[e] *= -0.5) : t.position[e] > this.options.bounds[1] && (t.position[e] = this.options.bounds[1], t.velocity[e] *= -0.5);
        }
        t.age++;
      }
  }
  /**
   * Record current state of all walkers
   */
  recordState() {
    const t = this.walkers.filter((e) => e.active);
    if (t.length > 0) {
      const e = Array(this.options.dimensions).fill(0);
      for (const n of t)
        for (let r = 0; r < this.options.dimensions; r++)
          e[r] += n.position[r];
      for (let n = 0; n < this.options.dimensions; n++)
        e[n] /= t.length;
      this.history.push([...e]);
    }
  }
  /**
   * Handle branching (walker splitting)
   */
  handleBranching() {
    const t = [];
    for (const e of this.walkers)
      if (e.active && Math.random() < this.options.branchProbability) {
        const n = {
          position: [...e.position],
          velocity: e.velocity.map((r) => r + (Math.random() - 0.5) * this.options.stepSize),
          branches: [],
          age: 0,
          active: !0
        };
        t.push(n), e.branches.push(n);
      }
    this.walkers.push(...t);
  }
  /**
   * Handle merging (walker combining)
   */
  handleMerging() {
    if (this.walkers.length <= 1) return;
    const t = this.walkers.filter((n) => n.active), e = this.options.stepSize * 2;
    for (let n = 0; n < t.length; n++)
      for (let r = n + 1; r < t.length; r++)
        if (Math.random() < this.options.mergeProbability && this.calculateDistance(t[n].position, t[r].position) < e) {
          for (let i = 0; i < this.options.dimensions; i++)
            t[n].position[i] = (t[n].position[i] + t[r].position[i]) / 2, t[n].velocity[i] = (t[n].velocity[i] + t[r].velocity[i]) / 2;
          t[r].active = !1;
        }
    this.walkers = this.walkers.filter((n) => n.active);
  }
  /**
   * Calculate Euclidean distance between two positions
   */
  calculateDistance(t, e) {
    let n = 0;
    for (let r = 0; r < t.length; r++)
      n += Math.pow(t[r] - e[r], 2);
    return Math.sqrt(n);
  }
  /**
   * Get 1D projection of multi-dimensional walk
   */
  getProjection(t = 0) {
    return this.history.map((e) => e[t] || 0);
  }
  /**
   * Map walk to musical scale
   */
  mapToScale(t = 0, e = [0, 2, 4, 5, 7, 9, 11], n = 3) {
    const r = this.getProjection(t);
    if (r.length === 0) return [];
    const o = Math.min(...r), s = Math.max(...r) - o || 1;
    return r.map((a) => {
      const l = (a - o) / s, u = Math.floor(l * e.length * n), d = Math.floor(u / e.length), m = u % e.length;
      return 60 + d * 12 + e[m];
    });
  }
  /**
   * Map walk to rhythmic durations
   */
  mapToRhythm(t = 0, e = [0.25, 0.5, 1, 2]) {
    const n = this.getProjection(t);
    if (n.length === 0) return [];
    const r = Math.min(...n), i = Math.max(...n) - r || 1;
    return n.map((s) => {
      const a = (s - r) / i, l = Math.floor(a * e.length), u = Math.max(0, Math.min(l, e.length - 1));
      return e[u];
    });
  }
  /**
   * Map walk to velocities
   */
  mapToVelocity(t = 0, e = 0.3, n = 1) {
    const r = this.getProjection(t);
    if (r.length === 0) return [];
    const o = Math.min(...r), s = Math.max(...r) - o || 1;
    return r.map((a) => {
      const l = (a - o) / s;
      return e + l * (n - e);
    });
  }
  /**
   * Generate correlated walk (walk that follows another walk with some correlation)
   */
  generateCorrelated(t, e = 0.5, n = 0) {
    if (t.length === 0) return [];
    const r = [];
    let o = 0;
    for (let i = 0; i < t.length; i++) {
      const s = (Math.random() - 0.5) * 2 * this.options.stepSize, a = e * (t[i] - o);
      o += s + a, o = Math.max(this.options.bounds[0], Math.min(this.options.bounds[1], o)), r.push(o);
    }
    return r;
  }
  /**
   * Analyze walk properties
   */
  analyze() {
    if (this.history.length < 2)
      return {
        meanDisplacement: 0,
        meanSquaredDisplacement: 0,
        totalDistance: 0,
        fractalDimension: 0
      };
    const t = this.getProjection(0), e = t[0], n = t[t.length - 1], r = Math.abs(n - e), o = t.map((l) => Math.pow(l - e, 2)), i = o.reduce((l, u) => l + u, 0) / o.length;
    let s = 0;
    for (let l = 1; l < t.length; l++)
      s += Math.abs(t[l] - t[l - 1]);
    const a = s > 0 ? Math.log(s) / Math.log(t.length) : 0;
    return {
      meanDisplacement: r,
      meanSquaredDisplacement: i,
      totalDistance: s,
      fractalDimension: a
    };
  }
  /**
   * Get current walker states
   */
  getWalkerStates() {
    return this.walkers.map((t) => ({ ...t }));
  }
  /**
   * Reset the walk generator
   */
  reset() {
    this.walkers = [], this.history = [];
  }
  /**
   * Convert walk to JMON notes
   * @param {Array} durations - Duration sequence
   * @param {Object} options - Conversion options
   * @returns {Array} JMON note objects
   */
  toJmonNotes(t = [1], e = {}) {
    const {
      useStringTime: n = !1,
      timingConfig: r = bt,
      dimension: o = 0,
      mapToScale: i = null,
      scaleRange: s = [60, 72]
    } = e, a = this.getProjection(o), l = [];
    let u = 0;
    for (let d = 0; d < a.length; d++) {
      const m = t[d % t.length];
      let p = a[d];
      if (i) {
        const g = Math.min(...a), C = Math.max(...a) - g || 1, it = (p - g) / C, et = Math.floor(it * i.length), O = Math.max(0, Math.min(et, i.length - 1));
        p = i[O];
      } else
        p = this.mapToScale([a], i || [60, 62, 64, 65, 67, 69, 71])[0][d];
      l.push({
        pitch: p,
        duration: m,
        time: n ? At(u, r) : u
      }), u += m;
    }
    return l;
  }
  /**
   * Generate JMON track directly from walk
   * @param {Array} startPosition - Starting position
   * @param {Array} durations - Duration sequence
   * @param {Object} options - Generation and conversion options
   * @param {Object} trackOptions - Track options
   * @returns {Object} JMON track
   */
  generateTrack(t, e = [1], n = {}, r = {}) {
    this.generate(t);
    const o = this.toJmonNotes(e, n);
    return Nt(o, {
      label: "random-walk",
      midiChannel: 0,
      synth: { type: "Synth" },
      ...r
    });
  }
}
class $n {
  walkRange;
  walkStart;
  walkProbability;
  roundTo;
  branchingProbability;
  mergingProbability;
  timingConfig;
  constructor(t = {}) {
    this.walkRange = t.walkRange || null, this.walkStart = t.walkStart !== void 0 ? t.walkStart : this.walkRange ? Math.floor((this.walkRange[1] - this.walkRange[0]) / 2) + this.walkRange[0] : 0, this.walkProbability = t.walkProbability || [-1, 0, 1], this.roundTo = t.roundTo !== void 0 ? t.roundTo : null, this.branchingProbability = t.branchingProbability || 0, this.mergingProbability = t.mergingProbability || 0, this.timingConfig = t.timingConfig || bt;
  }
  /**
   * Generate random walk sequence(s) with branching and merging
   * @param {number} length - Length of the walk
   * @param {number} seed - Random seed for reproducibility
   * @returns {Array<Array>} Array of walk sequences (branches)
   */
  generate(t, e) {
    let n = Math.random;
    e !== void 0 && (n = this.createSeededRandom(e));
    const r = [this.initializeWalk(t)];
    let o = [this.walkStart];
    for (let i = 1; i < t; i++) {
      const s = [...o], a = [];
      for (let l = 0; l < o.length; l++) {
        const u = r[l], d = o[l];
        if (d === null) {
          u && (u[i] = null);
          continue;
        }
        const m = this.generateStep(n);
        let p = d + m;
        if (isNaN(p) && (p = d), this.walkRange !== null && (p < this.walkRange[0] ? p = this.walkRange[0] : p > this.walkRange[1] && (p = this.walkRange[1])), isNaN(p) && (p = this.walkStart), u && (u[i] = p), s[l] = p, n() < this.branchingProbability) {
          const g = this.createBranch(r[l], i), f = this.generateStep(n);
          let C = d + f;
          isNaN(C) && (C = d), this.walkRange !== null && (C < this.walkRange[0] ? C = this.walkRange[0] : C > this.walkRange[1] && (C = this.walkRange[1])), isNaN(C) && (C = this.walkStart), g[i] = C, a.push(g), s.push(C);
        }
      }
      r.push(...a), o = s, o = this.handleMerging(r, o, i, n);
    }
    return r;
  }
  /**
   * Generate a single step according to the probability distribution
   */
  generateStep(t = Math.random) {
    if (Array.isArray(this.walkProbability))
      return this.walkProbability[Math.floor(t() * this.walkProbability.length)];
    if (typeof this.walkProbability == "object" && this.walkProbability.mean !== void 0 && this.walkProbability.std !== void 0) {
      let e = this.generateNormal(this.walkProbability.mean, this.walkProbability.std, t);
      return this.roundTo !== null && (e = parseFloat(e.toFixed(this.roundTo))), e;
    }
    return [-1, 0, 1][Math.floor(t() * 3)];
  }
  /**
   * Generate a sample from normal distribution
   */
  generateNormal(t, e, n = Math.random) {
    let r, o;
    do
      r = n();
    while (r === 0);
    o = n();
    const i = Math.sqrt(-2 * Math.log(r)) * Math.cos(2 * Math.PI * o), s = t + e * i;
    return isNaN(s) ? t : s;
  }
  /**
   * Initialize a new walk with null values
   */
  initializeWalk(t) {
    const e = new Array(t);
    e[0] = this.walkStart;
    for (let n = 1; n < t; n++)
      e[n] = null;
    return e;
  }
  /**
   * Create a branch from an existing walk
   */
  createBranch(t, e) {
    const n = new Array(t.length);
    for (let r = 0; r < e; r++)
      n[r] = null;
    for (let r = e; r < n.length; r++)
      n[r] = null;
    return n;
  }
  /**
   * Handle merging of walks that collide
   */
  handleMerging(t, e, n, r = Math.random) {
    const o = [...e];
    for (let i = 0; i < e.length; i++)
      if (e[i] !== null)
        for (let s = i + 1; s < e.length; s++) {
          if (e[s] === null) continue;
          const a = this.roundTo !== null ? this.roundTo : 1e-3;
          if (Math.abs(e[i] - e[s]) <= a && r() < this.mergingProbability && (o[s] = null, t[s]))
            for (let l = n; l < t[s].length; l++)
              t[s][l] = null;
        }
    return o;
  }
  /**
   * Convert walk sequences to JMON notes
   * @param {Array<Array>} walks - Walk sequences
   * @param {Array} durations - Duration sequence to map to
   * @param {Object} options - Conversion options
   * @returns {Array} JMON note objects
   */
  toJmonNotes(t, e = [1], n = {}) {
    const r = n.useStringTime || !1, o = [];
    let i = 0, s = 0;
    const a = Math.max(...t.map((l) => l.length));
    for (let l = 0; l < a; l++) {
      const u = t.map((d) => d[l]).filter((d) => d !== null);
      if (u.length > 0) {
        const d = e[s % e.length], m = u.length === 1 ? u[0] : u;
        o.push({
          pitch: m,
          duration: d,
          time: r ? At(i, this.timingConfig) : i
        }), i += d, s++;
      }
    }
    return o;
  }
  /**
   * Generate a JMON track directly from walk
   * @param {number} length - Walk length
   * @param {Array} durations - Duration sequence
   * @param {Object} trackOptions - Track options
   * @returns {Object} JMON track
   */
  generateTrack(t, e = [1], n = {}) {
    const r = this.generate(t, n.seed), o = this.toJmonNotes(r, e, n);
    return Nt(o, {
      label: "random-walk",
      midiChannel: 0,
      synth: { type: "Synth" },
      ...n
    });
  }
  /**
   * Map walk values to a musical scale
   * @param {Array<Array>} walks - Walk sequences  
   * @param {Array} scale - Scale to map to
   * @returns {Array<Array>} Walks mapped to scale
   */
  mapToScale(t, e = [60, 62, 64, 65, 67, 69, 71]) {
    return t.map((n) => n.map((r) => {
      if (r === null) return null;
      const o = this.walkRange[0], s = this.walkRange[1] - o, a = (r - o) / s, l = Math.floor(a * e.length), u = Math.max(0, Math.min(l, e.length - 1));
      return e[u];
    }));
  }
  /**
   * Create a seeded random number generator
   */
  createSeededRandom(t) {
    let e = Math.abs(t) || 1;
    return function() {
      e = (e * 9301 + 49297) % 233280;
      const n = e / 233280;
      return Math.max(1e-7, Math.min(0.9999999, n));
    };
  }
}
class Tt {
  distance;
  frequency;
  phase;
  subPhasors;
  center;
  constructor(t = 1, e = 1, n = 0, r = []) {
    this.distance = t, this.frequency = e, this.phase = n, this.subPhasors = r || [], this.center = { x: 0, y: 0 };
  }
  /**
   * Add a sub-phasor to this phasor (like epicycles)
   */
  addSubPhasor(t) {
    this.subPhasors.push(t);
  }
  /**
   * Calculate position at given time
   */
  getPosition(t) {
    const e = this.frequency * t + this.phase, n = this.center.x + this.distance * Math.cos(e), r = this.center.y + this.distance * Math.sin(e);
    return { x: n, y: r, angle: e, distance: this.distance };
  }
  /**
   * Calculate distance from origin
   */
  getDistanceFromOrigin(t) {
    const e = this.getPosition(t);
    return Math.sqrt(e.x * e.x + e.y * e.y);
  }
  /**
   * Calculate angle from origin in degrees
   */
  getAngleFromOrigin(t) {
    const e = this.getPosition(t);
    let n = Math.atan2(e.y, e.x) * 180 / Math.PI;
    return n < 0 && (n += 360), n;
  }
  /**
   * Simulate this phasor and all its sub-phasors
   */
  simulate(t, e = { x: 0, y: 0 }) {
    this.center = e;
    const n = [];
    for (const r of t) {
      const o = this.getPosition(r), i = this.getDistanceFromOrigin(r), s = this.getAngleFromOrigin(r);
      n.push({
        time: r,
        position: o,
        distance: i,
        angle: s,
        phasor: this
      });
      for (const a of this.subPhasors) {
        a.center = o;
        const l = a.simulate([r], o);
        n.push(...l);
      }
    }
    return n;
  }
}
class Kt {
  phasors;
  timingConfig;
  constructor(t = bt) {
    this.phasors = [], this.timingConfig = t;
  }
  /**
   * Add a phasor to the system
   */
  addPhasor(t) {
    this.phasors.push(t);
  }
  /**
   * Simulate all phasors and sub-phasors in the system
   */
  simulate(t) {
    const e = [];
    for (const n of this.phasors) {
      const r = n.simulate(t);
      e.push(r);
    }
    return e;
  }
  /**
   * Get a flattened list of all phasors (primary + sub-phasors)
   */
  getAllPhasors() {
    const t = [];
    for (const e of this.phasors)
      t.push(e), this.collectSubPhasors(e, t);
    return t;
  }
  /**
   * Recursively collect all sub-phasors
   */
  collectSubPhasors(t, e) {
    for (const n of t.subPhasors)
      e.push(n), this.collectSubPhasors(n, e);
  }
  /**
   * Map phasor motion to musical parameters
   */
  mapToMusic(t, e = {}) {
    const n = this.simulate(t), r = [];
    for (let o = 0; o < n.length; o++) {
      const i = n[o], s = this.createMusicalTrack(i, o, e);
      r.push(s);
    }
    return r;
  }
  /**
   * Create a musical track from phasor motion
   */
  createMusicalTrack(t, e, n = {}) {
    const {
      pitchRange: r = [40, 80],
      durationRange: o = [0.25, 2],
      useDistance: i = !0,
      useAngle: s = !1,
      quantizeToScale: a = null,
      timingConfig: l = this.timingConfig,
      useStringTime: u = !1
    } = n, d = [];
    for (const m of t) {
      let p, g;
      if (i) {
        const f = Math.max(0, Math.min(1, m.distance / 10));
        p = r[0] + f * (r[1] - r[0]);
      } else
        p = r[0] + m.angle / 360 * (r[1] - r[0]);
      if (s)
        g = o[0] + m.angle / 360 * (o[1] - o[0]);
      else {
        const f = Math.max(0, Math.min(1, m.distance / 10));
        g = o[1] - f * (o[1] - o[0]);
      }
      if (a) {
        const f = Math.floor((p - r[0]) / (r[1] - r[0]) * a.length), C = Math.max(0, Math.min(f, a.length - 1));
        p = a[C];
      } else
        p = Math.round(p);
      d.push({
        pitch: p,
        duration: g,
        time: u ? At(m.time, l) : m.time,
        phasorData: {
          distance: m.distance,
          angle: m.angle,
          position: m.position
        }
      });
    }
    return d;
  }
  /**
   * Generate JMON tracks directly from phasor motion
   */
  generateTracks(t, e = {}, n = {}) {
    const r = this.mapToMusic(t, e), o = [];
    return r.forEach((i, s) => {
      const a = Nt(i, {
        label: `phasor-${s + 1}`,
        midiChannel: s % 16,
        synth: { type: "Synth" },
        ...n
      });
      o.push(a);
    }), o;
  }
  /**
   * Create complex harmonic patterns with sub-phasors (epicycles)
   */
  static createComplexSystem() {
    const t = new Kt(), e = new Tt(0.2, 5, 0), n = new Tt(0.3, 3, Math.PI / 2), r = new Tt(0.1, 8, Math.PI);
    e.addSubPhasor(r);
    const o = new Tt(2, 1, 0, [e, n]), i = new Tt(3.5, 0.6, Math.PI / 3);
    return t.addPhasor(o), t.addPhasor(i), t;
  }
  /**
   * Generate time array with linear spacing
   */
  static generateTimeArray(t = 0, e = 10, n = 100) {
    const r = [], o = (e - t) / (n - 1);
    for (let i = 0; i < n; i++)
      r.push(t + i * o);
    return r;
  }
}
class In {
  /**
   * @param {MandelbrotOptions} [options={}] - Configuration options
   */
  constructor(t = {}) {
    this.width = t.width || 100, this.height = t.height || 100, this.maxIterations = t.maxIterations || 100, this.xMin = t.xMin || -2.5, this.xMax = t.xMax || 1.5, this.yMin = t.yMin || -2, this.yMax = t.yMax || 2;
  }
  /**
   * Generate Mandelbrot set data
   * @returns {number[][]} 2D array of iteration counts
   */
  generate() {
    const t = [];
    for (let e = 0; e < this.height; e++) {
      const n = [];
      for (let r = 0; r < this.width; r++) {
        const o = this.xMin + r / this.width * (this.xMax - this.xMin), i = this.yMin + e / this.height * (this.yMax - this.yMin), s = this.mandelbrotIterations({ real: o, imaginary: i });
        n.push(s);
      }
      t.push(n);
    }
    return t;
  }
  /**
   * Extract sequence from Mandelbrot data using various methods
   * @param {'diagonal'|'border'|'spiral'|'column'|'row'} [method='diagonal'] - Extraction method
   * @param {number} [index=0] - Index for column/row extraction
   * @returns {number[]} Extracted sequence
   */
  extractSequence(t = "diagonal", e = 0) {
    const n = this.generate();
    switch (t) {
      case "diagonal":
        return this.extractDiagonal(n);
      case "border":
        return this.extractBorder(n);
      case "spiral":
        return this.extractSpiral(n);
      case "column":
        return this.extractColumn(n, e);
      case "row":
        return this.extractRow(n, e);
      default:
        return this.extractDiagonal(n);
    }
  }
  /**
   * Calculate Mandelbrot iterations for a complex point
   * @param {ComplexPoint} c - Complex point to test
   * @returns {number} Number of iterations before escape
   */
  mandelbrotIterations(t) {
    let e = { real: 0, imaginary: 0 };
    for (let n = 0; n < this.maxIterations; n++) {
      const r = e.real * e.real - e.imaginary * e.imaginary + t.real, o = 2 * e.real * e.imaginary + t.imaginary;
      if (e.real = r, e.imaginary = o, e.real * e.real + e.imaginary * e.imaginary > 4)
        return n;
    }
    return this.maxIterations;
  }
  /**
   * Extract diagonal sequence
   * @param {number[][]} data - 2D fractal data
   * @returns {number[]} Diagonal sequence
   */
  extractDiagonal(t) {
    const e = [], n = Math.min(t.length, t[0]?.length || 0);
    for (let r = 0; r < n; r++)
      e.push(t[r][r]);
    return e;
  }
  /**
   * Extract border sequence (clockwise)
   * @param {number[][]} data - 2D fractal data
   * @returns {number[]} Border sequence
   */
  extractBorder(t) {
    const e = [], n = t.length, r = t[0]?.length || 0;
    if (n === 0 || r === 0) return e;
    for (let o = 0; o < r; o++)
      e.push(t[0][o]);
    for (let o = 1; o < n; o++)
      e.push(t[o][r - 1]);
    if (n > 1)
      for (let o = r - 2; o >= 0; o--)
        e.push(t[n - 1][o]);
    if (r > 1)
      for (let o = n - 2; o > 0; o--)
        e.push(t[o][0]);
    return e;
  }
  /**
   * Extract spiral sequence (from outside to inside)
   * @param {number[][]} data - 2D fractal data
   * @returns {number[]} Spiral sequence
   */
  extractSpiral(t) {
    const e = [], n = t.length, r = t[0]?.length || 0;
    if (n === 0 || r === 0) return e;
    let o = 0, i = n - 1, s = 0, a = r - 1;
    for (; o <= i && s <= a; ) {
      for (let l = s; l <= a; l++)
        e.push(t[o][l]);
      o++;
      for (let l = o; l <= i; l++)
        e.push(t[l][a]);
      if (a--, o <= i) {
        for (let l = a; l >= s; l--)
          e.push(t[i][l]);
        i--;
      }
      if (s <= a) {
        for (let l = i; l >= o; l--)
          e.push(t[l][s]);
        s++;
      }
    }
    return e;
  }
  /**
   * Extract specific column
   * @param {number[][]} data - 2D fractal data
   * @param {number} columnIndex - Column index to extract
   * @returns {number[]} Column sequence
   */
  extractColumn(t, e) {
    const n = [], r = t[0]?.length || 0, o = Math.max(0, Math.min(e, r - 1));
    for (const i of t)
      i[o] !== void 0 && n.push(i[o]);
    return n;
  }
  /**
   * Extract specific row
   * @param {number[][]} data - 2D fractal data
   * @param {number} rowIndex - Row index to extract
   * @returns {number[]} Row sequence
   */
  extractRow(t, e) {
    const n = Math.max(0, Math.min(e, t.length - 1));
    return t[n] ? [...t[n]] : [];
  }
  /**
   * Map fractal values to musical scale
   * @param {number[]} sequence - Fractal sequence
   * @param {number[]} [scale=[0, 2, 4, 5, 7, 9, 11]] - Musical scale intervals
   * @param {number} [octaveRange=3] - Number of octaves to span
   * @returns {number[]} MIDI note sequence
   */
  mapToScale(t, e = [0, 2, 4, 5, 7, 9, 11], n = 3) {
    if (t.length === 0) return [];
    const r = Math.min(...t), i = Math.max(...t) - r || 1;
    return t.map((s) => {
      const a = (s - r) / i, l = Math.floor(a * e.length * n), u = Math.floor(l / e.length), d = l % e.length;
      return 60 + u * 12 + e[d];
    });
  }
  /**
   * Generate rhythmic pattern from fractal data
   * @param {number[]} sequence - Fractal sequence
   * @param {number[]} [subdivisions=[1, 2, 4, 8, 16]] - Rhythmic subdivisions
   * @returns {number[]} Rhythmic durations
   */
  mapToRhythm(t, e = [1, 2, 4, 8, 16]) {
    if (t.length === 0) return [];
    const n = Math.min(...t), o = Math.max(...t) - n || 1;
    return t.map((i) => {
      const s = (i - n) / o, a = Math.floor(s * e.length), l = Math.max(0, Math.min(a, e.length - 1));
      return 1 / e[l];
    });
  }
}
class Ln {
  /**
   * @param {LogisticMapOptions} [options={}] - Configuration options
   */
  constructor(t = {}) {
    this.r = t.r || 3.8, this.x0 = t.x0 || 0.5, this.iterations = t.iterations || 1e3, this.skipTransient = t.skipTransient || 100;
  }
  /**
   * Generate logistic map sequence
   * @returns {number[]} Generated sequence
   */
  generate() {
    const t = [];
    let e = this.x0;
    for (let n = 0; n < this.iterations + this.skipTransient; n++)
      e = this.r * e * (1 - e), n >= this.skipTransient && t.push(e);
    return t;
  }
  /**
   * Generate bifurcation data for different r values
   * @param {number} [rMin=2.5] - Minimum r value
   * @param {number} [rMax=4.0] - Maximum r value
   * @param {number} [rSteps=1000] - Number of r steps
   * @returns {Object} Bifurcation data with r and x arrays
   */
  bifurcationDiagram(t = 2.5, e = 4, n = 1e3) {
    const r = [], o = [], i = (e - t) / n;
    for (let s = 0; s < n; s++) {
      const a = t + s * i, l = this.r;
      this.r = a;
      const u = this.generate();
      this.r = l;
      const d = u.slice(-50);
      for (const m of d)
        r.push(a), o.push(m);
    }
    return { r, x: o };
  }
  /**
   * Map chaotic values to musical scale
   * @param {number[]} sequence - Chaotic sequence
   * @param {number[]} [scale=[0, 2, 4, 5, 7, 9, 11]] - Musical scale intervals
   * @param {number} [octaveRange=3] - Number of octaves to span
   * @returns {number[]} MIDI note sequence
   */
  mapToScale(t, e = [0, 2, 4, 5, 7, 9, 11], n = 3) {
    return t.length === 0 ? [] : t.map((r) => {
      const o = Math.floor(r * e.length * n), i = Math.floor(o / e.length), s = o % e.length;
      return 60 + i * 12 + e[s];
    });
  }
  /**
   * Map to rhythmic durations
   * @param {number[]} sequence - Chaotic sequence
   * @param {number[]} [durations=[0.25, 0.5, 1, 2]] - Duration values
   * @returns {number[]} Rhythm sequence
   */
  mapToRhythm(t, e = [0.25, 0.5, 1, 2]) {
    return t.length === 0 ? [] : t.map((n) => {
      const r = Math.floor(n * e.length), o = Math.max(0, Math.min(r, e.length - 1));
      return e[o];
    });
  }
  /**
   * Map to velocities
   * @param {number[]} sequence - Chaotic sequence
   * @param {number} [minVel=0.3] - Minimum velocity
   * @param {number} [maxVel=1.0] - Maximum velocity
   * @returns {number[]} Velocity sequence
   */
  mapToVelocity(t, e = 0.3, n = 1) {
    if (t.length === 0) return [];
    const r = n - e;
    return t.map((o) => e + o * r);
  }
  /**
   * Detect periodic cycles in the sequence
   * @param {number[]} sequence - Sequence to analyze
   * @param {number} [tolerance=0.01] - Tolerance for cycle detection
   * @returns {number[]} Detected cycle periods
   */
  detectCycles(t, e = 0.01) {
    const n = [];
    for (let r = 1; r <= Math.floor(t.length / 2); r++) {
      let o = !0;
      for (let i = r; i < Math.min(t.length, r * 3); i++)
        if (Math.abs(t[i] - t[i - r]) > e) {
          o = !1;
          break;
        }
      o && n.push(r);
    }
    return n;
  }
  /**
   * Calculate Lyapunov exponent (measure of chaos)
   * @param {number} [iterations=10000] - Number of iterations for calculation
   * @returns {number} Lyapunov exponent
   */
  lyapunovExponent(t = 1e4) {
    let e = this.x0, n = 0;
    for (let r = 0; r < t; r++) {
      const o = this.r * (1 - 2 * e);
      n += Math.log(Math.abs(o)), e = this.r * e * (1 - e);
    }
    return n / t;
  }
  /**
   * Generate multiple correlated sequences
   * @param {number} [numSequences=2] - Number of sequences to generate
   * @param {number} [coupling=0.1] - Coupling strength between sequences
   * @returns {number[][]} Array of coupled sequences
   */
  generateCoupled(t = 2, e = 0.1) {
    const n = Array(t).fill(null).map(() => []), r = Array(t).fill(this.x0);
    for (let o = 0; o < this.iterations + this.skipTransient; o++) {
      const i = [...r];
      for (let s = 0; s < t; s++) {
        let a = 0;
        for (let l = 0; l < t; l++)
          l !== s && (a += e * (r[l] - r[s]));
        i[s] = this.r * r[s] * (1 - r[s]) + a, i[s] = Math.max(0, Math.min(1, i[s]));
      }
      if (r.splice(0, t, ...i), o >= this.skipTransient)
        for (let s = 0; s < t; s++)
          n[s].push(r[s]);
    }
    return n;
  }
  /**
   * Apply different chaotic regimes
   * @param {'periodic'|'chaotic'|'edge'|'custom'} regime - Regime type
   * @param {number} [customR] - Custom r value for 'custom' regime
   */
  setRegime(t, e) {
    switch (t) {
      case "periodic":
        this.r = 3.2;
        break;
      case "chaotic":
        this.r = 3.9;
        break;
      case "edge":
        this.r = 3.57;
        break;
      case "custom":
        e !== void 0 && (this.r = Math.max(0, Math.min(4, e)));
        break;
    }
  }
  /**
   * Get current parameters
   * @returns {LogisticMapOptions} Current configuration
   */
  getParameters() {
    return {
      r: this.r,
      x0: this.x0,
      iterations: this.iterations,
      skipTransient: this.skipTransient
    };
  }
}
class Fn {
  operation;
  direction;
  repetition;
  timingConfig;
  sequence = [];
  constructor(t) {
    const { operation: e, direction: n, repetition: r, timingConfig: o = bt } = t;
    if (!["additive", "subtractive"].includes(e))
      throw new Error("Invalid operation. Choose 'additive' or 'subtractive'.");
    if (!["forward", "backward", "inward", "outward"].includes(n))
      throw new Error("Invalid direction. Choose 'forward', 'backward', 'inward' or 'outward'.");
    if (r < 0 || !Number.isInteger(r))
      throw new Error("Invalid repetition value. Must be an integer greater than or equal to 0.");
    this.operation = e, this.direction = n, this.repetition = r, this.timingConfig = o;
  }
  /**
   * Generate processed sequence based on operation and direction
   * Accepts either:
   * - JMON note objects: { pitch, duration, time }
   * - Legacy objects: { pitch, duration, offset }
   * - Legacy tuples: [pitch, duration, offset]
   * Returns: JMON note objects with numeric time (quarter notes)
   */
  generate(t) {
    this.sequence = this.normalizeInput(t);
    let e;
    if (this.operation === "additive" && this.direction === "forward")
      e = this.additiveForward();
    else if (this.operation === "additive" && this.direction === "backward")
      e = this.additiveBackward();
    else if (this.operation === "additive" && this.direction === "inward")
      e = this.additiveInward();
    else if (this.operation === "additive" && this.direction === "outward")
      e = this.additiveOutward();
    else if (this.operation === "subtractive" && this.direction === "forward")
      e = this.subtractiveForward();
    else if (this.operation === "subtractive" && this.direction === "backward")
      e = this.subtractiveBackward();
    else if (this.operation === "subtractive" && this.direction === "inward")
      e = this.subtractiveInward();
    else if (this.operation === "subtractive" && this.direction === "outward")
      e = this.subtractiveOutward();
    else
      throw new Error("Invalid operation/direction combination");
    const n = this.adjustOffsets(e);
    return this.toJmonNotes(n, !1);
  }
  additiveForward() {
    const t = [];
    for (let e = 0; e < this.sequence.length; e++) {
      const n = this.sequence.slice(0, e + 1);
      for (let r = 0; r <= this.repetition; r++)
        t.push(...n);
    }
    return t;
  }
  additiveBackward() {
    const t = [];
    for (let e = this.sequence.length; e > 0; e--) {
      const n = this.sequence.slice(e - 1);
      for (let r = 0; r <= this.repetition; r++)
        t.push(...n);
    }
    return t;
  }
  additiveInward() {
    const t = [], e = this.sequence.length;
    for (let n = 0; n < Math.ceil(e / 2); n++) {
      let r;
      if (n < e - n - 1) {
        const o = this.sequence.slice(0, n + 1), i = this.sequence.slice(e - n - 1);
        r = [...o, ...i];
      } else
        r = [...this.sequence];
      for (let o = 0; o <= this.repetition; o++)
        t.push(...r);
    }
    return t;
  }
  additiveOutward() {
    const t = [], e = this.sequence.length;
    if (e % 2 === 0) {
      const n = Math.floor(e / 2) - 1, r = Math.floor(e / 2);
      for (let o = 0; o < e / 2; o++) {
        const i = this.sequence.slice(n - o, r + o + 1);
        for (let s = 0; s <= this.repetition; s++)
          t.push(...i);
      }
    } else {
      const n = Math.floor(e / 2);
      for (let r = 0; r <= n; r++) {
        const o = this.sequence.slice(n - r, n + r + 1);
        for (let i = 0; i <= this.repetition; i++)
          t.push(...o);
      }
    }
    return t;
  }
  subtractiveForward() {
    const t = [];
    for (let e = 0; e < this.sequence.length; e++) {
      const n = this.sequence.slice(e);
      for (let r = 0; r <= this.repetition; r++)
        t.push(...n);
    }
    return t;
  }
  subtractiveBackward() {
    const t = [];
    for (let e = this.sequence.length; e > 0; e--) {
      const n = this.sequence.slice(0, e);
      for (let r = 0; r <= this.repetition; r++)
        t.push(...n);
    }
    return t;
  }
  subtractiveInward() {
    const t = [], e = this.sequence.length, n = Math.floor(e / 2);
    for (let r = 0; r <= this.repetition; r++)
      t.push(...this.sequence);
    for (let r = 1; r <= n; r++) {
      const o = this.sequence.slice(r, e - r);
      if (o.length > 0)
        for (let i = 0; i <= this.repetition; i++)
          t.push(...o);
    }
    return t;
  }
  subtractiveOutward() {
    const t = [];
    let e = [...this.sequence];
    for (let n = 0; n <= this.repetition; n++)
      t.push(...e);
    for (; e.length > 2; ) {
      e = e.slice(1, -1);
      for (let n = 0; n <= this.repetition; n++)
        t.push(...e);
    }
    return t;
  }
  // Normalize heterogenous inputs into objects with pitch, duration, offset (beats)
  normalizeInput(t) {
    return Array.isArray(t) ? Array.isArray(t[0]) ? t.map(([e, n, r = 0]) => ({ pitch: e, duration: n, offset: r })) : t.map((e) => {
      const n = e.pitch, r = e.duration;
      let o = 0;
      return typeof e.offset == "number" ? o = e.offset : typeof e.time == "number" ? o = e.time : typeof e.time == "string" && (o = this.timeToBeats(e.time)), { ...e, pitch: n, duration: r, offset: o };
    }) : [];
  }
  // Convert beats to bars:beats:ticks using centralized utility
  beatsToTime(t) {
    return At(t, this.timingConfig);
  }
  // Convert bars:beats:ticks to beats using centralized utility
  timeToBeats(t) {
    return typeof t != "string" ? Number(t) || 0 : Ht(t, this.timingConfig);
  }
  // After process, recalc offsets sequentially in beats
  adjustOffsets(t) {
    let e = 0;
    return t.map((n) => {
      const r = {
        ...n,
        offset: e
      };
      return e += n.duration, r;
    });
  }
  // Produce JMON notes: { pitch, duration, time }
  // Always use numeric time in quarter notes (like pitch: 60, time: 4.5)
  toJmonNotes(t, e = !1) {
    return t.map(({ pitch: n, duration: r, offset: o, ...i }) => {
      const { time: s, ...a } = i;
      return {
        pitch: n,
        duration: r,
        time: e ? this.beatsToTime(o) : o,
        ...a
      };
    });
  }
  /**
   * Generate and convert to JMON track format
   * @param {Array} sequence - Input sequence
   * @param {Object} trackOptions - Track configuration options
   * @param {boolean} trackOptions.useStringTime - Use bars:beats:ticks strings for display (default: numeric)
   * @returns {Object} JMON track object
   */
  generateTrack(t, e = {}) {
    const n = this.generate(t);
    return Nt(n, {
      timingConfig: this.timingConfig,
      ...e
    });
  }
}
class Dn {
  tChord;
  direction;
  rank;
  isAlternate;
  currentDirection;
  timingConfig;
  constructor(t, e = "down", n = 0, r = bt) {
    if (!["up", "down", "any", "alternate"].includes(e))
      throw new Error("Invalid direction. Choose 'up', 'down', 'any' or 'alternate'.");
    if (this.tChord = t, this.isAlternate = e === "alternate", this.currentDirection = this.isAlternate ? "up" : e, this.direction = e, this.timingConfig = r, !Number.isInteger(n) || n < 0)
      throw new Error("Rank must be a non-negative integer.");
    this.rank = Math.min(n, t.length - 1), this.rank >= t.length && console.warn("Rank exceeds the length of the t-chord. Using last note of the t-chord.");
  }
  /**
   * Generate t-voice from m-voice sequence
   * Accepts: JMON notes, legacy objects, or tuples
   * Returns: JMON notes with numeric time (quarter notes)
   * @param {Array} sequence - Input sequence
   * @param {boolean} useStringTime - Whether to use bars:beats:ticks strings for display (default: false)
   */
  generate(t, e = !1) {
    const n = this.normalizeInput(t), r = [];
    for (const o of n) {
      if (o.pitch === void 0) {
        const { offset: g, time: f, ...C } = o;
        r.push({
          ...C,
          pitch: void 0,
          time: e ? this.beatsToTime(g) : g
        });
        continue;
      }
      const i = o.pitch, a = this.tChord.map((g) => g - i).map((g, f) => ({ index: f, value: g })).sort((g, f) => Math.abs(g.value) - Math.abs(f.value));
      let l = this.rank, u;
      if (this.currentDirection === "up" || this.currentDirection === "down") {
        const g = a.filter(
          ({ value: f }) => this.currentDirection === "up" ? f >= 0 : f <= 0
        );
        if (g.length === 0)
          u = this.currentDirection === "up" ? Math.max(...this.tChord) : Math.min(...this.tChord);
        else {
          l >= g.length && (l = g.length - 1);
          const f = g[l].index;
          u = this.tChord[f];
        }
      } else {
        l >= a.length && (l = a.length - 1);
        const g = a[l].index;
        u = this.tChord[g];
      }
      this.isAlternate && (this.currentDirection = this.currentDirection === "up" ? "down" : "up");
      const { offset: d, time: m, ...p } = o;
      r.push({
        ...p,
        pitch: u,
        time: e ? this.beatsToTime(d) : d
      });
    }
    return r;
  }
  // Normalize input like MinimalismProcess
  normalizeInput(t) {
    return Array.isArray(t) ? Array.isArray(t[0]) ? t.map(([e, n, r = 0]) => ({ pitch: e, duration: n, offset: r })) : t.map((e) => {
      const n = e.pitch, r = e.duration;
      let o = 0;
      return typeof e.offset == "number" ? o = e.offset : typeof e.time == "number" ? o = e.time : typeof e.time == "string" && (o = this.timeToBeats(e.time)), { ...e, pitch: n, duration: r, offset: o };
    }) : [];
  }
  // Convert beats to bars:beats:ticks using centralized utility
  beatsToTime(t) {
    return At(t, this.timingConfig);
  }
  // Convert bars:beats:ticks to beats using centralized utility
  timeToBeats(t) {
    return typeof t != "string" ? Number(t) || 0 : Ht(t, this.timingConfig);
  }
}
class _n {
  /**
   * Calculate Gini coefficient for inequality measurement
   * @param {number[]} values - Values to analyze
   * @param {number[]} [weights] - Optional weights
   * @returns {number} Gini coefficient (0-1)
   */
  static gini(t, e) {
    if (t.length === 0) return 0;
    const n = t.length, r = e || Array(n).fill(1), o = t.map((d, m) => ({ value: d, weight: r[m] })).sort((d, m) => d.value - m.value), i = o.map((d) => d.value), s = o.map((d) => d.weight), a = s.reduce((d, m) => d + m, 0);
    let l = 0, u = 0;
    for (let d = 0; d < n; d++) {
      const m = s.slice(0, d + 1).reduce(
        (p, g) => p + g,
        0
      );
      l += s[d] * (2 * m - s[d] - a) * i[d], u += s[d] * i[d] * a;
    }
    return u === 0 ? 0 : l / u;
  }
  /**
   * Calculate center of mass (balance point) of a sequence
   * @param {number[]} values - Values to analyze
   * @param {number[]} [weights] - Optional weights
   * @returns {number} Balance point
   */
  static balance(t, e) {
    if (t.length === 0) return 0;
    const n = e || Array(t.length).fill(1), r = t.reduce((i, s, a) => i + s * n[a], 0), o = n.reduce((i, s) => i + s, 0);
    return o === 0 ? 0 : r / o;
  }
  /**
   * Calculate autocorrelation for pattern detection
   * @param {number[]} values - Values to analyze
   * @param {number} [maxLag] - Maximum lag to calculate
   * @returns {number[]} Autocorrelation array
   */
  static autocorrelation(t, e) {
    const n = t.length, r = e || Math.floor(n / 2), o = [], i = t.reduce((a, l) => a + l, 0) / n, s = t.reduce((a, l) => a + Math.pow(l - i, 2), 0) / n;
    for (let a = 0; a <= r; a++) {
      let l = 0;
      for (let u = 0; u < n - a; u++)
        l += (t[u] - i) * (t[u + a] - i);
      l /= n - a, o.push(s === 0 ? 0 : l / s);
    }
    return o;
  }
  /**
   * Detect and score musical motifs
   * @param {number[]} values - Values to analyze
   * @param {number} [patternLength=3] - Length of patterns to detect
   * @returns {number} Motif score
   */
  static motif(t, e = 3) {
    if (t.length < e * 2) return 0;
    const n = /* @__PURE__ */ new Map();
    for (let i = 0; i <= t.length - e; i++) {
      const s = t.slice(i, i + e).join(",");
      n.set(s, (n.get(s) || 0) + 1);
    }
    const r = Math.max(...n.values()), o = n.size;
    return o === 0 ? 0 : r / o;
  }
  /**
   * Calculate dissonance/scale conformity
   * @param {number[]} pitches - MIDI pitch values
   * @param {number[]} [scale=[0, 2, 4, 5, 7, 9, 11]] - Scale to check against
   * @returns {number} Dissonance score (0-1)
   */
  static dissonance(t, e = [0, 2, 4, 5, 7, 9, 11]) {
    if (t.length === 0) return 0;
    let n = 0;
    for (const r of t) {
      const o = (r % 12 + 12) % 12;
      e.includes(o) && n++;
    }
    return 1 - n / t.length;
  }
  /**
   * Calculate rhythmic fit to a grid
   * @param {number[]} onsets - Onset times
   * @param {number} [gridDivision=16] - Grid division
   * @returns {number} Rhythmic alignment score
   */
  static rhythmic(t, e = 16) {
    if (t.length === 0) return 0;
    let n = 0;
    const r = 0.1;
    for (const o of t) {
      const i = o * e, s = Math.round(i);
      Math.abs(i - s) <= r && n++;
    }
    return n / t.length;
  }
  /**
   * Calculate Fibonacci/golden ratio index
   * @param {number[]} values - Values to analyze
   * @returns {number} Fibonacci index
   */
  static fibonacciIndex(t) {
    if (t.length < 2) return 0;
    const e = (1 + Math.sqrt(5)) / 2;
    let n = 0;
    for (let r = 1; r < t.length; r++)
      if (t[r - 1] !== 0) {
        const o = t[r] / t[r - 1], i = Math.abs(o - e);
        n += 1 / (1 + i);
      }
    return n / (t.length - 1);
  }
  /**
   * Calculate syncopation (off-beat emphasis)
   * @param {number[]} onsets - Onset times
   * @param {number} [beatDivision=4] - Beat division
   * @returns {number} Syncopation score
   */
  static syncopation(t, e = 4) {
    if (t.length === 0) return 0;
    let n = 0;
    for (const r of t) {
      const o = r * e % 1;
      o > 0.2 && o < 0.8 && Math.abs(o - 0.5) > 0.2 && n++;
    }
    return n / t.length;
  }
  /**
   * Calculate contour entropy (melodic direction randomness)
   * @param {number[]} pitches - Pitch values
   * @returns {number} Contour entropy
   */
  static contourEntropy(t) {
    if (t.length < 2) return 0;
    const e = [];
    for (let i = 1; i < t.length; i++) {
      const s = t[i] - t[i - 1];
      s > 0 ? e.push(1) : s < 0 ? e.push(-1) : e.push(0);
    }
    const n = { up: 0, down: 0, same: 0 };
    for (const i of e)
      i > 0 ? n.up++ : i < 0 ? n.down++ : n.same++;
    const r = e.length;
    return -[
      n.up / r,
      n.down / r,
      n.same / r
    ].filter((i) => i > 0).reduce((i, s) => i + s * Math.log2(s), 0);
  }
  /**
   * Calculate interval variance (pitch stability)
   * @param {number[]} pitches - Pitch values
   * @returns {number} Interval variance
   */
  static intervalVariance(t) {
    if (t.length < 2) return 0;
    const e = [];
    for (let o = 1; o < t.length; o++)
      e.push(Math.abs(t[o] - t[o - 1]));
    const n = e.reduce((o, i) => o + i, 0) / e.length;
    return e.reduce(
      (o, i) => o + Math.pow(i - n, 2),
      0
    ) / e.length;
  }
  /**
   * Calculate note density (notes per unit time)
   * @param {JMonNote[]} notes - Array of notes
   * @param {number} [timeWindow=1] - Time window for density calculation
   * @returns {number} Note density
   */
  static density(t, e = 1) {
    if (t.length === 0) return 0;
    const n = t.map((s) => typeof s.time == "string" ? parseFloat(s.time) || 0 : s.time || 0), r = Math.min(...n), i = Math.max(...n) - r || 1;
    return t.length / (i / e);
  }
  /**
   * Calculate gap variance (timing consistency)
   * @param {number[]} onsets - Onset times
   * @returns {number} Gap variance
   */
  static gapVariance(t) {
    if (t.length < 2) return 0;
    const e = [];
    for (let o = 1; o < t.length; o++)
      e.push(t[o] - t[o - 1]);
    const n = e.reduce((o, i) => o + i, 0) / e.length;
    return e.reduce((o, i) => o + Math.pow(i - n, 2), 0) / e.length;
  }
  /**
   * Comprehensive analysis of a musical sequence
   * @param {JMonNote[]} notes - Array of notes to analyze
   * @param {AnalysisOptions} [options={}] - Analysis options
   * @returns {AnalysisResult} Analysis results
   */
  static analyze(t, e = {}) {
    const { scale: n = [0, 2, 4, 5, 7, 9, 11] } = e, r = t.map((i) => typeof i.note == "number" ? i.note : typeof i.note == "string" ? 60 : Array.isArray(i.note) ? i.note[0] : 60), o = t.map((i) => typeof i.time == "number" ? i.time : parseFloat(i.time) || 0);
    return {
      gini: this.gini(r),
      balance: this.balance(r),
      motif: this.motif(r),
      dissonance: this.dissonance(r, n),
      rhythmic: this.rhythmic(o),
      fibonacciIndex: this.fibonacciIndex(r),
      syncopation: this.syncopation(o),
      contourEntropy: this.contourEntropy(r),
      intervalVariance: this.intervalVariance(r),
      density: this.density(t),
      gapVariance: this.gapVariance(o)
    };
  }
}
const On = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MusicalAnalysis: _n,
  MusicalIndex: Lt
}, Symbol.toStringTag, { value: "Module" })), zn = {
  harmony: ln,
  rhythm: Tn,
  motifs: {
    MotifBank: kn
  }
}, Bn = {
  theory: ct
}, Vn = {
  gaussian: {
    Regressor: Se,
    Kernel: Cn
  },
  automata: {
    Cellular: Nn
  },
  loops: Ft,
  genetic: {
    Darwin: Rn
  },
  walks: {
    Random: jn,
    Chain: $n,
    Phasor: {
      Vector: Tt,
      System: Kt
    }
  },
  fractals: {
    Mandelbrot: In,
    LogisticMap: Ln
  },
  minimalism: {
    Process: Fn,
    Tintinnabuli: Dn
  }
}, qn = {
  ...On
}, Gn = {
  ...nn
}, Et = {
  theory: zn,
  constants: Bn,
  generative: Vn,
  analysis: qn,
  utils: Gn
};
function Yn(c) {
  const t = typeof c == "string" ? parseInt(c, 10) : c;
  if (!Number.isFinite(t)) return String(c);
  const n = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][(t % 12 + 12) % 12], r = Math.floor(t / 12) - 1;
  return `${n}${r}`;
}
function Un(c) {
  return !c || !Array.isArray(c.audioGraph) || c.audioGraph.forEach((t) => {
    try {
      if (!t || t.type !== "Sampler") return;
      const e = t.options || {}, n = e.urls;
      if (!n || typeof n != "object") return;
      const r = {};
      Object.keys(n).forEach((o) => {
        const i = String(o);
        let s = i;
        /^\d+$/.test(i) && (s = Yn(parseInt(i, 10))), r[s] = n[o];
      }), t.options = { ...e, urls: r };
    } catch {
    }
  }), c;
}
class Vt {
  constructor(t = {}) {
    this.options = t;
  }
  // Parse bars:beats:ticks -> beats (supports fractional beats)
  static parseBBTToBeats(t, e = 4, n = 480) {
    if (typeof t == "number") return t;
    if (typeof t != "string") return 0;
    const r = t.match(/^(\d+):(\d+(?:\.\d+)?):(\d+)$/);
    if (!r) return 0;
    const o = parseInt(r[1], 10), i = parseFloat(r[2]), s = parseInt(r[3], 10);
    return o * e + i + s / n;
  }
  // Parse note value (e.g., 4n, 8n, 8t) or BBT to beats
  static parseDurationToBeats(t, e = 4, n = 480) {
    if (typeof t == "number") return t;
    if (typeof t != "string") return 0;
    if (/^\d+:\d+(?:\.\d+)?:\d+$/.test(t))
      return this.parseBBTToBeats(t, e, n);
    const r = t.match(/^(\d+)(n|t)$/);
    if (r) {
      const o = parseInt(r[1], 10), i = r[2];
      if (i === "n")
        return 4 / o;
      if (i === "t")
        return 4 / o * (2 / 3);
    }
    return 0;
  }
  convert(t) {
    return (t.tracks || []).map((n) => ({
      label: n.label,
      type: "PolySynth",
      // Default type for the current player
      part: (n.notes || []).map((r) => ({
        time: r.time,
        pitch: r.pitch,
        duration: r.duration,
        velocity: r.velocity || 0.8
      }))
    }));
  }
}
function Ae(c, t = {}) {
  try {
    Un(c);
  } catch {
  }
  const r = new Vt(t).convert(c).map((m, p) => ({
    originalTrackIndex: p,
    voiceIndex: 0,
    totalVoices: 1,
    trackInfo: { label: m.label },
    synthConfig: { type: m.type || "PolySynth" },
    partEvents: m.part || []
  })), o = c.tempo || c.metadata?.tempo || c.bpm || 120, [i, s] = (c.timeSignature || "4/4").split("/").map((m) => parseInt(m, 10)), a = isFinite(i) ? i : 4;
  let l = 0;
  r.forEach((m) => {
    m.partEvents && m.partEvents.length > 0 && m.partEvents.forEach((p) => {
      const g = Vt.parseBBTToBeats(p.time, a), f = Vt.parseDurationToBeats(p.duration, a), C = g + f;
      C > l && (l = C);
    });
  });
  const u = 60 / o, d = l * u;
  return console.log(`[TONEJS] Duration calc: totalBeats=${l.toFixed(2)} beats = ${d.toFixed(2)}s - loop ends exactly when last note finishes`), {
    tracks: r,
    metadata: {
      totalDuration: d,
      // Use total duration - loop should end when last note finishes
      tempo: o
    }
  };
}
const St = {
  // Piano Family
  0: { name: "Acoustic Grand Piano", folder: "acoustic_grand_piano-mp3" },
  1: { name: "Bright Acoustic Piano", folder: "bright_acoustic_piano-mp3" },
  2: { name: "Electric Grand Piano", folder: "electric_grand_piano-mp3" },
  3: { name: "Honky-tonk Piano", folder: "honkytonk_piano-mp3" },
  4: { name: "Electric Piano 1", folder: "electric_piano_1-mp3" },
  5: { name: "Electric Piano 2", folder: "electric_piano_2-mp3" },
  6: { name: "Harpsichord", folder: "harpsichord-mp3" },
  7: { name: "Clavinet", folder: "clavinet-mp3" },
  // Chromatic Percussion
  8: { name: "Celesta", folder: "celesta-mp3" },
  9: { name: "Glockenspiel", folder: "glockenspiel-mp3" },
  10: { name: "Music Box", folder: "music_box-mp3" },
  11: { name: "Vibraphone", folder: "vibraphone-mp3" },
  12: { name: "Marimba", folder: "marimba-mp3" },
  13: { name: "Xylophone", folder: "xylophone-mp3" },
  14: { name: "Tubular Bells", folder: "tubular_bells-mp3" },
  15: { name: "Dulcimer", folder: "dulcimer-mp3" },
  // Organ
  16: { name: "Drawbar Organ", folder: "drawbar_organ-mp3" },
  17: { name: "Percussive Organ", folder: "percussive_organ-mp3" },
  18: { name: "Rock Organ", folder: "rock_organ-mp3" },
  19: { name: "Church Organ", folder: "church_organ-mp3" },
  20: { name: "Reed Organ", folder: "reed_organ-mp3" },
  21: { name: "Accordion", folder: "accordion-mp3" },
  22: { name: "Harmonica", folder: "harmonica-mp3" },
  23: { name: "Tango Accordion", folder: "tango_accordion-mp3" },
  // Guitar
  24: { name: "Acoustic Guitar (nylon)", folder: "acoustic_guitar_nylon-mp3" },
  25: { name: "Acoustic Guitar (steel)", folder: "acoustic_guitar_steel-mp3" },
  26: { name: "Electric Guitar (jazz)", folder: "electric_guitar_jazz-mp3" },
  27: { name: "Electric Guitar (clean)", folder: "electric_guitar_clean-mp3" },
  28: { name: "Electric Guitar (muted)", folder: "electric_guitar_muted-mp3" },
  29: { name: "Overdriven Guitar", folder: "overdriven_guitar-mp3" },
  30: { name: "Distortion Guitar", folder: "distortion_guitar-mp3" },
  31: { name: "Guitar Harmonics", folder: "guitar_harmonics-mp3" },
  // Bass
  32: { name: "Acoustic Bass", folder: "acoustic_bass-mp3" },
  33: { name: "Electric Bass (finger)", folder: "electric_bass_finger-mp3" },
  34: { name: "Electric Bass (pick)", folder: "electric_bass_pick-mp3" },
  35: { name: "Fretless Bass", folder: "fretless_bass-mp3" },
  36: { name: "Slap Bass 1", folder: "slap_bass_1-mp3" },
  37: { name: "Slap Bass 2", folder: "slap_bass_2-mp3" },
  38: { name: "Synth Bass 1", folder: "synth_bass_1-mp3" },
  39: { name: "Synth Bass 2", folder: "synth_bass_2-mp3" },
  // Strings
  40: { name: "Violin", folder: "violin-mp3" },
  41: { name: "Viola", folder: "viola-mp3" },
  42: { name: "Cello", folder: "cello-mp3" },
  43: { name: "Contrabass", folder: "contrabass-mp3" },
  44: { name: "Tremolo Strings", folder: "tremolo_strings-mp3" },
  45: { name: "Pizzicato Strings", folder: "pizzicato_strings-mp3" },
  46: { name: "Orchestral Harp", folder: "orchestral_harp-mp3" },
  47: { name: "Timpani", folder: "timpani-mp3" },
  // Popular selections for common use
  48: { name: "String Ensemble 1", folder: "string_ensemble_1-mp3" },
  49: { name: "String Ensemble 2", folder: "string_ensemble_2-mp3" },
  56: { name: "Trumpet", folder: "trumpet-mp3" },
  57: { name: "Trombone", folder: "trombone-mp3" },
  58: { name: "Tuba", folder: "tuba-mp3" },
  64: { name: "Soprano Sax", folder: "soprano_sax-mp3" },
  65: { name: "Alto Sax", folder: "alto_sax-mp3" },
  66: { name: "Tenor Sax", folder: "tenor_sax-mp3" },
  67: { name: "Baritone Sax", folder: "baritone_sax-mp3" },
  68: { name: "Oboe", folder: "oboe-mp3" },
  69: { name: "English Horn", folder: "english_horn-mp3" },
  70: { name: "Bassoon", folder: "bassoon-mp3" },
  71: { name: "Clarinet", folder: "clarinet-mp3" },
  72: { name: "Piccolo", folder: "piccolo-mp3" },
  73: { name: "Flute", folder: "flute-mp3" },
  74: { name: "Recorder", folder: "recorder-mp3" }
}, Qt = [
  "https://raw.githubusercontent.com/jmonlabs/midi-js-soundfonts/gh-pages/FluidR3_GM",
  "https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@gh-pages/FluidR3_GM"
];
function Ct(c, t = Qt[0], e = [21, 108], n = "complete") {
  const r = St[c];
  if (!r)
    return console.warn(
      `GM program ${c} not found, using Acoustic Grand Piano`
    ), Ct(0, t, e);
  const o = {}, [i, s] = e;
  let a = [];
  switch (n) {
    case "minimal":
      for (let l = i; l <= s; l += 12)
        a.push(l);
      a.push(60);
      break;
    case "balanced":
      for (let l = i; l <= s; l += 4)
        a.push(l);
      [60, 64, 67].forEach((l) => {
        l >= i && l <= s && !a.includes(l) && a.push(l);
      });
      break;
    case "quality":
      for (let l = i; l <= s; l += 3)
        a.push(l);
      break;
    case "complete":
      for (let l = i; l <= s; l++)
        a.push(l);
      break;
    default:
      return console.warn(`Unknown sampling strategy '${n}', using 'balanced'`), Ct(c, t, e, "balanced");
  }
  a = [...new Set(a)].sort((l, u) => l - u);
  for (const l of a) {
    const u = Wn(l);
    o[u] = Jn(r.folder, u, t);
  }
  return console.log(
    `[GM INSTRUMENT] Generated ${Object.keys(o).length} sample URLs for ${r.name} (${n} strategy)`
  ), o;
}
function Jn(c, t, e) {
  return `${e}/${c}/${t}.mp3`;
}
function Wn(c) {
  const t = [
    "C",
    "Db",
    "D",
    "Eb",
    "E",
    "F",
    "Gb",
    "G",
    "Ab",
    "A",
    "Bb",
    "B"
  ], e = Math.floor(c / 12) - 1, n = c % 12;
  return `${t[n]}${e}`;
}
function Ee(c) {
  const t = c.toLowerCase().trim();
  for (const [e, n] of Object.entries(St))
    if (n.name.toLowerCase() === t)
      return parseInt(e, 10);
  for (const [e, n] of Object.entries(St)) {
    const r = n.name.toLowerCase();
    if (r.includes(t) || t.includes(r.split(" ")[0]))
      return parseInt(e, 10);
  }
  return null;
}
function Hn(c, t, e = {}, n = "destination") {
  let r;
  if (typeof t == "string") {
    if (r = Ee(t), r === null) {
      console.warn(`GM instrument "${t}" not found. Available instruments:`);
      const u = Object.values(St).map((d) => d.name).slice(0, 10);
      console.warn(`Examples: ${u.join(", ")}...`), console.warn("Using Acoustic Grand Piano as fallback"), r = 0;
    }
  } else
    r = t;
  if (!St[r]) return null;
  const {
    baseUrl: i = Qt[0],
    noteRange: s = [21, 108],
    // Complete MIDI range for maximum quality
    envelope: a = { attack: 0.1, release: 1 },
    strategy: l = "complete"
    // Use complete sampling by default
  } = e;
  return {
    id: c,
    type: "Sampler",
    options: {
      urls: Ct(r, i, s, l),
      baseUrl: "",
      // URLs are already complete
      envelope: {
        enabled: !0,
        attack: a.attack,
        release: a.release
      }
    },
    target: n
  };
}
function Pe() {
  return [
    // Piano & Keys
    { program: 0, name: "Acoustic Grand Piano", category: "Piano" },
    { program: 1, name: "Bright Acoustic Piano", category: "Piano" },
    { program: 4, name: "Electric Piano 1", category: "Piano" },
    { program: 6, name: "Harpsichord", category: "Piano" },
    // Strings
    { program: 40, name: "Violin", category: "Strings" },
    { program: 42, name: "Cello", category: "Strings" },
    { program: 48, name: "String Ensemble 1", category: "Strings" },
    // Brass
    { program: 56, name: "Trumpet", category: "Brass" },
    { program: 57, name: "Trombone", category: "Brass" },
    // Woodwinds
    { program: 65, name: "Alto Sax", category: "Woodwinds" },
    { program: 71, name: "Clarinet", category: "Woodwinds" },
    { program: 73, name: "Flute", category: "Woodwinds" },
    // Guitar & Bass
    { program: 24, name: "Acoustic Guitar (nylon)", category: "Guitar" },
    { program: 25, name: "Acoustic Guitar (steel)", category: "Guitar" },
    { program: 33, name: "Electric Bass (finger)", category: "Bass" },
    // Organ & Accordion
    { program: 16, name: "Drawbar Organ", category: "Organ" },
    { program: 21, name: "Accordion", category: "Organ" }
  ];
}
const Kn = [
  "Reverb",
  "JCReverb",
  "Freeverb"
], Qn = [
  "Delay",
  "FeedbackDelay",
  "PingPongDelay"
], Xn = [
  "Chorus",
  "Phaser",
  "Tremolo",
  "Vibrato",
  "AutoWah"
], Zn = [
  "Distortion",
  "Chebyshev",
  "BitCrusher"
], tr = [
  "Compressor",
  "Limiter",
  "Gate",
  "MidSideCompressor"
], er = [
  "Filter",
  "AutoFilter"
], nr = [
  "FrequencyShifter",
  "PitchShift",
  "StereoWidener"
], rr = [
  ...Kn,
  ...Qn,
  ...Xn,
  ...Zn,
  ...tr,
  ...er,
  ...nr
], or = [
  "Synth",
  "PolySynth",
  "MonoSynth",
  "AMSynth",
  "FMSynth",
  "DuoSynth",
  "PluckSynth",
  "NoiseSynth"
], de = {
  MAX_WIDTH: 800,
  MIN_WIDTH: 0
}, qt = {
  MARGIN: "8px 0",
  GAP: 12,
  UPDATE_INTERVAL: 100
  // ms between timeline updates
}, ir = {}, sr = {
  DEFAULT_TEMPO: 120
}, Gt = {
  INVALID_COMPOSITION: "Composition must be a valid JMON object",
  NO_SEQUENCES_OR_TRACKS: "Composition must have sequences or tracks",
  TRACKS_MUST_BE_ARRAY: "Tracks/sequences must be an array"
}, Yt = {
  PLAYER: "[PLAYER]"
};
function Xt(c, t = {}) {
  if (!c || typeof c != "object")
    throw console.error(`${Yt.PLAYER} Invalid composition:`, c), new Error(Gt.INVALID_COMPOSITION);
  const {
    autoplay: e = !1,
    showDebug: n = !1,
    customInstruments: r = {},
    autoMultivoice: o = !0,
    maxVoices: i = 4,
    Tone: s = null
  } = t;
  if (!c.sequences && !c.tracks)
    throw console.error(
      `${Yt.PLAYER} No sequences or tracks found in composition:`,
      c
    ), new Error(Gt.NO_SEQUENCES_OR_TRACKS);
  const a = c.tracks || c.sequences || [];
  if (!Array.isArray(a))
    throw console.error(`${Yt.PLAYER} Tracks/sequences must be an array:`, a), new Error(Gt.TRACKS_MUST_BE_ARRAY);
  const l = c.tempo || c.bpm || sr.DEFAULT_TEMPO, d = Ae(c, { autoMultivoice: o, maxVoices: i, showDebug: n }), { tracks: m, metadata: p } = d;
  let g = p.totalDuration;
  const f = ir, C = document.createElement("div");
  C.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        background-color: ${f.background};
        color: ${f.text};
        padding: 16px 16px 8px 16px;
        border-radius: 12px;
        width: 100%;
        max-width: ${de.MAX_WIDTH}px;
        min-width: ${de.MIN_WIDTH};
        border: 1px solid ${f.border};
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
    `;
  const it = document.createElement("style");
  it.textContent = `
        /* iOS audio improvements */
        .jmon-music-player-container {
            -webkit-user-select: none;
            -webkit-touch-callout: none;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
        }
        .jmon-music-player-play {
            -webkit-user-select: none;
            -webkit-touch-callout: none;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
        }
        
        /* Button hover effects */
        .jmon-music-player-btn-vertical:hover {
            background-color: #555555 !important;
            transform: translateY(-1px);
        }
        .jmon-music-player-btn-vertical:active {
            transform: translateY(0px);
        }
        
        /* Large screens: Show vertical downloads, hide horizontal ones, horizontal track layout */
        @media (min-width: 600px) {
            .jmon-music-player-downloads {
                display: none !important;
            }
            .jmon-music-player-vertical-downloads {
                display: flex !important;
            }
            .jmon-music-player-top {
                gap: 32px !important;
            }
            .jmon-music-player-right {
                min-width: 140px !important;
                max-width: 160px !important;
            }
            .jmon-track-selector {
                flex-direction: row !important;
                align-items: center !important;
                gap: 16px !important;
            }
            .jmon-track-selector label {
                min-width: 120px !important;
                margin-bottom: 0 !important;
                flex-shrink: 0 !important;
            }
            .jmon-track-selector select {
                flex: 1 !important;
            }
        }
        
        /* Medium screens: Compact layout with horizontal track selectors */
        @media (min-width: 481px) and (max-width: 799px) {
            .jmon-music-player-downloads {
                display: none !important;
            }
            .jmon-music-player-vertical-downloads {
                display: flex !important;
            }
            .jmon-music-player-top {
                gap: 20px !important;
            }
            .jmon-music-player-right {
                min-width: 120px !important;
                max-width: 140px !important;
            }
            .jmon-track-selector {
                flex-direction: row !important;
                align-items: center !important;
                gap: 12px !important;
            }
            .jmon-track-selector label {
                min-width: 100px !important;
                margin-bottom: 0 !important;
                flex-shrink: 0 !important;
                font-size: 14px !important;
            }
            .jmon-track-selector select {
                flex: 1 !important;
            }
        }
        
        /* Small screens: Mobile layout */
        @media (max-width: 480px) {
            .jmon-music-player-downloads {
                display: flex !important;
            }
            .jmon-music-player-vertical-downloads {
                display: none !important;
            }
            .jmon-music-player-container {
                padding: 8px !important;
                border-radius: 8px !important;
                max-width: 100vw !important;
                min-width: 0 !important;
                box-shadow: none !important;
            }
            .jmon-music-player-top {
                flex-direction: column !important;
                gap: 12px !important;
                align-items: stretch !important;
            }
            .jmon-music-player-left, .jmon-music-player-right {
                width: 100% !important;
                min-width: 0 !important;
                max-width: none !important;
                flex: none !important;
            }
            .jmon-music-player-right {
                gap: 12px !important;
            }
            .jmon-track-selector {
                flex-direction: column !important;
                align-items: stretch !important;
                gap: 8px !important;
            }
            .jmon-track-selector label {
                min-width: auto !important;
                margin-bottom: 0 !important;
            }
            .jmon-track-selector select {
                flex: none !important;
            }
            .jmon-music-player-timeline {
                gap: 8px !important;
                margin: 6px 0 !important;
            }
            .jmon-music-player-downloads {
                flex-direction: column !important;
                gap: 8px !important;
                margin-top: 6px !important;
            }
            .jmon-music-player-btn {
                min-height: 40px !important;
                font-size: 14px !important;
                padding: 10px 0 !important;
            }
            .jmon-music-player-play {
                width: 40px !important;
                height: 40px !important;
                min-width: 40px !important;
                max-width: 40px !important;
                padding: 8px !important;
                margin: 0 4px !important;
                border-radius: 50% !important;
                flex-shrink: 0 !important;
            }
            .jmon-music-player-stop {
                width: 40px !important;
                height: 40px !important;
                min-width: 40px !important;
                max-width: 40px !important;
                padding: 8px !important;
                margin: 0 4px !important;
                flex-shrink: 0 !important;
            }
        }
    `, document.head.appendChild(it), C.classList.add("jmon-music-player-container");
  const et = document.createElement("div");
  et.style.cssText = `
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto auto;
        gap: 12px;
        margin-bottom: 0px;
        font-family: 'PT Sans', sans-serif;
    `, et.classList.add("jmon-music-player-main");
  const O = document.createElement("div");
  O.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        font-family: 'PT Sans', sans-serif;
        gap: 24px;
        flex-wrap: wrap;
    `, O.classList.add("jmon-music-player-top");
  const J = document.createElement("div");
  J.style.cssText = `
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
        box-sizing: border-box;
    `, J.classList.add("jmon-music-player-left");
  const st = document.createElement("div");
  st.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 6px;
    `;
  const S = Pe(), j = c.tracks || [], I = [];
  j.forEach((x, k) => {
    const T = m.find(
      (ot) => ot.originalTrackIndex === k
    )?.analysis;
    T?.hasGlissando && console.warn(
      `Track ${x.label || x.name || k + 1} contient un glissando : la polyphonie sera désactivée pour cette piste.`
    );
    const R = document.createElement("div");
    R.style.cssText = `
            margin-bottom: 8px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        `, R.classList.add("jmon-track-selector");
    const q = document.createElement("label");
    q.textContent = x.label || `Track ${k + 1}`, q.style.cssText = `
            font-family: 'PT Sans', sans-serif;
            font-size: 16px;
            color: ${f.text};
            display: block;
            margin-bottom: 0;
            font-weight: normal;
            flex-shrink: 0;
        `;
    const H = document.createElement("select");
    H.style.cssText = `
            padding: 4px;
            border: 1px solid ${f.secondary};
            border-radius: 4px;
            background-color: ${f.background};
            color: ${f.text};
            font-size: 12px;
            width: 100%;
            height: 28px;
            box-sizing: border-box;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            margin: 0;
            outline: none;
        `;
    const ut = document.createElement("optgroup");
    ut.label = "Synthesizers";
    const lt = [
      "PolySynth",
      "Synth",
      "AMSynth",
      "DuoSynth",
      "FMSynth",
      "MembraneSynth",
      "MetalSynth",
      "MonoSynth",
      "PluckSynth"
    ], pt = c.audioGraph || [];
    if (Array.isArray(pt) && pt.length > 0) {
      const ot = c.tracks?.[k]?.synthRef;
      pt.forEach(($) => {
        if ($.id && $.type && $.type !== "Destination") {
          const ht = document.createElement("option");
          ht.value = `AudioGraph: ${$.id}`, ht.textContent = $.id, ot === $.id && (ht.selected = !0), ut.appendChild(ht);
        }
      });
    }
    lt.forEach((ot) => {
      const $ = document.createElement("option");
      $.value = ot, $.textContent = ot, (T?.hasGlissando && ot === "Synth" || !T?.hasGlissando && !c.tracks?.[k]?.synthRef && ot === "PolySynth") && ($.selected = !0), T?.hasGlissando && (ot === "PolySynth" || ot === "DuoSynth") && ($.disabled = !0, $.textContent += " (mono only for glissando)"), ut.appendChild($);
    }), H.appendChild(ut);
    const xt = document.createElement("optgroup");
    xt.label = "Sampled Instruments";
    const mt = {};
    S.forEach((ot) => {
      mt[ot.category] || (mt[ot.category] = []), mt[ot.category].push(ot);
    }), Object.keys(mt).sort().forEach((ot) => {
      const $ = document.createElement("optgroup");
      $.label = ot, mt[ot].forEach((ht) => {
        const G = document.createElement("option");
        G.value = `GM: ${ht.name}`, G.textContent = ht.name, T?.hasGlissando && (G.disabled = !0, G.textContent += " (not suitable for glissando)"), $.appendChild(G);
      }), H.appendChild($);
    }), I.push(H), R.append(q, H), st.appendChild(R);
  }), J.appendChild(st);
  const F = document.createElement("div");
  F.style.cssText = `
        display: flex;
        flex-direction: column;
        min-width: 120px;
        max-width: 150px;
        box-sizing: border-box;
        gap: 16px;
    `, F.classList.add("jmon-music-player-right");
  const N = document.createElement("div");
  N.style.cssText = `
        display: flex;
        flex-direction: column;
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
    `;
  const L = document.createElement("label");
  L.textContent = "Tempo", L.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        font-size: 16px;
        font-weight: normal;
        margin-bottom: 8px;
        color: ${f.text};
    `;
  const z = document.createElement("input");
  z.type = "number", z.min = 60, z.max = 240, z.value = l, z.style.cssText = `
        padding: 4px;
        border: 1px solid ${f.secondary};
        border-radius: 4px;
        background-color: ${f.background};
        color: ${f.text};
        font-size: 12px;
        text-align: center;
        width: 100%;
        height: 28px;
        box-sizing: border-box;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        margin: 0;
        outline: none;
    `, N.append(L, z);
  const Y = document.createElement("div");
  Y.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 8px;
    `, Y.classList.add("jmon-music-player-vertical-downloads");
  const W = document.createElement("button");
  W.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music" style="margin-right: 8px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg><span>MIDI</span>', W.style.cssText = `
        padding: 12px 16px;
        border: none;
        border-radius: 8px;
        background-color: #333333;
        color: white;
        font-family: 'PT Sans', sans-serif;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        box-sizing: border-box;
    `, W.classList.add("jmon-music-player-btn-vertical");
  const U = document.createElement("button");
  U.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-audio-lines" style="margin-right: 8px;"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg><span>WAV</span>', U.style.cssText = `
        padding: 12px 16px;
        border: none;
        border-radius: 8px;
        background-color: #333333;
        color: white;
        font-family: 'PT Sans', sans-serif;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        box-sizing: border-box;
    `, U.classList.add("jmon-music-player-btn-vertical"), Y.append(W, U), Y.style.display = "none", F.append(N, Y);
  const D = document.createElement("div");
  D.style.cssText = `
        position: relative;
        width: 100%;
        margin: ${qt.MARGIN};
        display: flex;
        align-items: center;
        gap: ${qt.GAP}px;
        min-width: 0;
        box-sizing: border-box;
    `, D.classList.add("jmon-music-player-timeline");
  const Z = document.createElement("div");
  Z.textContent = "0:00", Z.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        font-size: 14px;
        color: ${f.text};
        min-width: 40px;
        text-align: center;
    `;
  const K = document.createElement("div");
  K.textContent = "0:00", K.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        font-size: 14px;
        color: ${f.text};
        min-width: 40px;
        text-align: center;
    `;
  const Q = document.createElement("input");
  Q.type = "range", Q.min = 0, Q.max = 100, Q.value = 0, Q.style.cssText = `
        flex-grow: 1;
        -webkit-appearance: none;
        background: ${f.secondary};
        outline: none;
        border-radius: 15px;
        overflow: visible;
        height: 8px;
    `;
  const vt = document.createElement("style");
  vt.textContent = `
        input[type="range"].jmon-timeline-slider {
            background: ${f.secondary} !important;
            border: 1px solid ${f.border} !important;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.1) !important;
        }
        input[type="range"].jmon-timeline-slider::-webkit-slider-track {
            background: ${f.secondary} !important;
            height: 8px !important;
            border-radius: 15px !important;
            border: 1px solid ${f.border} !important;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.1) !important;
        }
        input[type="range"].jmon-timeline-slider::-moz-range-track {
            background: ${f.secondary} !important;
            height: 8px !important;
            border-radius: 15px !important;
            border: 1px solid ${f.border} !important;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.1) !important;
        }
        input[type="range"].jmon-timeline-slider::-webkit-slider-thumb {
            -webkit-appearance: none !important;
            appearance: none !important;
            height: 20px !important;
            width: 20px !important;
            border-radius: 50% !important;
            background: ${f.primary} !important;
            cursor: pointer !important;
            border: 2px solid ${f.background} !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
        }
        input[type="range"].jmon-timeline-slider::-moz-range-thumb {
            height: 20px !important;
            width: 20px !important;
            border-radius: 50% !important;
            background: ${f.primary} !important;
            cursor: pointer !important;
            border: 2px solid ${f.background} !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
        }
    `, document.head.appendChild(vt), Q.classList.add("jmon-timeline-slider");
  const tt = document.createElement("button");
  tt.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>', tt.style.cssText = `
        width: 40px;
        height: 40px;
        min-width: 40px;
        max-width: 40px;
        padding: 8px;
        border: none;
        border-radius: 50%;
        background-color: ${f.primary};
        color: ${f.background};
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0px 5px 0px 10px;
        box-sizing: border-box;
        flex-shrink: 0;
    `, tt.classList.add("jmon-music-player-play");
  const E = document.createElement("button");
  E.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>', E.style.cssText = `
        width: 40px;
        height: 40px;
        min-width: 40px;
        max-width: 40px;
        padding: 8px;
        border: none;
        border-radius: 8px;
        background-color: ${f.secondary};
        color: ${f.text};
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0px 5px 0px 0px;
        box-sizing: border-box;
        flex-shrink: 0;
    `, E.classList.add("jmon-music-player-stop");
  const y = document.createElement("div");
  y.style.cssText = `
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: ${f.lightText};
        margin: 0px 0px 0px 10px;
    `;
  const v = document.createElement("div");
  v.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0px;
    `, v.append(tt, E), D.append(Z, Q, K, v);
  const A = document.createElement("div");
  A.style.cssText = `
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        gap: 10px;
        min-width: 0;
        box-sizing: border-box;
    `, A.classList.add("jmon-music-player-downloads");
  const b = document.createElement("button");
  b.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music" style="margin-right: 5px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg><span>MIDI</span>', b.style.cssText = `
        padding: 15px 30px;
        margin: 0 5px;
        border: none;
        border-radius: 8px;
        background-color: #333333;
        color: white;
        font-family: 'PT Sans', sans-serif;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.3s ease;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 50px;
        min-width: 0;
        box-sizing: border-box;
    `, b.classList.add("jmon-music-player-btn");
  const w = document.createElement("button");
  w.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-audio-lines" style="margin-right: 5px;"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg><span>WAV</span>', w.style.cssText = `
        padding: 15px 30px;
        margin: 0 5px;
        border: none;
        border-radius: 8px;
        background-color: #333333;
        color: white;
        font-family: 'PT Sans', sans-serif;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.3s ease;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 50px;
        min-width: 0;
        box-sizing: border-box;
    `, w.classList.add("jmon-music-player-btn"), A.append(b, w), O.append(J, F), et.appendChild(O), et.appendChild(D), C.append(
    et,
    A
  );
  let h, B = !1, nt = [], V = [], _ = [], P = null;
  const rt = c.tracks || [], dt = () => {
    if (!h || !c.audioGraph || !Array.isArray(c.audioGraph))
      return null;
    const x = {}, k = (T) => {
      const R = {};
      return Object.entries(T || {}).forEach(([q, H]) => {
        let ut = q;
        if (typeof q == "number" || /^\d+$/.test(String(q)))
          try {
            ut = h.Frequency(parseInt(q, 10), "midi").toNote();
          } catch {
          }
        R[ut] = H;
      }), R;
    };
    try {
      return c.audioGraph.forEach((T) => {
        const { id: R, type: q, options: H = {}, target: ut } = T;
        if (!R || !q) return;
        let lt = null;
        if (q === "Sampler") {
          const pt = k(H.urls);
          let xt, mt;
          const ot = new Promise((ht, G) => {
            xt = ht, mt = G;
          }), $ = {
            urls: pt,
            onload: () => xt && xt(),
            onerror: (ht) => {
              console.error(`[PLAYER] Sampler load error for ${R}:`, ht), mt && mt(ht);
            }
          };
          H.baseUrl && ($.baseUrl = H.baseUrl);
          try {
            console.log(
              `[PLAYER] Building Sampler ${R} with urls:`,
              pt,
              "baseUrl:",
              $.baseUrl || "(none)"
            ), lt = new h.Sampler($);
          } catch (ht) {
            console.error("[PLAYER] Failed to create Sampler:", ht), lt = null;
          }
          _.push(ot), lt && H.envelope && H.envelope.enabled && (typeof H.envelope.attack == "number" && (lt.attack = H.envelope.attack), typeof H.envelope.release == "number" && (lt.release = H.envelope.release));
        } else if (or.includes(q))
          try {
            lt = new h[q](H);
          } catch (pt) {
            console.warn(
              `[PLAYER] Failed to create ${q} from audioGraph, using PolySynth:`,
              pt
            ), lt = new h.PolySynth();
          }
        else if (rr.includes(q))
          try {
            lt = new h[q](H), console.log(`[PLAYER] Created effect ${R} (${q}) with options:`, H);
          } catch (pt) {
            console.warn(`[PLAYER] Failed to create ${q} effect:`, pt), lt = null;
          }
        else q === "Destination" && (x[R] = h.Destination);
        lt && (x[R] = lt);
      }), Object.keys(x).length > 0 && c.audioGraph.forEach((T) => {
        const { id: R, target: q } = T;
        if (!R || !x[R]) return;
        const H = x[R];
        if (H !== h.Destination)
          if (q && x[q])
            try {
              x[q] === h.Destination ? (H.toDestination(), console.log(`[PLAYER] Connected ${R} -> Destination`)) : (H.connect(x[q]), console.log(`[PLAYER] Connected ${R} -> ${q}`));
            } catch (ut) {
              console.warn(`[PLAYER] Failed to connect ${R} -> ${q}:`, ut), H.toDestination();
            }
          else
            H.toDestination(), console.log(`[PLAYER] Connected ${R} -> Destination (no target specified)`);
      }), x;
    } catch (T) {
      return console.error("[PLAYER] Failed building audioGraph instruments:", T), null;
    }
  }, gt = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1, Mt = (x) => `${Math.floor(x / 60)}:${Math.floor(x % 60).toString().padStart(2, "0")}`;
  K.textContent = Mt(g);
  const ne = async () => {
    if (typeof window < "u") {
      const x = s || window.Tone || (typeof h < "u" ? h : null);
      if (x)
        console.log(
          "[PLAYER] Using existing Tone.js, version:",
          x.version || "unknown"
        ), window.Tone = x;
      else
        try {
          if (typeof require < "u") {
            console.log("[PLAYER] Loading Tone.js via require()...");
            const T = await require("tone@14.8.49/build/Tone.js");
            window.Tone = T.default || T.Tone || T;
          } else {
            console.log("[PLAYER] Loading Tone.js via import()...");
            const T = await import("https://esm.sh/tone@14.8.49");
            window.Tone = T.default || T.Tone || T;
          }
          if (!window.Tone || typeof window.Tone != "object" || !window.Tone.PolySynth) {
            console.warn(
              "[PLAYER] First load attempt failed, trying alternative CDN..."
            );
            try {
              const T = await import("https://cdn.skypack.dev/tone@14.8.49");
              if (window.Tone = T.default || T.Tone || T, !window.Tone || !window.Tone.PolySynth)
                throw new Error("Alternative CDN also failed");
            } catch {
              console.warn(
                "[PLAYER] Alternative CDN failed, trying jsdelivr..."
              );
              try {
                const R = await import("https://cdn.jsdelivr.net/npm/tone@14.8.49/build/Tone.js");
                if (window.Tone = R.default || R.Tone || R, !window.Tone || !window.Tone.PolySynth)
                  throw new Error("All CDN attempts failed");
              } catch {
                throw new Error(
                  "Loaded Tone.js but got invalid object from all CDNs"
                );
              }
            }
          }
          console.log(
            "[PLAYER] Tone.js loaded successfully, version:",
            window.Tone.version || "unknown"
          );
        } catch (T) {
          return console.warn("Could not auto-load Tone.js:", T.message), console.log(
            "To use the player, load Tone.js manually first using one of these methods:"
          ), console.log(
            'Method 1: Tone = await require("tone@14.8.49/build/Tone.js")'
          ), console.log(
            'Method 2: Tone = await import("https://esm.sh/tone@14.8.49").then(m => m.default)'
          ), console.log(
            'Method 3: Tone = await import("https://cdn.skypack.dev/tone@14.8.49").then(m => m.default)'
          ), !1;
        }
      const k = window.Tone || x;
      if (k)
        return h = k, console.log("[PLAYER] Available Tone constructors:", {
          PolySynth: typeof h.PolySynth,
          Synth: typeof h.Synth,
          Part: typeof h.Part,
          Transport: typeof h.Transport,
          start: typeof h.start,
          context: !!h.context
        }), console.log(
          "[PLAYER] Tone.js initialized, context state:",
          h.context ? h.context.state : "no context"
        ), gt() && console.log("[PLAYER] iOS device detected - audio context will start on user interaction"), !0;
    }
    return console.warn("Tone.js not available"), !1;
  }, Rt = () => {
    if (!h) {
      console.warn("[PLAYER] Tone.js not available, cannot setup audio");
      return;
    }
    const x = [];
    if (h.PolySynth || x.push("PolySynth"), h.Synth || x.push("Synth"), h.Part || x.push("Part"), h.Transport || x.push("Transport"), x.length > 0) {
      console.error(
        "[PLAYER] Tone.js is missing required constructors:",
        x
      ), console.error(
        "[PLAYER] Available Tone properties:",
        Object.keys(h).filter((k) => typeof h[k] == "function").slice(
          0,
          20
        )
      ), console.error("[PLAYER] Tone object:", h), console.error(
        "[PLAYER] This usually means Tone.js did not load correctly. Try refreshing the page or loading Tone.js manually."
      );
      return;
    }
    if (h.Transport.bpm.value = p.tempo, console.log(
      `[PLAYER] Set Transport BPM to ${p.tempo} before building instruments`
    ), !P && (P = dt(), P)) {
      const k = Object.keys(P).filter(
        (T) => P[T] && P[T].name === "Sampler"
      );
      k.length > 0 && console.log(
        "[PLAYER] Using audioGraph Samplers for tracks with synthRef:",
        k
      );
    }
    console.log("[PLAYER] Cleaning up existing audio...", {
      synths: nt.length,
      parts: V.length
    }), h.Transport.stop(), h.Transport.position = 0, V.forEach((k, T) => {
      try {
        k.stop();
      } catch (R) {
        console.warn(`[PLAYER] Failed to stop part ${T}:`, R);
      }
    }), V.forEach((k, T) => {
      try {
        k.dispose();
      } catch (R) {
        console.warn(`[PLAYER] Failed to dispose part ${T}:`, R);
      }
    }), nt.forEach((k, T) => {
      if (!P || !Object.values(P).includes(k))
        try {
          k.disconnect && typeof k.disconnect == "function" && k.disconnect(), k.dispose();
        } catch (R) {
          console.warn(`[PLAYER] Failed to dispose synth ${T}:`, R);
        }
    }), nt = [], V = [], console.log("[PLAYER] Audio cleanup completed"), console.log("[PLAYER] Converted tracks:", m.length), m.forEach((k) => {
      const {
        originalTrackIndex: T,
        voiceIndex: R,
        totalVoices: q,
        trackInfo: H,
        synthConfig: ut,
        partEvents: lt
      } = k, xt = (rt[T] || {}).synthRef, mt = 60 / p.tempo, ot = (lt || []).map((G) => {
        const M = typeof G.time == "number" ? G.time * mt : G.time, X = typeof G.duration == "number" ? G.duration * mt : G.duration;
        return { ...G, time: M, duration: X };
      });
      let $ = null;
      if (xt && P && P[xt])
        $ = P[xt];
      else {
        const G = I[T] ? I[T].value : ut.type;
        try {
          if (G.startsWith("AudioGraph: ")) {
            const M = G.substring(12);
            if (P && P[M])
              $ = P[M], console.log(
                `[PLAYER] Using audioGraph instrument: ${M}`
              );
            else
              throw new Error(
                `AudioGraph instrument ${M} not found`
              );
          } else if (G.startsWith("GM: ")) {
            const M = G.substring(4), X = S.find(
              (at) => at.name === M
            );
            if (X) {
              console.log(`[PLAYER] Loading GM instrument: ${M}`);
              const at = Ct(
                X.program,
                Qt[0],
                [36, 84],
                "balanced"
              );
              console.log(
                `[PLAYER] Loading GM instrument ${M} with ${Object.keys(at).length} samples`
              ), console.log(
                "[PLAYER] Sample notes:",
                Object.keys(at).sort()
              ), $ = new h.Sampler({
                urls: at,
                onload: () => console.log(
                  `[PLAYER] GM instrument ${M} loaded successfully`
                ),
                onerror: (ft) => {
                  console.error(
                    `[PLAYER] Failed to load GM instrument ${M}:`,
                    ft
                  );
                }
              }).toDestination();
            } else
              throw new Error(`GM instrument ${M} not found`);
          } else {
            const M = ut.reason === "glissando_compatibility" ? ut.type : G;
            if (!h[M] || typeof h[M] != "function")
              throw new Error(`Tone.${M} is not a constructor`);
            $ = new h[M]().toDestination(), ut.reason === "glissando_compatibility" && R === 0 && console.warn(
              `[MULTIVOICE] Using ${M} instead of ${ut.original} for glissando in ${H.label}`
            );
          }
        } catch (M) {
          console.warn(
            `Failed to create ${G}, using PolySynth:`,
            M
          );
          try {
            if (!h.PolySynth || typeof h.PolySynth != "function")
              throw new Error("Tone.PolySynth is not available");
            $ = new h.PolySynth().toDestination();
          } catch (X) {
            console.error(
              "Fatal: Cannot create any synth, Tone.js may not be properly loaded:",
              X
            );
            return;
          }
        }
      }
      nt.push($), q > 1 && console.log(
        `[MULTIVOICE] Track "${H.label}" voice ${R + 1}: ${lt.length} notes`
      );
      const ht = new h.Part((G, M) => {
        if (Array.isArray(M.pitch))
          M.pitch.forEach((X) => {
            let at = "C4";
            typeof X == "number" ? at = h.Frequency(X, "midi").toNote() : typeof X == "string" ? at = X : Array.isArray(X) && typeof X[0] == "string" && (at = X[0]), $.triggerAttackRelease(at, M.duration, G);
          });
        else if (M.articulation === "glissando" && M.glissTarget !== void 0) {
          let X = typeof M.pitch == "number" ? h.Frequency(M.pitch, "midi").toNote() : M.pitch, at = typeof M.glissTarget == "number" ? h.Frequency(M.glissTarget, "midi").toNote() : M.glissTarget;
          console.log("[PLAYER] Glissando", {
            fromNote: X,
            toNote: at,
            duration: M.duration,
            time: G
          }), console.log(
            "[PLAYER] Glissando effect starting from",
            X,
            "to",
            at
          ), $.triggerAttack(X, G, M.velocity || 0.8);
          const ft = h.Frequency(X).toFrequency(), ae = h.Frequency(at).toFrequency(), ce = 1200 * Math.log2(ae / ft);
          if ($.detune && $.detune.setValueAtTime && $.detune.linearRampToValueAtTime)
            $.detune.setValueAtTime(0, G), $.detune.linearRampToValueAtTime(
              ce,
              G + M.duration
            ), console.log(
              "[PLAYER] Applied detune glissando:",
              ce,
              "cents over",
              M.duration,
              "beats"
            );
          else {
            const Le = h.Frequency(X).toMidi(), Fe = h.Frequency(at).toMidi(), jt = Math.max(3, Math.abs(Fe - Le)), le = M.duration / jt;
            for (let $t = 1; $t < jt; $t++) {
              const De = $t / (jt - 1), _e = ft * Math.pow(ae / ft, De), Oe = h.Frequency(_e).toNote(), ze = G + $t * le;
              $.triggerAttackRelease(
                Oe,
                le * 0.8,
                ze,
                (M.velocity || 0.8) * 0.7
              );
            }
            console.log(
              "[PLAYER] Applied chromatic glissando with",
              jt,
              "steps"
            );
          }
          $.triggerRelease(G + M.duration);
        } else {
          let X = "C4";
          typeof M.pitch == "number" ? X = h.Frequency(M.pitch, "midi").toNote() : typeof M.pitch == "string" ? X = M.pitch : Array.isArray(M.pitch) && typeof M.pitch[0] == "string" && (X = M.pitch[0]);
          let at = M.duration, ft = M.velocity || 0.8;
          M.articulation === "staccato" && (at = M.duration * 0.5), M.articulation === "accent" && (ft = Math.min(ft * 2, 1)), M.articulation === "tenuto" && (at = M.duration * 1.5, ft = Math.min(ft * 1.3, 1)), $.triggerAttackRelease(
            X,
            at,
            G,
            ft
          );
        }
      }, ot);
      V.push(ht);
    }), h.Transport.loopEnd = g, h.Transport.loop = !0, h.Transport.stop(), h.Transport.position = 0, K.textContent = Mt(g);
  };
  let Ot = 0;
  const Ie = qt.UPDATE_INTERVAL, re = () => {
    const x = performance.now(), k = x - Ot >= Ie;
    if (h && B) {
      const T = typeof h.Transport.loopEnd == "number" ? h.Transport.loopEnd : h.Time(h.Transport.loopEnd).toSeconds();
      if (k) {
        const R = h.Transport.seconds % T, q = R / T * 100;
        Q.value = Math.min(q, 100), Z.textContent = Mt(R), K.textContent = Mt(T), Ot = x;
      }
      if (h.Transport.state === "started" && B)
        requestAnimationFrame(re);
      else if (h.Transport.state === "stopped" || h.Transport.state === "paused") {
        if (k) {
          const R = h.Transport.seconds % T, q = R / T * 100;
          Q.value = Math.min(q, 100), Z.textContent = Mt(R), Ot = x;
        }
        h.Transport.state === "stopped" && (h.Transport.seconds = 0, Q.value = 0, Z.textContent = Mt(0), B = !1, tt.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>');
      }
    }
  };
  tt.addEventListener("click", async () => {
    if (!h)
      if (await ne())
        Rt();
      else {
        console.error("[PLAYER] Failed to initialize Tone.js");
        return;
      }
    if (B)
      console.log("[PLAYER] Pausing playback..."), h.Transport.pause(), B = !1, tt.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>', console.log("[PLAYER] Playback paused");
    else {
      if (!h.context || h.context.state !== "running")
        try {
          await h.start(), console.log(
            "[PLAYER] Audio context started:",
            h.context ? h.context.state : "unknown"
          ), h.context && typeof h.context.resume == "function" && (await h.context.resume(), console.log("[PLAYER] Audio context resumed for iOS compatibility"));
        } catch (x) {
          console.error("[PLAYER] Failed to start audio context:", x);
          let k = "Failed to start audio. ";
          gt() ? k += "On iOS, please ensure your device isn't in silent mode and try again." : k += "Please check your audio settings and try again.", alert(k);
          return;
        }
      if (nt.length === 0 && (console.log("[PLAYER] No synths found, setting up audio..."), Rt()), h.Transport.state !== "paused" ? (h.Transport.stop(), h.Transport.position = 0, console.log("[PLAYER] Starting from beginning")) : console.log("[PLAYER] Resuming from paused position"), console.log(
        "[PLAYER] Transport state before start:",
        h.Transport.state
      ), console.log(
        "[PLAYER] Transport position reset to:",
        h.Transport.position
      ), console.log(
        "[PLAYER] Audio context state:",
        h.context ? h.context.state : "unknown"
      ), console.log("[PLAYER] Parts count:", V.length), console.log("[PLAYER] Synths count:", nt.length), P) {
        const x = Object.values(P).filter(
          (k) => k && k.name === "Sampler"
        );
        if (x.length > 0 && _.length > 0) {
          console.log(
            `[PLAYER] Waiting for ${x.length} sampler(s) to load...`
          );
          try {
            await Promise.all(_), console.log("[PLAYER] All samplers loaded.");
          } catch (k) {
            console.warn("[PLAYER] Sampler load wait error:", k);
            return;
          }
        }
      }
      if (V.length === 0) {
        console.error(
          "[PLAYER] No parts available to start. This usually means setupAudio() failed."
        ), console.error(
          "[PLAYER] Try refreshing the page or check if Tone.js is properly loaded."
        );
        return;
      }
      h.Transport.state !== "paused" && V.forEach((x, k) => {
        if (!x || typeof x.start != "function") {
          console.error(`[PLAYER] Part ${k} is invalid:`, x);
          return;
        }
        try {
          x.start(0);
        } catch (T) {
          console.error(`[PLAYER] Failed to start part ${k}:`, T);
        }
      }), h.Transport.start(), B = !0, tt.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-pause"><circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/></svg>', re();
    }
  }), E.addEventListener("click", async () => {
    h && (console.log("[PLAYER] Stopping playback completely..."), h.Transport.stop(), h.Transport.cancel(), h.Transport.position = 0, V.forEach((x, k) => {
      try {
        x.stop();
      } catch (T) {
        console.warn(
          `[PLAYER] Failed to stop part ${k} during complete stop:`,
          T
        );
      }
    }), B = !1, Q.value = 0, Z.textContent = Mt(0), tt.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>', console.log("[PLAYER] Playback stopped completely"));
  }), Q.addEventListener("input", () => {
    if (h && g > 0) {
      const x = Q.value / 100 * g, k = B;
      k && h.Transport.pause(), h.Transport.seconds = x, Z.textContent = Mt(x), k && setTimeout(() => {
        h.Transport.start();
      }, 50);
    }
  }), z.addEventListener("change", () => {
    const x = parseInt(z.value);
    h && x >= 60 && x <= 240 ? (console.log(`[PLAYER] Tempo changed to ${x} BPM`), h.Transport.bpm.value = x, console.log(`[PLAYER] Tempo changed to ${x} BPM`)) : z.value = h ? h.Transport.bpm.value : l;
  }), I.forEach((x) => {
    x.addEventListener("change", () => {
      if (h && nt.length > 0) {
        console.log(
          "[PLAYER] Synthesizer selection changed, reinitializing audio..."
        );
        const k = B;
        B && (h.Transport.stop(), B = !1), Rt(), k ? setTimeout(() => {
          h.Transport.start(), B = !0, tt.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-pause"><circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/></svg>';
        }, 100) : tt.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>';
      }
    });
  });
  const oe = () => {
    console.log("MIDI download - requires MIDI converter implementation");
  }, ie = () => {
    console.log("WAV download - requires WAV generator implementation");
  };
  b.addEventListener("click", oe), w.addEventListener("click", ie), W.addEventListener("click", oe), U.addEventListener("click", ie);
  const se = typeof window < "u" && window.Tone || (typeof h < "u" ? h : null);
  if (se && ne().then(() => {
    Rt(), e && setTimeout(() => {
      tt.click();
    }, 500);
  }), e && !se) {
    const x = setInterval(() => {
      (typeof window < "u" && window.Tone || (typeof h < "u" ? h : null)) && (clearInterval(x), setTimeout(() => {
        tt.click();
      }, 500));
    }, 100);
    setTimeout(() => {
      clearInterval(x);
    }, 1e4);
  }
  return C;
}
function Zt(c, t = 0.25, e = "nearest") {
  if (typeof c != "number" || !isFinite(c)) return c;
  const n = c / t;
  let r;
  switch (e) {
    case "floor":
      r = Math.floor(n);
      break;
    case "ceil":
      r = Math.ceil(n);
      break;
    case "nearest":
    default:
      r = Math.round(n);
  }
  return r * t;
}
function Ce(c, { grid: t = 0.25, fields: e = ["time", "duration"], mode: n = "nearest" } = {}) {
  return Array.isArray(c) ? c.map((r) => {
    const o = { ...r };
    return e.forEach((i) => {
      typeof o[i] == "number" && (o[i] = Zt(o[i], t, n));
    }), o;
  }) : c;
}
function Ne(c, { grid: t = 0.25, mode: e = "nearest" } = {}) {
  return !c || !Array.isArray(c.notes) ? c : {
    ...c,
    notes: Ce(c.notes, { grid: t, fields: ["time", "duration"], mode: e })
  };
}
function ar(c, { grid: t = 0.25, mode: e = "nearest" } = {}) {
  return !c || !Array.isArray(c.tracks) ? c : {
    ...c,
    tracks: c.tracks.map((n) => Ne(n, { grid: t, mode: e }))
  };
}
function Re(c, t = 0.25) {
  const e = Math.round(1 / t), n = Math.round(c / t);
  return n <= 0 || n === e ? "" : n % e === 0 ? String(n / e) : `${n}/${e}`;
}
const It = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  encodeAbcDuration: Re,
  quantize: Zt,
  quantizeComposition: ar,
  quantizeEvents: Ce,
  quantizeTrack: Ne
}, Symbol.toStringTag, { value: "Module" }));
class cr {
  /**
   * Convertit un objet JMON en ABC après validation/normalisation
   * @param {Object} composition - objet JMON
   * @returns {string} ABC notation string
   */
  static fromValidatedJmon(t) {
    const e = new Dt(), { valid: n, normalized: r, errors: o } = e.validateAndNormalize(
      t
    );
    if (!n)
      throw console.warn("JMON non valide pour conversion ABC:", o), new Error("JMON non valide");
    return this.convertToAbc(r);
  }
  /**
   * Helper function to parse time strings with fallback
   * @param {string|number} timeString - time value
   * @param {number} bpm - beats per minute
   * @returns {number} parsed time in seconds
   */
  static parseTimeString(t, e) {
    if (typeof t == "number") return t;
    if (typeof t != "string") return 0;
    try {
      if (jmonTone && jmonTone._parseTimeString)
        return jmonTone._parseTimeString(t, e);
    } catch {
    }
    if (t.includes(":")) {
      const n = t.split(":").map(parseFloat), r = n[0] || 0, o = n[1] || 0, i = n[2] || 0, s = 60 / e, a = s * 4, l = s / 480;
      return r * a + o * s + i * l;
    }
    if (t.match(/^\d+[nthq]$/)) {
      const n = parseInt(t), r = t.slice(-1), o = 60 / e;
      switch (r) {
        case "n":
          return o * (4 / n);
        case "t":
          return o * (4 / n) * (2 / 3);
        case "h":
          return o * 2;
        case "q":
          return o;
        default:
          return o;
      }
    }
    return parseFloat(t) || 0;
  }
  static convertToAbc(t, e = {}) {
    let n = `X:1
`;
    n += `T:${t.metadata?.title || t.metadata?.name || t.meta?.title || t.meta?.name || t.label || "Untitled"}
`;
    const r = t.metadata?.composer || t.metadata?.author || t.meta?.composer || t.meta?.author;
    r && (n += `C:${r}
`), n += `M:${t.timeSignature || "4/4"}
`;
    const o = Array.isArray(t.tracks) ? t.tracks : Object.values(t.tracks || {});
    let i = !1;
    o.forEach((j) => {
      const I = j.notes || j;
      Array.isArray(I) && I.forEach((F) => {
        typeof F.duration == "number" && (F.duration === 0.25 || F.duration === 0.5) && (i = !0);
      });
    });
    const s = i, a = s ? 1 / 8 : 1 / 4, l = s ? "1/8" : "1/4", u = t.tempo || t.bpm || 120;
    if (n += `L:${l}
`, n += `Q:${l}=${Math.round(u * (s ? 2 : 1))}
`, n += `K:${t.keySignature || "C"}
`, o.length === 0) return n;
    const d = t.timeSignature || "4/4", [m, p] = d.split("/").map(Number), g = m * (4 / p), f = e.measuresPerLine || 4, C = e.lineBreaks || [], it = e.renderMode || "merged", et = e.trackIndex || 0, O = !!e.hideRests, J = e.showArticulations !== !1, st = (() => {
      let j = 0;
      return o.forEach((I) => {
        const F = I.notes || I;
        Array.isArray(F) && F.forEach((N) => {
          const L = typeof N.time == "number" ? N.time : 0, z = typeof N.duration == "number" ? N.duration : 1, Y = L + z;
          Y > j && (j = Y);
        });
      }), j;
    })(), S = Math.max(
      1,
      Math.ceil(st / g)
    );
    if (it === "tracks" && o.length > 1)
      n += "%%score {", o.forEach((j, I) => {
        I > 0 && (n += " | "), n += `${I + 1}`;
      }), n += `}
`, o.forEach((j, I) => {
        const F = j.notes || j;
        if (F.length === 0) return;
        const N = I + 1, L = j.label || `Track ${I + 1}`, z = L.length > 12 ? L.substring(0, 10) + ".." : L, Y = j.instrument ? ` [${j.instrument}]` : "";
        n += `V:${N} name="${L}${Y}" snm="${z}"
`;
        const W = F.filter((D) => D.pitch !== void 0).sort((D, Z) => (D.time || 0) - (Z.time || 0)), { abcNotesStr: U } = this.convertNotesToAbc(
          W,
          g,
          f,
          C,
          {
            hideRests: O,
            showArticulations: J,
            padMeasures: o.length > 1 ? S : 0
          },
          a
        );
        U.trim() && (n += U + `
`);
      });
    else if (it === "drums") {
      n += `V:1 clef=perc name="Drum Set" snm="Drums"
`;
      const j = e.percussionMap || {
        kick: "C,,",
        snare: "D,",
        hat: "F",
        "hi-hat": "F",
        hihat: "F"
      }, I = (z) => {
        const Y = (z || "").toLowerCase();
        for (const W of Object.keys(j))
          if (Y.includes(W)) return j[W];
        return "E";
      }, F = [];
      o.forEach((z) => {
        const Y = z.notes || z, W = z.label || "", U = I(W);
        (Y || []).forEach((D) => {
          D.pitch !== void 0 && F.push({
            time: typeof D.time == "number" ? D.time : 0,
            duration: typeof D.duration == "number" ? D.duration : 1,
            // Use mapped ABC pitch string directly in converter
            pitch: U,
            articulation: D.articulation
          });
        });
      });
      const N = F.sort((z, Y) => (z.time || 0) - (Y.time || 0)), { abcNotesStr: L } = this.convertNotesToAbc(
        N,
        g,
        f,
        C,
        {
          hideRests: O,
          showArticulations: J,
          padMeasures: o.length > 1 ? S : 0
        },
        a
      );
      L.trim() && (n += L + `
`);
    } else if (it === "single") {
      const j = o[et];
      if (j) {
        const F = (j.notes || j).filter((L) => L.pitch !== void 0).sort((L, z) => (L.time || 0) - (z.time || 0)), { abcNotesStr: N } = this.convertNotesToAbc(
          F,
          g,
          f,
          C,
          {
            hideRests: O,
            showArticulations: J,
            padMeasures: o.length > 1 ? S : 0
          },
          a
        );
        N.trim() && (n += N + `
`);
      }
    } else {
      const j = [];
      o.forEach((N) => {
        (N.notes || N).forEach((z) => {
          z.pitch !== void 0 && j.push(z);
        });
      });
      const I = j.sort(
        (N, L) => (N.time || 0) - (L.time || 0)
      ), { abcNotesStr: F } = this.convertNotesToAbc(
        I,
        g,
        f,
        C,
        {
          hideRests: O,
          showArticulations: J,
          padMeasures: o.length > 1 ? S : 0
        },
        a
      );
      F.trim() && (n += F + `
`);
    }
    return n;
  }
  /**
   * Convert notes to ABC notation string
   */
  static convertNotesToAbc(t, e, n, r, o = {}, i = 1 / 4) {
    let s = "";
    const a = e / i;
    let l = 0, u = 0, d = 0, m = 0;
    const p = o?.quantizeBeats || 0.25, g = 1e-6, f = (S) => Zt(S, p, "nearest"), C = (S) => Re(S, p / i), it = (S) => {
      s += S + " ";
    }, et = () => {
      for (; l >= a - g; )
        it("|"), l -= a, u++, d++, (r.includes(u) || d >= n) && (s += `
`, d = 0);
    }, O = (S, { forceVisible: j = !1 } = {}) => {
      let I = S / i;
      for (; I > g; ) {
        const F = f(a - l), N = f(Math.min(I, F));
        if (N > g) {
          let L = o.hideRests && !j ? "x" : "z";
          L += C(N), it(L), l = f(l + N), I = f(I - N);
        }
        et();
      }
    };
    for (const S of t) {
      const j = typeof S.time == "number" ? f(S.time) : 0, I = typeof S.duration == "number" ? f(S.duration / i) : 1 / i, F = f((j - m) / i);
      F > g && O(F);
      let N = "z";
      if (Array.isArray(S.pitch)) {
        const Y = (W) => {
          const U = [
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
            "B"
          ], D = Math.floor(W / 12) - 1, Z = W % 12;
          let K = U[Z].replace("#", "^");
          return D >= 4 ? (K = K.toLowerCase(), D > 4 && (K += "'".repeat(D - 4))) : D < 4 && (K = K.toUpperCase(), D < 3 && (K += ",".repeat(3 - D))), K;
        };
        N = "[" + S.pitch.map(Y).join("") + "]";
      } else if (typeof S.pitch == "number") {
        const Y = S.pitch, W = [
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
          "B"
        ], U = Math.floor(Y / 12) - 1, D = Y % 12;
        N = W[D].replace("#", "^"), U >= 4 ? (N = N.toLowerCase(), U > 4 && (N += "'".repeat(U - 4))) : U < 4 && (N = N.toUpperCase(), U < 3 && (N += ",".repeat(3 - U)));
      } else typeof S.pitch == "string" ? N = S.pitch : S.pitch === null && (N = o.hideRests ? "x" : "z");
      let L = I, z = !0;
      for (; L > g; ) {
        const Y = f(a - l), W = f(Math.min(L, Y));
        if (W > g) {
          let U = N;
          U += C(W), z && o.showArticulations && (S.articulation === "staccato" && (U += "."), S.articulation === "accent" && (U += ">"), S.articulation === "tenuto" && (U += "-"), S.articulation === "marcato" && (U += "^")), L > W + g && (U += "-"), it(U), l = f(l + W), L = f(L - W), z = !1;
        }
        et();
      }
      m = f(j + I);
    }
    const J = o.padMeasures || 0;
    for (; u < J; ) {
      const S = f(a - l);
      S > g && O(S, { forceVisible: !0 }), it("|"), l = 0, u++;
    }
    if (l > g) {
      const S = f(a - l);
      S > g && O(S, { forceVisible: !0 });
    }
    const st = s.trim();
    return st && !st.endsWith("|") && (s += "|"), { abcNotesStr: s };
  }
}
function je(c, t = {}) {
  return cr.convertToAbc(c, t);
}
class te {
  static midiToNoteName(t) {
    const e = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], n = Math.floor(t / 12) - 1, r = t % 12;
    return e[r] + n;
  }
  static convert(t) {
    const e = t.tempo || t.bpm || 120, n = t.tracks || [];
    return {
      header: {
        bpm: e,
        timeSignature: t.timeSignature || "4/4"
      },
      tracks: n.map((r) => ({
        label: r.label,
        notes: r.notes.map((o) => ({
          pitch: o.pitch,
          noteName: typeof o.pitch == "number" ? te.midiToNoteName(o.pitch) : o.pitch,
          time: o.time,
          duration: o.duration,
          velocity: o.velocity || 0.8,
          articulation: o.articulation || null
        }))
      }))
    };
  }
}
function lr(c) {
  return te.convert(c);
}
class ee {
  constructor(t = {}) {
    this.options = {
      Tone: null,
      trackNaming: "auto",
      // 'auto', 'numbered', 'channel', 'instrument'
      mergeDrums: !0,
      quantize: null,
      // e.g., 0.25 for 16th note quantization
      includeModulations: !0,
      includeTempo: !0,
      includeKeySignature: !0,
      ...t
    };
  }
  /**
   * Static conversion method
   * @param {ArrayBuffer|Uint8Array} midiData - MIDI file data
   * @param {Object} options - Conversion options
   * @returns {Promise<Object>} JMON composition
   */
  static async convert(t, e = {}) {
    return await new ee(e).convertToJmon(t);
  }
  /**
   * Main conversion method
   * @param {ArrayBuffer|Uint8Array} midiData - MIDI file data
   * @returns {Promise<Object>} JMON composition
   */
  async convertToJmon(t) {
    const e = await this.initializeTone();
    let n;
    try {
      n = new e.Midi(t);
    } catch (l) {
      throw new Error(`Failed to parse MIDI file: ${l.message}`);
    }
    const r = this.buildJmonComposition(n, e), o = new Dt(), { valid: i, normalized: s, errors: a } = o.validateAndNormalize(
      r
    );
    return i || console.warn("Generated JMON failed validation:", a), i ? s : r;
  }
  /**
   * Initialize Tone.js instance following music-player.js pattern
   * @returns {Promise<Object>} Tone.js instance
   */
  async initializeTone() {
    const t = this.options.Tone;
    if (typeof window < "u") {
      const e = t || window.Tone || (typeof Tone < "u" ? Tone : null);
      if (e)
        return e;
      try {
        const n = await import("tone");
        return n.default || n;
      } catch {
        throw new Error(
          "Tone.js not found. Please provide Tone instance or load Tone.js"
        );
      }
    } else {
      if (t)
        return t;
      throw new Error("Tone instance required in Node.js environment");
    }
  }
  /**
   * Build JMON composition from parsed MIDI
   * @param {Object} parsed - Parsed MIDI from Tone.js
   * @param {Object} Tone - Tone.js instance
   * @returns {Object} JMON composition
   */
  buildJmonComposition(t, e) {
    const n = {
      format: "jmon",
      version: "1.0",
      tempo: this.extractTempo(t),
      tracks: this.convertTracks(t.tracks, e, t)
    }, r = this.extractTimeSignature(t);
    r && (n.timeSignature = r);
    const o = this.extractKeySignature(t);
    o && (n.keySignature = o);
    const i = this.extractMetadata(t);
    return Object.keys(i).length > 0 && (n.metadata = i), this.options.includeTempo && this.hasTempoChanges(t) && (n.tempoMap = this.extractTempoMap(t)), this.hasTimeSignatureChanges(t) && (n.timeSignatureMap = this.extractTimeSignatureMap(t)), n;
  }
  /**
   * Convert MIDI tracks to JMON tracks
   * @param {Array} tracks - MIDI tracks from Tone.js
   * @param {Object} Tone - Tone.js instance
   * @param {Object} parsed - Full parsed MIDI data
   * @returns {Array} JMON tracks
   */
  convertTracks(t, e, n) {
    const r = [];
    let o = 0;
    for (const i of t) {
      if (!i.notes || i.notes.length === 0)
        continue;
      const s = this.generateTrackName(i, o, n), a = this.isDrumTrack(i), l = i.notes.map(
        (m) => this.convertNote(m, e, i)
      ), u = this.options.quantize ? this.quantizeNotes(l, this.options.quantize) : l, d = {
        label: s,
        notes: u
      };
      if (i.channel !== void 0 && (d.midiChannel = i.channel), i.instrument && (d.synth = {
        type: a ? "Sampler" : "PolySynth",
        options: this.getInstrumentOptions(i.instrument, a)
      }), this.options.includeModulations && i.controlChanges) {
        const m = this.extractModulations(i.controlChanges);
        m.length > 0 && this.applyModulationsToTrack(d, m);
      }
      r.push(d), o++;
    }
    return r;
  }
  /**
   * Convert MIDI note to JMON note
   * @param {Object} note - MIDI note from Tone.js
   * @param {Object} Tone - Tone.js instance
   * @param {Object} track - Parent track for context
   * @returns {Object} JMON note
   */
  convertNote(t, e, n) {
    const r = {
      pitch: t.midi,
      // Use MIDI number as primary format
      time: t.time,
      // Tone.js already converts to seconds, we'll convert to quarters
      duration: this.convertDurationToNoteValue(t.duration),
      velocity: t.velocity
    }, o = t.tempo || 120;
    if (r.time = this.convertSecondsToQuarterNotes(t.time, o), this.options.includeModulations && t.controlChanges) {
      const i = this.convertNoteModulations(t.controlChanges);
      i.length > 0 && (r.modulations = i);
    }
    return r;
  }
  /**
   * Generate track name based on naming strategy
   * @param {Object} track - MIDI track
   * @param {number} index - Track index
   * @param {Object} parsed - Full parsed MIDI
   * @returns {string} Track name
   */
  generateTrackName(t, e, n) {
    switch (this.options.trackNaming) {
      case "numbered":
        return `Track ${e + 1}`;
      case "channel":
        return `Channel ${(t.channel || 0) + 1}`;
      case "instrument":
        return t.instrument ? t.instrument.name || `Instrument ${t.instrument.number}` : `Track ${e + 1}`;
      case "auto":
      default:
        return t.name && t.name.trim() ? t.name.trim() : this.isDrumTrack(t) ? "Drums" : t.instrument && t.instrument.name ? t.instrument.name : t.channel !== void 0 ? t.channel === 9 ? "Drums" : `Channel ${t.channel + 1}` : `Track ${e + 1}`;
    }
  }
  /**
   * Check if track is a drum track (channel 10/9 in MIDI)
   * @param {Object} track - MIDI track
   * @returns {boolean} True if drum track
   */
  isDrumTrack(t) {
    return t.channel === 9;
  }
  /**
   * Get instrument options for synth configuration
   * @param {Object} instrument - MIDI instrument info
   * @param {boolean} isDrum - Whether this is a drum track
   * @returns {Object} Synth options
   */
  getInstrumentOptions(t, e) {
    return e ? {
      envelope: {
        enabled: !0,
        attack: 0.02,
        decay: 0.1,
        sustain: 0.8,
        release: 0.3
      }
    } : {
      oscillator: { type: "triangle" },
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.7,
        release: 1
      }
    };
  }
  /**
   * Extract tempo from MIDI
   * @param {Object} parsed - Parsed MIDI
   * @returns {number} BPM
   */
  extractTempo(t) {
    if (t.header && t.header.tempos && t.header.tempos.length > 0)
      return Math.round(t.header.tempos[0].bpm);
    for (const e of t.tracks)
      if (e.tempoEvents && e.tempoEvents.length > 0)
        return Math.round(e.tempoEvents[0].bpm);
    return 120;
  }
  /**
   * Extract time signature from MIDI
   * @param {Object} parsed - Parsed MIDI
   * @returns {string|null} Time signature like "4/4"
   */
  extractTimeSignature(t) {
    if (t.header && t.header.timeSignatures && t.header.timeSignatures.length > 0) {
      const e = t.header.timeSignatures[0];
      return `${e.numerator}/${e.denominator}`;
    }
    for (const e of t.tracks)
      if (e.timeSignatureEvents && e.timeSignatureEvents.length > 0) {
        const n = e.timeSignatureEvents[0];
        return `${n.numerator}/${n.denominator}`;
      }
    return null;
  }
  /**
   * Extract key signature from MIDI
   * @param {Object} parsed - Parsed MIDI
   * @returns {string|null} Key signature like "C", "G", "Dm"
   */
  extractKeySignature(t) {
    return null;
  }
  /**
   * Extract metadata from MIDI
   * @param {Object} parsed - Parsed MIDI
   * @returns {Object} Metadata object
   */
  extractMetadata(t) {
    const e = {};
    for (const n of t.tracks)
      if (n.meta)
        for (const r of n.meta)
          switch (r.type) {
            case "trackName":
            case "text":
              !e.title && r.text && r.text.trim() && (e.title = r.text.trim());
              break;
            case "copyright":
              r.text && r.text.trim() && (e.copyright = r.text.trim());
              break;
            case "composer":
              r.text && r.text.trim() && (e.composer = r.text.trim());
              break;
          }
    return e;
  }
  /**
   * Check if MIDI has tempo changes
   * @param {Object} parsed - Parsed MIDI
   * @returns {boolean} True if has tempo changes
   */
  hasTempoChanges(t) {
    if (t.header && t.header.tempos && t.header.tempos.length > 1)
      return !0;
    for (const e of t.tracks)
      if (e.tempoEvents && e.tempoEvents.length > 1)
        return !0;
    return !1;
  }
  /**
   * Extract tempo map for tempo changes
   * @param {Object} parsed - Parsed MIDI
   * @returns {Array} Tempo map events
   */
  extractTempoMap(t) {
    const e = [], n = [];
    t.header && t.header.tempos && n.push(...t.header.tempos.map((r) => ({
      time: r.time,
      tempo: Math.round(r.bpm)
    })));
    for (const r of t.tracks)
      r.tempoEvents && n.push(...r.tempoEvents.map((o) => ({
        time: o.time,
        tempo: Math.round(o.bpm)
      })));
    n.sort((r, o) => r.time - o.time);
    for (const r of n)
      e.push({
        time: this.convertSecondsToQuarterNotes(r.time, r.tempo),
        tempo: r.tempo
      });
    return e;
  }
  /**
   * Check if MIDI has time signature changes
   * @param {Object} parsed - Parsed MIDI
   * @returns {boolean} True if has time signature changes
   */
  hasTimeSignatureChanges(t) {
    if (t.header && t.header.timeSignatures && t.header.timeSignatures.length > 1)
      return !0;
    for (const e of t.tracks)
      if (e.timeSignatureEvents && e.timeSignatureEvents.length > 1)
        return !0;
    return !1;
  }
  /**
   * Extract time signature map for time signature changes
   * @param {Object} parsed - Parsed MIDI
   * @returns {Array} Time signature map events
   */
  extractTimeSignatureMap(t) {
    const e = [], n = [];
    t.header && t.header.timeSignatures && n.push(...t.header.timeSignatures);
    for (const r of t.tracks)
      r.timeSignatureEvents && n.push(...r.timeSignatureEvents);
    n.sort((r, o) => r.time - o.time);
    for (const r of n)
      e.push({
        time: this.convertSecondsToQuarterNotes(r.time, 120),
        // Use default tempo for conversion
        timeSignature: `${r.numerator}/${r.denominator}`
      });
    return e;
  }
  /**
   * Convert seconds to quarter notes
   * @param {number} seconds - Time in seconds
   * @param {number} bpm - Beats per minute
   * @returns {number} Time in quarter notes
   */
  convertSecondsToQuarterNotes(t, e) {
    const n = 60 / e;
    return t / n;
  }
  /**
   * Convert duration to note value string
   * @param {number} duration - Duration in seconds
   * @returns {string} Note value like "4n", "8n"
   */
  convertDurationToNoteValue(t) {
    const n = t / 0.5;
    return n >= 3.5 ? "1n" : n >= 1.75 ? "2n" : n >= 0.875 ? "4n" : n >= 0.4375 ? "8n" : n >= 0.21875 ? "16n" : n >= 0.109375 ? "32n" : "16n";
  }
  /**
   * Extract modulations from MIDI control changes
   * @param {Object} controlChanges - MIDI CC events
   * @returns {Array} Modulation events
   */
  extractModulations(t) {
    const e = [];
    for (const [n, r] of Object.entries(t)) {
      const o = parseInt(n);
      for (const i of r) {
        const s = {
          type: "cc",
          controller: o,
          value: i.value,
          time: this.convertSecondsToQuarterNotes(i.time, 120)
        };
        e.push(s);
      }
    }
    return e;
  }
  /**
   * Convert note-level modulations
   * @param {Object} controlChanges - Note-level CC events
   * @returns {Array} Note modulation events
   */
  convertNoteModulations(t) {
    return this.extractModulations(t);
  }
  /**
   * Apply modulations to track
   * @param {Object} track - JMON track
   * @param {Array} modulations - Modulation events
   */
  applyModulationsToTrack(t, e) {
    e.length > 0 && (t.automation = [{
      id: "midi_cc",
      target: "midi.cc1",
      // Default to modulation wheel
      anchorPoints: e.map((n) => ({
        time: n.time,
        value: n.value
      }))
    }]);
  }
  /**
   * Quantize notes to grid
   * @param {Array} notes - Notes to quantize
   * @param {number} grid - Grid size in quarter notes
   * @returns {Array} Quantized notes
   */
  quantizeNotes(t, e) {
    return t.map((n) => ({
      ...n,
      time: Math.round(n.time / e) * e
    }));
  }
}
async function ur(c, t = {}) {
  return await ee.convert(c, t);
}
function hr(c, t = {}) {
  return {
    sampleRate: t.sampleRate || 44100,
    duration: t.duration || 10,
    channels: t.channels || 1,
    tempo: c.tempo || c.bpm || 120,
    notes: c.tracks?.flatMap((e) => e.notes) || []
  };
}
class dr {
  static convert(t) {
    let n = `// SuperCollider script generated from JMON
// Title: ${t.metadata?.name || "Untitled"}
`;
    return (t.tracks?.[0]?.notes || []).forEach((o) => {
      n += `Synth("default", ["freq", ${o.pitch}, "dur", ${o.duration}]);
`;
    }), n;
  }
}
function mr(c) {
  return dr.convert(c);
}
class pr {
  constructor() {
    this.noteMap = {
      60: "C/4",
      61: "C#/4",
      62: "D/4",
      63: "D#/4",
      64: "E/4",
      65: "F/4",
      66: "F#/4",
      67: "G/4",
      68: "G#/4",
      69: "A/4",
      70: "A#/4",
      71: "B/4",
      72: "C/5",
      73: "C#/5",
      74: "D/5",
      75: "D#/5",
      76: "E/5",
      77: "F/5",
      78: "F#/5",
      79: "G/5",
      80: "G#/5",
      81: "A/5",
      82: "A#/5",
      83: "B/5"
    };
  }
  /**
   * Convert MIDI note number to VexFlow pitch notation
   */
  midiToVexFlow(t) {
    if (this.noteMap[t])
      return this.noteMap[t];
    const e = Math.floor(t / 12) - 1;
    return `${[
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
      "B"
    ][t % 12]}/${e}`;
  }
  /**
   * Convert duration to VexFlow duration string
   */
  durationToVexFlow(t) {
    return t >= 4 ? "w" : t >= 2 ? "h" : t >= 1 ? "q" : t >= 0.5 ? "8" : t >= 0.25 ? "16" : "32";
  }
  /**
   * Convert JMON composition to VexFlow format
   */
  convertToVexFlow(t) {
    const e = {
      timeSignature: t.timeSignature || "4/4",
      keySignature: t.keySignature || "C",
      clef: t.clef,
      tracks: []
    };
    return (Array.isArray(t.tracks) ? t.tracks : [t]).forEach((r, o) => {
      const i = r.notes || r, s = [];
      Array.isArray(i) && i.forEach((a) => {
        if (a.pitch !== null && a.pitch !== void 0) {
          const l = {
            keys: [this.midiToVexFlow(a.pitch)],
            duration: this.durationToVexFlow(a.duration || 1)
          };
          a.articulation && (l.articulation = a.articulation), s.push(l);
        } else
          s.push({
            keys: [],
            duration: this.durationToVexFlow(a.duration || 1),
            isRest: !0
          });
      }), e.tracks.push({
        name: r.name || `Track ${o + 1}`,
        notes: s,
        clef: r.clef
      });
    }), e;
  }
  /**
   * Create VexFlow renderer configuration
   */
  createRenderer(t, e = 800, n = 200) {
    return {
      elementId: t,
      width: e,
      height: n,
      renderer: "svg",
      // or 'canvas'
      scale: 1
    };
  }
  /**
   * Generate VexFlow rendering instructions
   */
  generateRenderingInstructions(t, e) {
    return {
      type: "vexflow",
      data: t,
      config: e,
      render: function(n) {
        let o = e.element && e.element.nodeType === 1 ? e.element : e.elementId ? document.getElementById(e.elementId) : null;
        o || (o = document.createElement("div"), o.id = e.elementId || `vexflow-${Date.now()}`, o.style.position = "absolute", o.style.left = "-10000px", o.style.top = "-10000px", o.style.visibility = "hidden", (document.body || document.documentElement).appendChild(o));
        const i = (() => {
          const s = [
            n,
            n && n.default,
            typeof window < "u" && (window.VF || window.VexFlow),
            typeof window < "u" && window.Vex && (window.Vex.Flow || window.Vex)
          ];
          for (const a of s)
            if (a) return a;
          return null;
        })();
        try {
          const s = i && (i.Factory || i.Flow && i.Flow.Factory || i.VF && i.VF.Factory);
          if (!s)
            throw new Error("VexFlow Factory API not available on this build");
          const l = new s({
            renderer: {
              // Use elementId for VexFlow Factory (falls back to generated div id)
              elementId: e.elementId || o.id,
              width: e.width,
              height: e.height
            }
          }).getContext(), u = i && (i.Flow || i) || {}, d = e.accidentalsMode || "auto", p = ((y) => {
            const v = (y || "C").trim(), A = {
              C: 0,
              G: 1,
              D: 2,
              A: 3,
              E: 4,
              B: 5,
              "F#": 6,
              "C#": 7
            }, b = {
              C: 0,
              F: 1,
              Bb: 2,
              Eb: 3,
              Ab: 4,
              Db: 5,
              Gb: 6,
              Cb: 7
            }, w = {
              A: 0,
              E: 1,
              B: 2,
              "F#": 3,
              "C#": 4,
              "G#": 5,
              "D#": 6,
              "A#": 7
            }, h = {
              A: 0,
              D: 1,
              G: 2,
              C: 3,
              F: 4,
              Bb: 5,
              Eb: 6,
              Ab: 7
            }, B = ["f", "c", "g", "d", "a", "e", "b"], nt = ["b", "e", "a", "d", "g", "c", "f"], V = /m(in)?$/i.test(v), _ = v.replace(/m(in)?$/i, "");
            let P = 0, rt = "natural";
            V && w[_] !== void 0 ? (P = w[_], rt = "sharp") : V && h[_] !== void 0 ? (P = h[_], rt = "flat") : A[_] !== void 0 ? (P = A[_], rt = "sharp") : b[_] !== void 0 && (P = b[_], rt = "flat");
            const dt = {
              a: "natural",
              b: "natural",
              c: "natural",
              d: "natural",
              e: "natural",
              f: "natural",
              g: "natural"
            };
            if (rt === "sharp")
              for (let gt = 0; gt < P; gt++) dt[B[gt]] = "sharp";
            if (rt === "flat")
              for (let gt = 0; gt < P; gt++) dt[nt[gt]] = "flat";
            return dt;
          })(t.keySignature), g = (y) => {
            const v = String(y).replace(/r/g, "");
            return { w: 32, h: 16, q: 8, 8: 4, 16: 2, 32: 1 }[v] || 0;
          }, C = ((y) => {
            const [v, A] = (y || "4/4").split("/").map((b) => parseInt(b, 10));
            return { n: v || 4, d: A || 4 };
          })(t.timeSignature), it = Math.max(1, Math.round(32 * C.n / C.d)), et = (y) => ({ 32: "w", 16: "h", 8: "q", 4: "8", 2: "16", 1: "32" })[y] || "q", O = [];
          let J = [], st = 0;
          const S = t.tracks[0].notes;
          for (const y of S) {
            let v = g(y.duration), A = !0;
            for (; v > 0; ) {
              const b = it - st, w = Math.min(v, b), h = { ...y, duration: et(w) };
              A || (h.tieFromPrev = !0), w < v && (h.tieToNext = !0), J.push(h), st += w, v -= w, A = !1, st >= it && (O.push(J), J = [], st = 0);
            }
          }
          J.length && O.push(J);
          const j = 10, I = 10, F = 40, N = Math.max(
            100,
            (e.width || 800) - j - I
          ), L = Math.max(1, O.length), z = Math.max(100, Math.floor(N / L)), Y = (y) => {
            const v = /^([a-g])(b|#)?\/(-?\d+)$/.exec(y);
            if (!v) return 60;
            const b = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }[v[1]], w = v[2] === "#" ? 1 : v[2] === "b" ? -1 : 0;
            return (parseInt(v[3], 10) + 1) * 12 + b + w;
          }, W = [];
          O.forEach((y) => {
            y.forEach((v) => {
              v && !v.isRest && Array.isArray(v.keys) && v.keys[0] && W.push(Y(String(v.keys[0]).toLowerCase()));
            });
          });
          const D = (W.length ? W.sort(
            (y, v) => y - v
          )[Math.floor(W.length / 2)] : 60) < 60 ? "bass" : "treble", Z = new u.Stave(j, F, N);
          Z.addClef(
            t.clef || t.tracks && t.tracks[0] && t.tracks[0].clef || D
          ), t.timeSignature && Z.addTimeSignature(t.timeSignature), t.keySignature && t.keySignature !== "C" && Z.addKeySignature(t.keySignature), Z.setContext(l).draw();
          const K = [], Q = [], vt = [];
          O.forEach((y, v) => {
            const A = y.map((b) => {
              if (b.isRest)
                return new u.StaveNote({
                  keys: ["d/5"],
                  duration: String(b.duration).replace(/r?$/, "r")
                });
              const w = new u.StaveNote({
                keys: b.keys.map((h) => h.toLowerCase()),
                duration: b.duration
              });
              if (u.Accidental && b.keys.forEach((h, B) => {
                const nt = h.toLowerCase(), V = nt[0], _ = nt.includes("#") ? "#" : nt.includes("b") ? "b" : "", P = p[V] || "natural";
                let rt = null;
                d === "always" ? _ === "#" ? rt = "#" : _ === "b" ? rt = "b" : P !== "natural" && (rt = "n") : _ === "#" && P !== "sharp" ? rt = "#" : _ === "b" && P !== "flat" ? rt = "b" : !_ && (P === "sharp" || P === "flat") && (rt = "n"), rt && (typeof w.addAccidental == "function" ? w.addAccidental(B, new u.Accidental(rt)) : typeof w.addModifier == "function" && w.addModifier(new u.Accidental(rt), B));
              }), b.articulation) {
                const B = {
                  staccato: "a.",
                  accent: "a>",
                  tenuto: "a-",
                  marcato: "a^"
                }[b.articulation] || null;
                B && (typeof w.addArticulation == "function" ? w.addArticulation(
                  0,
                  new u.Articulation(B).setPosition(
                    u.Modifier.Position.ABOVE
                  )
                ) : typeof w.addModifier == "function" && w.addModifier(
                  new u.Articulation(B).setPosition(
                    u.Modifier.Position.ABOVE
                  ),
                  0
                ));
              }
              return w;
            });
            if (A.forEach((b, w) => {
              const h = y[w];
              if (!h || h.isRest) return;
              const B = typeof h.dots == "number" ? h.dots : h.dots === !0 || h.dot === !0 || h.dotted === !0 ? 1 : 0;
              for (let nt = 0; nt < B; nt++)
                typeof b.addDotToAll == "function" ? b.addDotToAll() : u.Dot && h.keys.forEach((V, _) => {
                  typeof b.addModifier == "function" && b.addModifier(new u.Dot(), _);
                });
              Q.push({ vf: b, data: h });
            }), K.push(...A), u.Beam && typeof u.Beam.generateBeams == "function") {
              const b = A.filter(
                (w) => typeof w.isRest != "function" || !w.isRest()
              );
              try {
                const w = u.Beam.generateBeams(b);
                w.forEach((h) => h.setContext(l)), vt.push(...w);
              } catch {
              }
            }
            v < O.length - 1 && u.BarNote && u.Barline && u.Barline.type && K.push(new u.BarNote(u.Barline.type.SINGLE));
          });
          const tt = t.tracks[0].notes.reduce(
            (y, v) => y + g(v.duration),
            0
          ), E = new u.Voice({
            num_beats: tt,
            beat_value: 32
          });
          if (E.setMode && u.Voice && u.Voice.Mode && u.Voice.Mode.SOFT !== void 0 ? E.setMode(u.Voice.Mode.SOFT) : typeof E.setStrict == "function" && E.setStrict(!1), E.addTickables(
            K.filter(
              (y) => typeof y.getTicks == "function" ? y.getTicks().value() > 0 : !0
            )
          ), u.Formatter && typeof u.Formatter.FormatAndDraw == "function" ? u.Formatter.FormatAndDraw(l, Z, K) : (new u.Formatter().joinVoices([E]).format([E], N - 20), E.draw(l, Z)), vt.length && vt.forEach((y) => {
            try {
              y.draw();
            } catch {
            }
          }), Q.length && u.StaveTie)
            for (let y = 0; y < Q.length - 1; y++) {
              const v = Q[y];
              if (!v) continue;
              const A = v.data || {};
              if (!!!(A.tieToNext || A.tieStart || A.tie === "start")) continue;
              let w = null;
              for (let h = y + 1; h < Q.length; h++)
                if (Q[h]) {
                  w = Q[h];
                  break;
                }
              if (w)
                try {
                  new u.StaveTie({
                    first_note: v.vf,
                    last_note: w.vf,
                    first_indices: [0],
                    last_indices: [0]
                  }).setContext(l).draw();
                } catch {
                }
            }
        } catch (s) {
          console.warn(
            "Factory API failed, trying low-level API:",
            s
          );
          const a = i && (i.Flow || i.VF || i) || {}, l = e.accidentalsMode || "auto", d = ((E) => {
            const y = (E || "C").trim(), v = {
              C: 0,
              G: 1,
              D: 2,
              A: 3,
              E: 4,
              B: 5,
              "F#": 6,
              "C#": 7
            }, A = {
              C: 0,
              F: 1,
              Bb: 2,
              Eb: 3,
              Ab: 4,
              Db: 5,
              Gb: 6,
              Cb: 7
            }, b = {
              A: 0,
              E: 1,
              B: 2,
              "F#": 3,
              "C#": 4,
              "G#": 5,
              "D#": 6,
              "A#": 7
            }, w = {
              A: 0,
              D: 1,
              G: 2,
              C: 3,
              F: 4,
              Bb: 5,
              Eb: 6,
              Ab: 7
            }, h = ["f", "c", "g", "d", "a", "e", "b"], B = ["b", "e", "a", "d", "g", "c", "f"], nt = /m(in)?$/i.test(y), V = y.replace(/m(in)?$/i, "");
            let _ = 0, P = "natural";
            nt && b[V] !== void 0 ? (_ = b[V], P = "sharp") : nt && w[V] !== void 0 ? (_ = w[V], P = "flat") : v[V] !== void 0 ? (_ = v[V], P = "sharp") : A[V] !== void 0 && (_ = A[V], P = "flat");
            const rt = {
              a: "natural",
              b: "natural",
              c: "natural",
              d: "natural",
              e: "natural",
              f: "natural",
              g: "natural"
            };
            if (P === "sharp")
              for (let dt = 0; dt < _; dt++) rt[h[dt]] = "sharp";
            if (P === "flat")
              for (let dt = 0; dt < _; dt++) rt[B[dt]] = "flat";
            return rt;
          })(t.keySignature), m = a && a.Renderer || i.Renderer || i.Flow && i.Flow.Renderer;
          if (!m || !m.Backends)
            throw new Error(
              "VexFlow low-level API not available (Renderer missing)"
            );
          const p = new m(
            o,
            m.Backends.SVG
          );
          p.resize(e.width, e.height);
          const g = p.getContext(), f = (E) => {
            const y = String(E).replace(/r/g, "");
            return { w: 32, h: 16, q: 8, 8: 4, 16: 2, 32: 1 }[y] || 0;
          }, it = ((E) => {
            const [y, v] = (E || "4/4").split("/").map((A) => parseInt(A, 10));
            return { n: y || 4, d: v || 4 };
          })(t.timeSignature), et = Math.max(1, Math.round(32 * it.n / it.d)), O = (E) => ({ 32: "w", 16: "h", 8: "q", 4: "8", 2: "16", 1: "32" })[E] || "q", J = [];
          let st = [], S = 0;
          const j = t.tracks[0].notes;
          for (const E of j) {
            let y = f(E.duration), v = !0;
            for (; y > 0; ) {
              const A = et - S, b = Math.min(y, A), w = { ...E, duration: O(b) };
              v || (w.tieFromPrev = !0), b < y && (w.tieToNext = !0), st.push(w), S += b, y -= b, v = !1, S >= et && (J.push(st), st = [], S = 0);
            }
          }
          st.length && J.push(st);
          const I = 10, F = 10, N = 40, L = Math.max(
            100,
            (e.width || 800) - I - F
          ), z = (E) => {
            const y = /^([a-g])(b|#)?\/(-?\d+)$/.exec(E);
            if (!y) return 60;
            const A = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }[y[1]], b = y[2] === "#" ? 1 : y[2] === "b" ? -1 : 0;
            return (parseInt(y[3], 10) + 1) * 12 + A + b;
          }, Y = [];
          J.forEach((E) => {
            E.forEach((y) => {
              y && !y.isRest && Array.isArray(y.keys) && y.keys[0] && Y.push(
                z(String(y.keys[0]).toLowerCase())
              );
            });
          });
          const U = (Y.length ? Y.sort((E, y) => E - y)[Math.floor(Y.length / 2)] : 60) < 60 ? "bass" : "treble", D = new a.Stave(I, N, L);
          D.addClef(
            t.clef || t.tracks && t.tracks[0] && t.tracks[0].clef || U
          ), t.timeSignature && D.addTimeSignature(t.timeSignature), t.keySignature && t.keySignature !== "C" && D.addKeySignature(t.keySignature), D.setContext(g).draw();
          const Z = [], K = [], Q = [];
          J.forEach((E, y) => {
            const v = E.map((A) => {
              if (A.isRest)
                return new a.StaveNote({
                  keys: ["d/5"],
                  duration: String(A.duration).replace(/r?$/, "r")
                });
              const b = new a.StaveNote({
                keys: A.keys.map((w) => w.toLowerCase()),
                duration: A.duration
              });
              if (a.Accidental && A.keys.forEach((w, h) => {
                const B = w.toLowerCase(), nt = B[0], V = B.includes("#") ? "#" : B.includes("b") ? "b" : "", _ = d[nt] || "natural";
                let P = null;
                l === "always" ? V === "#" ? P = "#" : V === "b" ? P = "b" : _ !== "natural" && (P = "n") : V === "#" && _ !== "sharp" ? P = "#" : V === "b" && _ !== "flat" ? P = "b" : !V && (_ === "sharp" || _ === "flat") && (P = "n"), P && (typeof b.addAccidental == "function" ? b.addAccidental(h, new a.Accidental(P)) : typeof b.addModifier == "function" && b.addModifier(new a.Accidental(P), h));
              }), A.articulation) {
                const h = {
                  staccato: "a.",
                  accent: "a>",
                  tenuto: "a-",
                  marcato: "a^"
                }[A.articulation] || null;
                h && (typeof b.addArticulation == "function" ? b.addArticulation(
                  0,
                  new a.Articulation(h).setPosition(
                    a.Modifier.Position.ABOVE
                  )
                ) : typeof b.addModifier == "function" && b.addModifier(
                  new a.Articulation(h).setPosition(
                    a.Modifier.Position.ABOVE
                  ),
                  0
                ));
              }
              return b;
            });
            if (v.forEach((A, b) => {
              const w = E[b];
              if (!w || w.isRest) return;
              const h = typeof w.dots == "number" ? w.dots : w.dots === !0 || w.dot === !0 || w.dotted === !0 ? 1 : 0;
              for (let B = 0; B < h; B++)
                typeof A.addDotToAll == "function" ? A.addDotToAll() : a.Dot && w.keys.forEach((nt, V) => {
                  typeof A.addModifier == "function" && A.addModifier(new a.Dot(), V);
                });
              K.push({ vf: A, data: w });
            }), Z.push(...v), a.Beam && typeof a.Beam.generateBeams == "function") {
              const A = v.filter(
                (b) => typeof b.isRest != "function" || !b.isRest()
              );
              try {
                const b = a.Beam.generateBeams(A);
                b.forEach((w) => w.setContext(g)), Q.push(...b);
              } catch {
              }
            }
            y < J.length - 1 && a.BarNote && a.Barline && a.Barline.type && Z.push(new a.BarNote(a.Barline.type.SINGLE));
          });
          const vt = t.tracks[0].notes.reduce(
            (E, y) => E + f(y.duration),
            0
          ), tt = new a.Voice({
            num_beats: vt,
            beat_value: 32
          });
          if (tt.setMode && a.Voice && a.Voice.Mode && a.Voice.Mode.SOFT !== void 0 ? tt.setMode(a.Voice.Mode.SOFT) : typeof tt.setStrict == "function" && tt.setStrict(!1), tt.addTickables(
            Z.filter(
              (E) => typeof E.getTicks == "function" ? E.getTicks().value() > 0 : !0
            )
          ), a.Formatter && typeof a.Formatter.FormatAndDraw == "function" ? a.Formatter.FormatAndDraw(g, D, Z) : (new a.Formatter().joinVoices([tt]).format([tt], L - 20), tt.draw(g, D)), Q.length && Q.forEach((E) => {
            try {
              E.draw();
            } catch {
            }
          }), K.length && a.StaveTie)
            for (let E = 0; E < K.length - 1; E++) {
              const y = K[E];
              if (!y) continue;
              const v = y.data || {};
              if (!!!(v.tieToNext || v.tieStart || v.tie === "start")) continue;
              let b = null;
              for (let w = E + 1; w < K.length; w++)
                if (K[w]) {
                  b = K[w];
                  break;
                }
              if (b)
                try {
                  new a.StaveTie({
                    first_note: y.vf,
                    last_note: b.vf,
                    first_indices: [0],
                    last_indices: [0]
                  }).setContext(g).draw();
                } catch {
                }
            }
        }
      }
    };
  }
}
function $e(c, t = {}) {
  const e = new pr(), n = e.convertToVexFlow(c);
  if (t.elementId) {
    const r = e.createRenderer(
      t.elementId,
      t.width,
      t.height
    );
    return e.generateRenderingInstructions(n, r);
  }
  return n;
}
function fr(c) {
  return new Dt().validateAndNormalize(c);
}
function gr(c, t = {}) {
  if (!c || typeof c != "object")
    throw console.error("[RENDER] Invalid JMON object:", c), new Error("render() requires a valid JMON object");
  return !c.sequences && !c.tracks && !c.format && console.warn(
    "[RENDER] Object does not appear to be JMON format, attempting normalization"
  ), Xt(c, t);
}
function yr(c, t = {}) {
  const e = { autoplay: !1, ...t };
  return Xt(c, e);
}
async function wr(c, t = {}, e = {}) {
  typeof t == "object" && !t.renderAbc && !t.Renderer && !t.VF && (e = t, t = null);
  const {
    scale: n = 0.9,
    staffwidth: r,
    showAbc: o = !0,
    responsive: i = "resize",
    abcOptions: s = {},
    width: a = 800,
    height: l = 200,
    autoload: u = !0
  } = e;
  let d = "unknown", m = null;
  t ? typeof t == "string" ? d = t.toLowerCase() : t.renderAbc ? (d = "abcjs", m = t) : (t.Renderer || t.VF) && (d = "vexflow", m = t) : typeof window < "u" && (window.ABCJS ? (d = "abcjs", m = window.ABCJS) : (window.VF || window.Vex) && (d = "vexflow", m = window.VF || window.Vex));
  const p = document.createElement("div");
  p.style.cssText = `
		margin: 15px 0;
		font-family: sans-serif;
	`;
  const g = document.createElement("div");
  return g.id = `rendered-score-${Date.now()}`, g.style.cssText = `
		width: 100%;
		overflow-x: auto;
		margin: 10px 0;
	`, p.appendChild(g), d === "vexflow" || d === "vf" ? await br(
    c,
    g,
    p,
    m,
    e
  ) : await xr(
    c,
    g,
    p,
    m,
    e,
    u
  );
}
async function br(c, t, e, n, r) {
  try {
    const o = t.id || `rendered-score-${Date.now()}`;
    t.id || (t.id = o);
    const i = $e(c, {
      element: t,
      elementId: o,
      width: r.width,
      height: r.height
    });
    if (!n && r.autoload !== !1)
      try {
        console.log("[SCORE] Loading VexFlow...");
        const s = await import("https://cdn.jsdelivr.net/npm/vexflow@5.0.0/+esm");
        n = s.default || s, typeof window < "u" && (window.VF = n, window.VexFlow = n, window.Vex = window.Vex || {}, window.Vex.Flow = n);
      } catch (s) {
        console.warn(
          "[SCORE] Could not auto-load VexFlow via ESM:",
          s && (s.message || String(s)) || "Unknown error"
        ), typeof document < "u" && await new Promise((a) => {
          const l = document.createElement("script");
          l.src = "https://cdn.jsdelivr.net/npm/vexflow@5.0.0/build/cjs/vexflow.min.js", l.async = !0, l.onload = () => {
            n = window.VF || window.VexFlow || window.Vex && (window.Vex.Flow || window.Vex) || null, n && !window.VF && (window.VF = n), a();
          }, l.onerror = () => a(), document.head.appendChild(l);
        });
      }
    if (n && i.render) {
      const s = typeof document < "u" && !t.isConnected;
      s && (e.style.position = "absolute", e.style.left = "-10000px", e.style.top = "-10000px", e.style.visibility = "hidden", document.body.appendChild(e));
      try {
        i.render(n);
      } finally {
        s && (e.style.position = "", e.style.left = "", e.style.top = "", e.style.visibility = "", document.body && document.body.contains(e) && document.body.removeChild(e));
      }
    } else
      t.innerHTML = "<p>VexFlow not available - install VexFlow to render scores</p>";
  } catch (o) {
    console.error("[SCORE] Error rendering with VexFlow:", o), t.innerHTML = `<p>Error rendering VexFlow score: ${o.message}</p>`;
  }
  return e;
}
async function xr(c, t, e, n, r, o) {
  const { scale: i, staffwidth: s, responsive: a, abcOptions: l, showAbc: u } = r, d = je(c, l);
  if (u) {
    const m = document.createElement("details");
    m.style.marginTop = "15px";
    const p = document.createElement("summary");
    p.textContent = "ABC Notation (click to expand)", p.style.cursor = "pointer", m.appendChild(p);
    const g = document.createElement("pre");
    g.textContent = d, g.style.cssText = `
			background: #f5f5f5;
			padding: 10px;
			border-radius: 4px;
			overflow-x: auto;
			font-size: 12px;
		`, m.appendChild(g), e.appendChild(m);
  }
  if (!n && o)
    try {
      if (typeof require < "u")
        console.log("[SCORE] Loading ABCJS via require()..."), n = await require("abcjs");
      else {
        console.log("[SCORE] Loading ABCJS via import()...");
        const m = await import("https://cdn.skypack.dev/abcjs");
        n = m.default || m;
      }
      if (!n || !n.renderAbc) {
        console.warn(
          "[SCORE] First load attempt failed, trying alternative CDN..."
        );
        try {
          const m = await import("https://cdn.jsdelivr.net/npm/abcjs@6.4.0/dist/abcjs-basic-min.js");
          if (n = m.default || m.ABCJS || typeof window < "u" && window.ABCJS, !n || !n.renderAbc)
            throw new Error("Alternative CDN also failed");
        } catch (m) {
          console.warn("[SCORE] Could not auto-load ABCJS:", m.message), n = null;
        }
      }
      n && (console.log(
        "[SCORE] ABCJS loaded successfully, version:",
        n.version || "unknown"
      ), typeof window < "u" && (window.ABCJS = n));
    } catch (m) {
      console.warn("[SCORE] Could not auto-load ABCJS:", m.message), n = null;
    }
  if (n && n.renderAbc)
    try {
      const m = s || null, p = { responsive: a, scale: i };
      m && (p.staffwidth = m), n.renderAbc(t, d, p), setTimeout(() => {
        if (t.children.length === 0 || t.innerHTML.trim() === "")
          try {
            n.renderAbc(t, d), t.children.length === 0 && (t.innerHTML = '<p style="color: red;">ABCJS rendering failed - no content generated</p><pre>' + d + "</pre>");
          } catch {
            t.innerHTML = "<p>Error with alternative rendering</p><pre>" + d + "</pre>";
          }
      }, 200);
    } catch (m) {
      console.error("[SCORE] Error rendering with ABCJS:", m), t.innerHTML = "<p>Error rendering notation</p><pre>" + d + "</pre>";
    }
  else {
    const m = o ? "ABCJS not available and auto-loading failed - showing text notation only" : "ABCJS not provided and auto-loading disabled - showing text notation only";
    t.innerHTML = `<p>${m}</p><pre>` + d + "</pre>";
  }
  return e;
}
const vr = {
  // Core functionality
  render: gr,
  play: yr,
  score: wr,
  validate: fr,
  // Core formats and players
  createPlayer: Xt,
  // Converters
  converters: {
    abc: je,
    midi: lr,
    midiToJmon: ur,
    tonejs: Ae,
    wav: hr,
    supercollider: mr,
    vexflow: $e
  },
  // Theory and algorithms
  theory: Et.theory,
  generative: Et.generative,
  analysis: Et.analysis,
  constants: Et.constants,
  // Utils
  utils: {
    ...Et.utils,
    JmonValidator: Dt,
    // Expose utility helpers
    quantize: (c, t, e) => Promise.resolve().then(() => It).then((n) => n.quantize(c, t, e)),
    quantizeEvents: async (c, t) => (await Promise.resolve().then(() => It)).quantizeEvents(c, t),
    quantizeTrack: async (c, t) => (await Promise.resolve().then(() => It)).quantizeTrack(c, t),
    quantizeComposition: async (c, t) => (await Promise.resolve().then(() => It)).quantizeComposition(c, t),
    // JMON utilities - official format helpers
    jmon: bn
  },
  // GM Instruments
  instruments: {
    GM_INSTRUMENTS: St,
    generateSamplerUrls: Ct,
    createGMInstrumentNode: Hn,
    findGMProgramByName: Ee,
    getPopularInstruments: Pe
  },
  VERSION: "1.0.0"
}, Mr = {
  loops: {
    async plotLoops(c, t = 4, e = 1 / 4, n = null, r = {}) {
      const { LoopVisualizer: o } = await import("./LoopVisualizer-DS22P85c.js");
      return o.plotLoops(
        c,
        t,
        e,
        n,
        r
      );
    }
  }
};
vr.visualization = Mr;
export {
  vr as default,
  vr as jm
};
