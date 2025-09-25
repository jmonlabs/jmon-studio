// Simple Observable workaround for VexFlow rendering
// Use this in Observable when jm.score() falls back to ABC text

export function renderWithVexFlow(piece, VF, options = {}) {
  const width = options.width || 800;
  const height = options.height || 200;

  // Create container
  const div = document.createElement('div');
  div.style.width = `${width}px`;
  div.style.height = `${height}px`;

  try {
    // Simple VexFlow rendering using basic API
    const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
    renderer.resize(width, height);
    const context = renderer.getContext();

    // Create stave
    const stave = new VF.Stave(10, 40, width - 50);
    stave.addClef('treble');

    if (piece.timeSignature) {
      stave.addTimeSignature(piece.timeSignature);
    }
    if (piece.keySignature && piece.keySignature !== 'C') {
      stave.addKeySignature(piece.keySignature);
    }

    stave.setContext(context).draw();

    // Convert JMON notes to VexFlow notes
    const notes = (piece.notes || []).map(note => {
      const midiToVF = (midi) => {
        const noteNames = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
        const octave = Math.floor(midi / 12) - 1;
        const noteIndex = midi % 12;
        return noteNames[noteIndex].replace('#', '#') + '/' + octave;
      };

      const durationToVF = (duration) => {
        if (duration >= 4) return 'w';
        if (duration >= 2) return 'h';
        if (duration >= 1) return 'q';
        if (duration >= 0.5) return '8';
        return '16';
      };

      const keys = Array.isArray(note.pitch)
        ? note.pitch.map(midiToVF)
        : [midiToVF(note.pitch)];

      return new VF.StaveNote({
        keys: keys,
        duration: durationToVF(note.duration || 1)
      });
    });

    if (notes.length > 0) {
      // Create voice and format
      const voice = new VF.Voice({
        num_beats: 4,
        beat_value: 4
      }).addTickables(notes);

      new VF.Formatter()
        .joinVoices([voice])
        .format([voice], width - 80);

      voice.draw(context, stave);
    }

    return div;

  } catch (error) {
    console.warn('Simple VexFlow rendering failed:', error);
    // Return ABC fallback as DOM element
    const pre = document.createElement('pre');
    pre.style.fontFamily = 'monospace';
    pre.style.fontSize = '12px';
    pre.textContent = `# VexFlow rendering failed
# Error: ${error.message}
# Falling back to ABC text:

${generateABC(piece)}`;
    return pre;
  }
}

function generateABC(piece) {
  let abc = 'X:1\n';
  abc += `T:${piece.metadata?.title || 'Untitled'}\n`;
  abc += `M:${piece.timeSignature || '4/4'}\n`;
  abc += 'L:1/4\n';
  abc += `Q:1/4=${piece.tempo || 120}\n`;
  abc += `K:${piece.keySignature || 'C'}\n`;

  const notes = piece.notes || [];
  for (const note of notes) {
    const midiToABC = (midi) => {
      const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const octave = Math.floor(midi / 12) - 1;
      const noteIndex = midi % 12;
      let abc = noteNames[noteIndex].replace('#', '^');
      if (octave >= 4) {
        abc = abc.toLowerCase();
        if (octave > 4) abc += "'".repeat(octave - 4);
      } else if (octave < 4) {
        abc = abc.toUpperCase();
        if (octave < 3) abc += ",".repeat(3 - octave);
      }
      return abc;
    };

    if (Array.isArray(note.pitch)) {
      abc += '[' + note.pitch.map(midiToABC).join('') + ']4 ';
    } else {
      abc += midiToABC(note.pitch) + '4 ';
    }
  }

  return abc + '|\n';
}

// Usage in Observable:
// const result = jm.score(piece, vexflow);
// if (result.type === 'abc') {
//   return renderWithVexFlow(piece, vexflow, { width: 800, height: 200 });
// }
// return result;