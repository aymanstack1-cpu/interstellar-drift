import * as Tone from 'tone';

/**
 * Nebula's Heart: Ethereal bell-like tones
 * FM synthesis with random arpeggios, shimmer reverb
 */
export function createNebulaBells() {
  // FM Synth for bell tones
  const fmSynth = new Tone.FMSynth({
    harmonicity: 2.5,
    modulationIndex: 6,
    carrier: { oscillator: { type: 'sine' } },
    modulator: { oscillator: { type: 'triangle' } },
  } as any);

  // PolySynth for chord pads
  const polySynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' },
    envelope: { attack: 0.5, decay: 0.3, sustain: 0.4, release: 3 },
  });

  // Reverb and delay
  const reverb = new Tone.Reverb({ decay: 12, wet: 0.7, preDelay: 0.2 });
  const delay = new Tone.FeedbackDelay(0.6, 0.5);
  const filter = new Tone.Filter(4000, 'lowpass');
  const masterGain = new Tone.Gain(0.5);

  // Connect chain
  fmSynth.connect(masterGain);
  polySynth.connect(masterGain);
  masterGain.connect(filter);
  filter.connect(reverb);
  reverb.connect(delay);
  delay.toDestination();

  // Shimmer effect
  const shimmerLfo = new Tone.LFO(0.15, 2000, 6000);
  shimmerLfo.connect(filter.frequency);

  // Note sequence
  const notes = ['C5', 'Eb5', 'G5', 'Bb5', 'D6', 'F6', 'A6'];
  let noteIndex = 0;
  let intervalId: ReturnType<typeof setInterval> | null = null;

  // Chord progression
  const chords = [
    ['C4', 'Eb4', 'G4', 'Bb4'],
    ['Db4', 'F4', 'Ab4', 'C5'],
    ['F4', 'Ab4', 'C5', 'Eb5'],
    ['G4', 'Bb4', 'D5', 'F5'],
  ];
  let chordIndex = 0;

  return {
    start: () => {
      shimmerLfo.start();
      // Play bell arpeggios
      intervalId = setInterval(() => {
        const note = notes[noteIndex % notes.length];
        fmSynth.triggerAttackRelease(note, '8n');
        noteIndex++;
      }, 600);

      // Play chord pads
      const chordInterval = setInterval(() => {
        const chord = chords[chordIndex % chords.length];
        polySynth.triggerAttackRelease(chord, '4n');
        chordIndex++;
      }, 4000);

      return () => {
        clearInterval(chordInterval);
      };
    },
    stop: () => {
      shimmerLfo.stop();
      if (intervalId) clearInterval(intervalId);
      fmSynth.triggerRelease();
      polySynth.releaseAll();
    },
    dispose: () => {
      fmSynth.dispose();
      polySynth.dispose();
      reverb.dispose();
      delay.dispose();
      filter.dispose();
      masterGain.dispose();
      shimmerLfo.dispose();
    },
    setVolume: (v: number) => {
      masterGain.gain.rampTo(v * 0.5, 0.5);
    },
  };
}
