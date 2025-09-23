/**
 * VexFlow converter for JMON compositions
 * Converts JMON format to VexFlow notation objects
 */

class VexFlowConverter {
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
      83: "B/5",
    };
  }

  /**
   * Convert MIDI note number to VexFlow pitch notation
   */
  midiToVexFlow(midiNote) {
    if (this.noteMap[midiNote]) {
      return this.noteMap[midiNote];
    }

    // Calculate for notes outside the map
    const octave = Math.floor(midiNote / 12) - 1;
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
    const noteName = noteNames[midiNote % 12];
    return `${noteName}/${octave}`;
  }

  /**
   * Convert duration to VexFlow duration string
   */
  durationToVexFlow(duration) {
    // VexFlow uses string durations: "w", "h", "q", "8", "16", "32"
    if (duration >= 4) return "w"; // whole note
    if (duration >= 2) return "h"; // half note
    if (duration >= 1) return "q"; // quarter note
    if (duration >= 0.5) return "8"; // eighth note
    if (duration >= 0.25) return "16"; // sixteenth note
    return "32"; // thirty-second note
  }

  /**
   * Convert JMON composition to VexFlow format
   */
  convertToVexFlow(composition) {
    const result = {
      timeSignature: composition.timeSignature || "4/4",
      keySignature: composition.keySignature || "C",
      clef: composition.clef,
      tracks: [],
    };

    // Handle tracks: array, object map, or single-track fallback
    let tracks = [];
    if (Array.isArray(composition.tracks)) {
      tracks = composition.tracks.map((t, i) => ({
        name: t.name || `Track ${i + 1}`,
        notes: t.notes || t,
        clef: t.clef,
      }));
    } else if (composition.tracks && typeof composition.tracks === "object") {
      tracks = Object.entries(composition.tracks).map(([name, notes], i) => ({
        name: name || `Track ${i + 1}`,
        notes,
        clef: (notes && notes.clef) || undefined,
      }));
    } else if (composition.notes) {
      tracks = [{
        name: composition.name || "Track 1",
        notes: composition.notes,
        clef: composition.clef,
      }];
    } else {
      tracks = [{
        name: "Track 1",
        notes: composition,
        clef: composition.clef,
      }];
    }

    tracks.forEach((track, trackIndex) => {
      const notes = track.notes || track;
      const vexFlowNotes = [];

      if (Array.isArray(notes)) {
        notes.forEach((note) => {
          const pitches = Array.isArray(note.pitch)
            ? note.pitch
            : (note.pitch !== null && note.pitch !== undefined
              ? [note.pitch]
              : []);
          if (pitches.length > 0) {
            const vexFlowNote = {
              keys: pitches.map((p) => this.midiToVexFlow(p)),
              duration: this.durationToVexFlow(note.duration || 1),
              time: note.time ?? 0,
            };

            // Add articulations if present
            if (note.articulation) {
              vexFlowNote.articulation = note.articulation;
            }

            vexFlowNotes.push(vexFlowNote);
          } else {
            // Rest
            vexFlowNotes.push({
              keys: [],
              duration: this.durationToVexFlow(note.duration || 1),
              time: note.time ?? 0,
              isRest: true,
            });
          }
        });
      }

      result.tracks.push({
        name: track.name || `Track ${trackIndex + 1}`,
        notes: vexFlowNotes,
        clef: track.clef,
      });
    });

    return result;
  }

  /**
   * Create VexFlow renderer configuration
   */
  createRenderer(elementId, width = 800, height = 200) {
    return {
      elementId,
      width,
      height,
      renderer: "svg", // or 'canvas'
      scale: 1.0,
    };
  }

  /**
   * Generate VexFlow rendering instructions
   */
  generateRenderingInstructions(vexFlowData, rendererConfig) {
    return {
      type: "vexflow",
      data: vexFlowData,
      config: rendererConfig,
      render: function (VF) {
        // This function will be called with VexFlow library loaded
        // Resolve target element from either a direct element reference or an elementId
        const targetEl =
          (rendererConfig.element && rendererConfig.element.nodeType === 1)
            ? rendererConfig.element
            : (rendererConfig.elementId
              ? document.getElementById(rendererConfig.elementId)
              : null);

        // Ensure we always have a valid HTMLDivElement for VexFlow
        let div = targetEl;
        if (!div) {
          div = document.createElement("div");
          div.id = rendererConfig.elementId || `vexflow-${Date.now()}`;
          div.style.position = "absolute";
          div.style.left = "-10000px";
          div.style.top = "-10000px";
          div.style.visibility = "hidden";
          (document.body || document.documentElement).appendChild(div);
        }
        const VFNS = (() => {
          const candidates = [
            VF,
            VF && VF.default,
            typeof window !== "undefined" && (window.VF || window.VexFlow),
            typeof window !== "undefined" &&
            window.Vex &&
            (window.Vex.Flow || window.Vex),
          ];
          for (const c of candidates) {
            if (c) return c;
          }
          return null;
        })();

        try {
          // Prefer Factory API when available (v4+)
          const FactoryCtor = VFNS &&
            (VFNS.Factory ||
              (VFNS.Flow && VFNS.Flow.Factory) ||
              (VFNS.VF && VFNS.VF.Factory));
          if (!FactoryCtor) {
            throw new Error("VexFlow Factory API not available on this build");
          }
          const factory = new FactoryCtor({
            renderer: {
              // Use elementId for VexFlow Factory (falls back to generated div id)
              elementId: rendererConfig.elementId || div.id,
              width: rendererConfig.width,
              height: rendererConfig.height,
            },
          });

          // Draw using low-level API with Factory context to avoid EasyScore strictness
          const context = factory.getContext();
          const Flow = (VFNS && (VFNS.Flow || VFNS)) || {};
          const accMode = rendererConfig.accidentalsMode || "auto";
          const getKeyAccidentalMap = (key) => {
            const k = (key || "C").trim();
            const majorSharps = {
              C: 0,
              G: 1,
              D: 2,
              A: 3,
              E: 4,
              B: 5,
              "F#": 6,
              "C#": 7,
            };
            const majorFlats = {
              C: 0,
              F: 1,
              Bb: 2,
              Eb: 3,
              Ab: 4,
              Db: 5,
              Gb: 6,
              Cb: 7,
            };
            const minorSharps = {
              A: 0,
              E: 1,
              B: 2,
              "F#": 3,
              "C#": 4,
              "G#": 5,
              "D#": 6,
              "A#": 7,
            };
            const minorFlats = {
              A: 0,
              D: 1,
              G: 2,
              C: 3,
              F: 4,
              Bb: 5,
              Eb: 6,
              Ab: 7,
            };
            const orderSharps = ["f", "c", "g", "d", "a", "e", "b"];
            const orderFlats = ["b", "e", "a", "d", "g", "c", "f"];
            const isMinor = /m(in)?$/i.test(k);
            const base = k.replace(/m(in)?$/i, "");
            let count = 0;
            let type = "natural";
            if (isMinor && minorSharps[base] !== undefined) {
              count = minorSharps[base];
              type = "sharp";
            } else if (isMinor && minorFlats[base] !== undefined) {
              count = minorFlats[base];
              type = "flat";
            } else if (majorSharps[base] !== undefined) {
              count = majorSharps[base];
              type = "sharp";
            } else if (majorFlats[base] !== undefined) {
              count = majorFlats[base];
              type = "flat";
            }
            const map = {
              a: "natural",
              b: "natural",
              c: "natural",
              d: "natural",
              e: "natural",
              f: "natural",
              g: "natural",
            };
            if (type === "sharp") {
              for (let i = 0; i < count; i++) map[orderSharps[i]] = "sharp";
            }
            if (type === "flat") {
              for (let i = 0; i < count; i++) map[orderFlats[i]] = "flat";
            }
            return map;
          };
          const keyAccMap = getKeyAccidentalMap(vexFlowData.keySignature);

          // Helpers
          const durToTicks = (d) => {
            const s = String(d).replace(/r/g, "");
            const map = { w: 32, h: 16, q: 8, "8": 4, "16": 2, "32": 1 };
            return map[s] || 0;
          };
          const parseTS = (ts) => {
            const [n, d] = (ts || "4/4").split("/").map((x) => parseInt(x, 10));
            return { n: n || 4, d: d || 4 };
          };
          const ts = parseTS(vexFlowData.timeSignature);
          const measureCapacity = Math.max(1, Math.round((32 * ts.n) / ts.d));

          // Segment notes into measures
          const ticksToDur = (ticks) => {
            const inv = { 32: "w", 16: "h", 8: "q", 4: "8", 2: "16", 1: "32" };
            return inv[ticks] || "q";
          };
          // Split notes across measures and mark ties
          const measures = [];
          let cur = [];
          let acc = (() => {
            const notes = vexFlowData.tracks[0].notes || [];
            const minTime = notes.reduce(
              (m, n) => Math.min(m, n.time ?? 0),
              Number.POSITIVE_INFINITY,
            );
            const base = minTime === Number.POSITIVE_INFINITY ? 0 : minTime;
            // Convert beats to 32nd-note ticks (1 beat = 8 ticks)
            return Math.round((base * 8) % measureCapacity);
          })();
          const originalNotes = vexFlowData.tracks[0].notes;
          const graceBuf = [];
          for (const nd of originalNotes) {
            const ticks = durToTicks(nd.duration);
            const isGrace = !!nd.grace;
            if (isGrace) {
              graceBuf.push(nd);
              continue;
            }
            let t = ticks;
            let firstPart = true;
            while (t > 0) {
              const remaining = measureCapacity - acc;
              const slice = Math.min(t, remaining);
              const part = { ...nd, duration: ticksToDur(slice) };
              if (firstPart && graceBuf.length) {
                part.graceNotes = graceBuf.splice(0, graceBuf.length);
              }
              if (!firstPart) part.tieFromPrev = true;
              if (slice < t) part.tieToNext = true;
              cur.push(part);
              acc += slice;
              t -= slice;
              firstPart = false;
              if (acc >= measureCapacity) {
                measures.push(cur);
                cur = [];
                acc = 0;
              }
            }
          }
          if (cur.length) measures.push(cur);

          // Layout params
          const left = 10;
          const right = 10;
          const top = 40;
          const avail = Math.max(
            100,
            (rendererConfig.width || 800) - left - right,
          );
          const mCount = Math.max(1, measures.length);
          const mWidth = Math.max(100, Math.floor(avail / mCount));
          // Auto-detect clef based on median pitch across measures
          const keyToMidi = (k) => {
            const m = /^([a-g])(b|#)?\/(-?\d+)$/.exec(k);
            if (!m) return 60; // default to middle C
            const letters = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
            const letter = letters[m[1]];
            const acc = m[2] === "#" ? 1 : (m[2] === "b" ? -1 : 0);
            const octave = parseInt(m[3], 10);
            return (octave + 1) * 12 + letter + acc;
          };
          const allPitches = [];
          measures.forEach((ms) => {
            ms.forEach((n) => {
              if (n && !n.isRest && Array.isArray(n.keys) && n.keys[0]) {
                allPitches.push(keyToMidi(String(n.keys[0]).toLowerCase()));
              }
            });
          });
          const median = allPitches.length
            ? (() => {
              const arr = [...allPitches].sort((a, b) => a - b);
              const mid = arr.length / 2;
              return arr.length % 2
                ? arr[Math.floor(mid)]
                : (arr[mid - 1] + arr[mid]) / 2;
            })()
            : 60;
          const detectedClef = median < 60 ? "bass" : "treble";

          // Single stave with internal barlines
          const stave = new Flow.Stave(left, top, avail);
          stave.addClef(
            vexFlowData.clef ||
              (vexFlowData.tracks &&
                vexFlowData.tracks[0] &&
                vexFlowData.tracks[0].clef) ||
              (detectedClef || "treble"),
          );
          if (vexFlowData.timeSignature) {
            stave.addTimeSignature(vexFlowData.timeSignature);
          }
          if (vexFlowData.keySignature && vexFlowData.keySignature !== "C") {
            stave.addKeySignature(vexFlowData.keySignature);
          }
          stave.setContext(context).draw();

          // Build all tickables and beams per measure, insert BarNote between measures
          const allTickables = [];
          const createdNotes = [];
          const allBeams = [];
          measures.forEach((mNotes, idx) => {
            const tickables = mNotes.map((noteData) => {
              if (noteData.isRest) {
                return new Flow.StaveNote({
                  keys: ["d/5"],
                  duration: String(noteData.duration).replace(/r?$/, "r"),
                });
              }
              const note = new Flow.StaveNote({
                keys: noteData.keys.map((k) => k.toLowerCase()),
                duration: noteData.duration,
              });
              // Grace notes (attach if present on this note)
              if (
                noteData.graceNotes && Flow.GraceNoteGroup && Flow.GraceNote
              ) {
                try {
                  const gnotes = noteData.graceNotes.map((g) =>
                    new Flow.GraceNote({
                      keys: (g.keys || []).map((kk) =>
                        String(kk).toLowerCase()
                      ),
                      duration: "16",
                      slash: true,
                    })
                  );
                  const ggroup = new Flow.GraceNoteGroup(gnotes, true);
                  if (typeof ggroup.beamNotes === "function") {
                    ggroup.beamNotes();
                  }
                  if (
                    typeof ggroup.setContext === "function" &&
                    typeof ggroup.attachToNote === "function"
                  ) {
                    ggroup.setContext(context);
                    ggroup.attachToNote(note);
                  }
                } catch {}
              }
              // Accidentals display (auto/always)
              if (Flow.Accidental) {
                noteData.keys.forEach((origKey, idx2) => {
                  const k = origKey.toLowerCase();
                  const m = /^([a-g])(#{1,2}|b{1,2})?\/-?\d+$/.exec(k);
                  const letter = m ? m[1] : k[0];
                  const acc = m && m[2] ? (m[2].includes("#") ? "#" : "b") : "";
                  const sig = keyAccMap[letter] || "natural";
                  let glyph = null;
                  if (acc === "#" && sig !== "sharp") {
                    glyph = "#";
                  } else if (acc === "b" && sig !== "flat") {
                    glyph = "b";
                  }
                  if (glyph) {
                    if (typeof note.addAccidental === "function") {
                      note.addAccidental(idx2, new Flow.Accidental(glyph));
                    } else if (typeof note.addModifier === "function") {
                      note.addModifier(new Flow.Accidental(glyph), idx2);
                    }
                  }
                });
              }
              if (noteData.articulation) {
                const map = {
                  staccato: "a.",
                  accent: "a>",
                  tenuto: "a-",
                  marcato: "a^",
                };
                const code = map[noteData.articulation] || null;
                if (code) {
                  if (typeof note.addArticulation === "function") {
                    note.addArticulation(
                      0,
                      new Flow.Articulation(code).setPosition(
                        Flow.Modifier.Position.ABOVE,
                      ),
                    );
                  } else if (typeof note.addModifier === "function") {
                    note.addModifier(
                      new Flow.Articulation(code).setPosition(
                        Flow.Modifier.Position.ABOVE,
                      ),
                      0,
                    );
                  }
                }
              }
              return note;
            });

            // Pass through dots and collect notes for ties
            tickables.forEach((n, i) => {
              const d = mNotes[i];
              if (!d || d.isRest) return;
              const dotCount = (typeof d.dots === "number")
                ? d.dots
                : (d.dots === true || d.dot === true || d.dotted === true
                  ? 1
                  : 0);
              for (let k = 0; k < dotCount; k++) {
                if (typeof n.addDotToAll === "function") {
                  n.addDotToAll();
                } else if (Flow.Dot) {
                  // Fallback: attach Dot modifier to all keys
                  d.keys.forEach((_, idx) => {
                    if (typeof n.addModifier === "function") {
                      n.addModifier(new Flow.Dot(), idx);
                    }
                  });
                }
              }
              createdNotes.push({ vf: n, data: d });
            });
            allTickables.push(...tickables);

            // Beams per measure (ignore rests)
            if (Flow.Beam && typeof Flow.Beam.generateBeams === "function") {
              const beamables = tickables.filter(
                (t) => typeof t.isRest !== "function" || !t.isRest(),
              );
              try {
                const beams = Flow.Beam.generateBeams(beamables);
                beams.forEach((b) => b.setContext(context));
                allBeams.push(...beams);
              } catch (_) {
                // ignore beaming errors
              }
            }

            // Internal barline between measures
            if (
              idx < measures.length - 1 &&
              Flow.BarNote &&
              Flow.Barline &&
              Flow.Barline.type
            ) {
              allTickables.push(new Flow.BarNote(Flow.Barline.type.SINGLE));
            }
          });

          const totalTicks = vexFlowData.tracks[0].notes.reduce(
            (s, n) => s + durToTicks(n.duration),
            0,
          );
          const voice = new Flow.Voice({
            num_beats: totalTicks,
            beat_value: 32,
          });
          if (
            voice.setMode && Flow.Voice && Flow.Voice.Mode &&
            Flow.Voice.Mode.SOFT !== undefined
          ) {
            voice.setMode(Flow.Voice.Mode.SOFT);
          } else if (typeof voice.setStrict === "function") {
            voice.setStrict(false);
          }
          voice.addTickables(
            allTickables.filter((t) =>
              typeof t.getTicks === "function" ? t.getTicks().value() > 0 : true
            ),
          );

          const formatter = new Flow.Formatter().joinVoices([voice]);
          formatter.format([voice], avail - 20);
          voice.draw(context, stave);

          if (allBeams.length) {
            allBeams.forEach((b) => {
              try {
                b.draw();
              } catch (_) {}
            });
          }
          // Append collapsible VexFlow source block (like ABC)
          try {
            const details = document.createElement("details");
            details.style.marginTop = "10px";
            const summary = document.createElement("summary");
            summary.textContent = "VexFlow Source (click to expand)";
            summary.style.cursor = "pointer";
            details.appendChild(summary);
            const pre = document.createElement("pre");
            pre.textContent = JSON.stringify(vexFlowData, null, 2);
            details.appendChild(pre);
            // VexFlow source details are appended in index.js. Do not duplicate here.
          } catch (_) {}
          // Draw simple ties when requested (tie to next note)
          if (createdNotes.length && Flow.StaveTie) {
            for (let i = 0; i < createdNotes.length - 1; i++) {
              const cur = createdNotes[i];
              if (!cur) continue;
              const d = cur.data || {};
              const isTieStart =
                !!(d.tieToNext || d.tieStart || d.tie === "start");
              if (!isTieStart) continue;
              // Find next actual note
              let next = null;
              for (let j = i + 1; j < createdNotes.length; j++) {
                if (createdNotes[j]) {
                  next = createdNotes[j];
                  break;
                }
              }
              if (next) {
                try {
                  new Flow.StaveTie({
                    first_note: cur.vf,
                    last_note: next.vf,
                    first_indices: [0],
                    last_indices: [0],
                  }).setContext(context).draw();
                } catch (_) {
                  // ignore tie errors
                }
              }
            }
          }
        } catch (factoryError) {
          console.warn(
            "Factory API failed, trying low-level API:",
            factoryError,
          );

          // Fallback to low-level API (supports UMD/ESM and v4/v5)
          const Flow = (VFNS && (VFNS.Flow || VFNS.VF || VFNS)) || {};
          const accMode = rendererConfig.accidentalsMode || "auto";
          const getKeyAccidentalMap = (key) => {
            const k = (key || "C").trim();
            const majorSharps = {
              C: 0,
              G: 1,
              D: 2,
              A: 3,
              E: 4,
              B: 5,
              "F#": 6,
              "C#": 7,
            };
            const majorFlats = {
              C: 0,
              F: 1,
              Bb: 2,
              Eb: 3,
              Ab: 4,
              Db: 5,
              Gb: 6,
              Cb: 7,
            };
            const minorSharps = {
              A: 0,
              E: 1,
              B: 2,
              "F#": 3,
              "C#": 4,
              "G#": 5,
              "D#": 6,
              "A#": 7,
            };
            const minorFlats = {
              A: 0,
              D: 1,
              G: 2,
              C: 3,
              F: 4,
              Bb: 5,
              Eb: 6,
              Ab: 7,
            };
            const orderSharps = ["f", "c", "g", "d", "a", "e", "b"];
            const orderFlats = ["b", "e", "a", "d", "g", "c", "f"];
            const isMinor = /m(in)?$/i.test(k);
            const base = k.replace(/m(in)?$/i, "");
            let count = 0;
            let type = "natural";
            if (isMinor && minorSharps[base] !== undefined) {
              count = minorSharps[base];
              type = "sharp";
            } else if (isMinor && minorFlats[base] !== undefined) {
              count = minorFlats[base];
              type = "flat";
            } else if (majorSharps[base] !== undefined) {
              count = majorSharps[base];
              type = "sharp";
            } else if (majorFlats[base] !== undefined) {
              count = majorFlats[base];
              type = "flat";
            }
            const map = {
              a: "natural",
              b: "natural",
              c: "natural",
              d: "natural",
              e: "natural",
              f: "natural",
              g: "natural",
            };
            if (type === "sharp") {
              for (let i = 0; i < count; i++) map[orderSharps[i]] = "sharp";
            }
            if (type === "flat") {
              for (let i = 0; i < count; i++) map[orderFlats[i]] = "flat";
            }
            return map;
          };
          const keyAccMap = getKeyAccidentalMap(vexFlowData.keySignature);
          const Renderer = (Flow && Flow.Renderer) || VFNS.Renderer ||
            (VFNS.Flow && VFNS.Flow.Renderer);
          if (!Renderer || !Renderer.Backends) {
            throw new Error(
              "VexFlow low-level API not available (Renderer missing)",
            );
          }
          const renderer = new Renderer(
            div,
            Renderer.Backends.SVG,
          );
          renderer.resize(rendererConfig.width, rendererConfig.height);

          const context = renderer.getContext();

          // Helpers
          const durToTicks = (d) => {
            const s = String(d).replace(/r/g, "");
            const map = { w: 32, h: 16, q: 8, "8": 4, "16": 2, "32": 1 };
            return map[s] || 0;
          };
          const parseTS = (ts) => {
            const [n, d] = (ts || "4/4").split("/").map((x) => parseInt(x, 10));
            return { n: n || 4, d: d || 4 };
          };
          const ts = parseTS(vexFlowData.timeSignature);
          const measureCapacity = Math.max(1, Math.round((32 * ts.n) / ts.d));

          // Segment notes into measures
          const ticksToDur = (ticks) => {
            const inv = { 32: "w", 16: "h", 8: "q", 4: "8", 2: "16", 1: "32" };
            return inv[ticks] || "q";
          };
          // Split notes across measures and mark ties
          const measures = [];
          let cur = [];
          let acc = (() => {
            const notes = vexFlowData.tracks[0].notes || [];
            const minTime = notes.reduce(
              (m, n) => Math.min(m, n.time ?? 0),
              Number.POSITIVE_INFINITY,
            );
            const base = minTime === Number.POSITIVE_INFINITY ? 0 : minTime;
            // Convert beats to 32nd-note ticks (1 beat = 8 ticks)
            return Math.round((base * 8) % measureCapacity);
          })();
          const originalNotes = vexFlowData.tracks[0].notes;
          const graceBuf = [];
          for (const nd of originalNotes) {
            const ticks = durToTicks(nd.duration);
            const isGrace = !!nd.grace;
            if (isGrace) {
              graceBuf.push(nd);
              continue;
            }
            let t = ticks;
            let firstPart = true;
            while (t > 0) {
              const remaining = measureCapacity - acc;
              const slice = Math.min(t, remaining);
              const part = { ...nd, duration: ticksToDur(slice) };
              if (firstPart && graceBuf.length) {
                part.graceNotes = graceBuf.splice(0, graceBuf.length);
              }
              if (!firstPart) part.tieFromPrev = true;
              if (slice < t) part.tieToNext = true;
              cur.push(part);
              acc += slice;
              t -= slice;
              firstPart = false;
              if (acc >= measureCapacity) {
                measures.push(cur);
                cur = [];
                acc = 0;
              }
            }
          }
          if (cur.length) measures.push(cur);

          // Layout params
          const left = 10;
          const right = 10;
          const top = 40;
          const avail = Math.max(
            100,
            (rendererConfig.width || 800) - left - right,
          );
          const mCount = Math.max(1, measures.length);
          const mWidth = Math.max(100, Math.floor(avail / mCount));

          // Determine clef based on median pitch (renderer fallback)
          const fallbackKeyToMidi = (k) => {
            const m = /^([a-g])(b|#)?\/(-?\d+)$/.exec(k);
            if (!m) return 60;
            const letters = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
            const letter = letters[m[1]];
            const acc = m[2] === "#" ? 1 : (m[2] === "b" ? -1 : 0);
            const octave = parseInt(m[3], 10);
            return (octave + 1) * 12 + letter + acc;
          };
          const fallbackPitches = [];
          measures.forEach((ms) => {
            ms.forEach((n) => {
              if (n && !n.isRest && Array.isArray(n.keys) && n.keys[0]) {
                fallbackPitches.push(
                  fallbackKeyToMidi(String(n.keys[0]).toLowerCase()),
                );
              }
            });
          });
          const fallbackMedian = fallbackPitches.length
            ? (() => {
              const arr = [...fallbackPitches].sort((a, b) => a - b);
              const mid = arr.length / 2;
              return arr.length % 2
                ? arr[Math.floor(mid)]
                : (arr[mid - 1] + arr[mid]) / 2;
            })()
            : 60;
          const detectedClef = fallbackMedian < 60 ? "bass" : "treble";
          // Single stave with internal barlines (renderer fallback)
          const stave = new Flow.Stave(left, top, avail);
          stave.addClef(
            vexFlowData.clef ||
              (vexFlowData.tracks &&
                vexFlowData.tracks[0] &&
                vexFlowData.tracks[0].clef) ||
              (detectedClef || "treble"),
          );
          if (vexFlowData.timeSignature) {
            stave.addTimeSignature(vexFlowData.timeSignature);
          }
          if (vexFlowData.keySignature && vexFlowData.keySignature !== "C") {
            stave.addKeySignature(vexFlowData.keySignature);
          }
          stave.setContext(context).draw();

          const allTickables = [];
          const createdNotes = [];
          const allBeams = [];
          measures.forEach((mNotes, idx) => {
            const tickables = mNotes.map((noteData) => {
              if (noteData.isRest) {
                return new Flow.StaveNote({
                  keys: ["d/5"],
                  duration: String(noteData.duration).replace(/r?$/, "r"),
                });
              }
              const note = new Flow.StaveNote({
                keys: noteData.keys.map((k) => k.toLowerCase()),
                duration: noteData.duration,
              });
              // Grace notes (attach if present on this note)
              if (
                noteData.graceNotes && Flow.GraceNoteGroup && Flow.GraceNote
              ) {
                try {
                  const gnotes = noteData.graceNotes.map((g) =>
                    new Flow.GraceNote({
                      keys: (g.keys || []).map((kk) =>
                        String(kk).toLowerCase()
                      ),
                      duration: "16",
                      slash: true,
                    })
                  );
                  const ggroup = new Flow.GraceNoteGroup(gnotes, true);
                  if (typeof ggroup.beamNotes === "function") {
                    ggroup.beamNotes();
                  }
                  if (
                    typeof ggroup.setContext === "function" &&
                    typeof ggroup.attachToNote === "function"
                  ) {
                    ggroup.setContext(context);
                    ggroup.attachToNote(note);
                  }
                } catch {}
              }
              // Accidentals display (auto/always)
              if (Flow.Accidental) {
                noteData.keys.forEach((origKey, idx2) => {
                  const k = origKey.toLowerCase();
                  const m = /^([a-g])(#{1,2}|b{1,2})?\/-?\d+$/.exec(k);
                  const letter = m ? m[1] : k[0];
                  const acc = m && m[2] ? (m[2].includes("#") ? "#" : "b") : "";
                  const sig = keyAccMap[letter] || "natural";
                  let glyph = null;
                  if (acc === "#" && sig !== "sharp") {
                    glyph = "#";
                  } else if (acc === "b" && sig !== "flat") {
                    glyph = "b";
                  }
                  if (glyph) {
                    if (typeof note.addAccidental === "function") {
                      note.addAccidental(idx2, new Flow.Accidental(glyph));
                    } else if (typeof note.addModifier === "function") {
                      note.addModifier(new Flow.Accidental(glyph), idx2);
                    }
                  }
                });
              }
              if (noteData.articulation) {
                const map = {
                  staccato: "a.",
                  accent: "a>",
                  tenuto: "a-",
                  marcato: "a^",
                };
                const code = map[noteData.articulation] || null;
                if (code) {
                  if (typeof note.addArticulation === "function") {
                    note.addArticulation(
                      0,
                      new Flow.Articulation(code).setPosition(
                        Flow.Modifier.Position.ABOVE,
                      ),
                    );
                  } else if (typeof note.addModifier === "function") {
                    note.addModifier(
                      new Flow.Articulation(code).setPosition(
                        Flow.Modifier.Position.ABOVE,
                      ),
                      0,
                    );
                  }
                }
              }
              return note;
            });

            // Pass through dots and collect notes for ties
            tickables.forEach((n, i) => {
              const d = mNotes[i];
              if (!d || d.isRest) return;
              const dotCount = (typeof d.dots === "number")
                ? d.dots
                : (d.dots === true || d.dot === true || d.dotted === true
                  ? 1
                  : 0);
              for (let k = 0; k < dotCount; k++) {
                if (typeof n.addDotToAll === "function") {
                  n.addDotToAll();
                } else if (Flow.Dot) {
                  d.keys.forEach((_, idx) => {
                    if (typeof n.addModifier === "function") {
                      n.addModifier(new Flow.Dot(), idx);
                    }
                  });
                }
              }
              createdNotes.push({ vf: n, data: d });
            });
            allTickables.push(...tickables);

            if (Flow.Beam && typeof Flow.Beam.generateBeams === "function") {
              const beamables = tickables.filter(
                (t) => typeof t.isRest !== "function" || !t.isRest(),
              );
              try {
                const beams = Flow.Beam.generateBeams(beamables);
                beams.forEach((b) => b.setContext(context));
                allBeams.push(...beams);
              } catch (_) {
                // ignore beaming errors
              }
            }

            if (
              idx < measures.length - 1 &&
              Flow.BarNote &&
              Flow.Barline &&
              Flow.Barline.type
            ) {
              allTickables.push(new Flow.BarNote(Flow.Barline.type.SINGLE));
            }
          });

          const totalTicks = vexFlowData.tracks[0].notes.reduce(
            (s, n) => s + durToTicks(n.duration),
            0,
          );
          const voice = new Flow.Voice({
            num_beats: totalTicks,
            beat_value: 32,
          });
          if (
            voice.setMode && Flow.Voice && Flow.Voice.Mode &&
            Flow.Voice.Mode.SOFT !== undefined
          ) {
            voice.setMode(Flow.Voice.Mode.SOFT);
          } else if (typeof voice.setStrict === "function") {
            voice.setStrict(false);
          }
          voice.addTickables(
            allTickables.filter((t) =>
              typeof t.getTicks === "function" ? t.getTicks().value() > 0 : true
            ),
          );

          const formatter = new Flow.Formatter().joinVoices([voice]);
          formatter.format([voice], avail - 20);
          voice.draw(context, stave);

          if (allBeams.length) {
            allBeams.forEach((b) => {
              try {
                b.draw();
              } catch (_) {}
            });
          }
          // Draw simple ties when requested (tie to next note)
          if (createdNotes.length && Flow.StaveTie) {
            for (let i = 0; i < createdNotes.length - 1; i++) {
              const cur = createdNotes[i];
              if (!cur) continue;
              const d = cur.data || {};
              const isTieStart =
                !!(d.tieToNext || d.tieStart || d.tie === "start");
              if (!isTieStart) continue;
              let next = null;
              for (let j = i + 1; j < createdNotes.length; j++) {
                if (createdNotes[j]) {
                  next = createdNotes[j];
                  break;
                }
              }
              if (next) {
                try {
                  new Flow.StaveTie({
                    first_note: cur.vf,
                    last_note: next.vf,
                    first_indices: [0],
                    last_indices: [0],
                  }).setContext(context).draw();
                } catch (_) {
                  // ignore tie errors
                }
              }
            }
          }
        }
      },
    };
  }
}

/**
 * Main conversion function for VexFlow
 */
function convertToVexFlow(composition, options = {}) {
  const converter = new VexFlowConverter();
  const vexFlowData = converter.convertToVexFlow(composition);

  if (options.elementId) {
    const rendererConfig = converter.createRenderer(
      options.elementId,
      options.width,
      options.height,
    );
    return converter.generateRenderingInstructions(vexFlowData, rendererConfig);
  }

  return vexFlowData;
}

export { convertToVexFlow, VexFlowConverter };
