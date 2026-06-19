import * as Tone from 'tone';

/**
 * Solar Sail: Warm bowed strings
 * Cello-like pads, Lydian mode harmonic progression
 */
export function createSolarStrings() {
  // Warm pad synth
  const padSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sawtooth', partials: [1, 0.5, 0.3, 0.1] } as any,
    envelope: { attack: 2, decay: 0.5, sustain: 0.6, release: 4 },
    filter: { type: 'lowpass', frequency: 800, rolloff: -12 },
  } as any);

  // Cello-like mono synth
  const celloSynth = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.8, decay: 0.3, sustain: 0.5, release: 3 },
  });

  // Effects
  const reverb = new Tone.Reverb({ decay: 6, wet: 0.5 });
  const delay = new Tone.FeedbackDelay(0.4, 0.35);
  const filter = new Tone.Filter(5000, 'lowpass');
  const masterGain = new Tone.Gain(0.5);

  padSynth.connect(masterGain);
  celloSynth.connect(masterGain);
  masterGain.connect(filter);
  filter.connect(reverb);
  reverb.connect(delay);
  delay.toDestination();

  // LFO for gentle warmth
  const volumeLfo = new Tone.LFO(0.06, 0.4, 0.7);
  volumeLfo.connect(masterGain.gain);

  // Lydian mode chord progression: I–IV–V–I
  const chords = [
    ['C3', 'E3', 'G3', 'B3'],     // Cmaj7
    ['F3', 'A3', 'C4', 'E4'],     // Fmaj7
    ['G3', 'B3', 'D4', 'F4'],     // G7
    ['C3', 'E3', 'G3', 'B3'],     // Cmaj7
  ];
  let chordIndex = 0;

  // Cello melody notes (Lydian mode)
  const melodyNotes = ['C4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C5'];
  let melodyIndex = 0;

  return {
    start: () => {
      volumeLfo.start();

      // Slow chord changes
      const chordInterval = setInterval(() => {
        const chord = chords[chordIndex % chords.length];
        padSynth.triggerAttackRelease(chord, '2n');
        chordIndex++;
      }, 6000);

      // Cello melody
      const melodyInterval = setInterval(() => {
        const note = melodyNotes[melodyIndex % melodyNotes.length];
        celloSynth.triggerAttackRelease(note, '4n');
        melodyIndex++;
      }, 3000);

      return () => {
        clearInterval(chordInterval);
        clearInterval(melodyInterval);
      };
    },
    stop: () => {
      volumeLfo.stop();
      padSynth.releaseAll();
      celloSynth.triggerRelease();
    },
    dispose: () => {
      padSynth.dispose();
      celloSynth.dispose();
      reverb.dispose();
      delay.dispose();
      filter.dispose();
      masterGain.dispose();
      volumeLfo.dispose();
    },
    setVolume: (v: number) => {
      masterGain.gain.rampTo(v * 0.5, 0.5);
    },
  };
}
