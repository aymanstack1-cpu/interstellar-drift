import * as Tone from 'tone';

/**
 * The Drift: Deep ambient drone
 * Low, slow-evolving drone with layered filtered noise and sine sub-bass
 */
export function createDriftPad() {
  // Sub-bass drone
  const subOsc = new Tone.Oscillator({
    type: 'sine',
    frequency: 55,
    volume: -24,
  });

  // Mid drone
  const midOsc = new Tone.Oscillator({
    type: 'sawtooth',
    frequency: 82.41, // E2
    volume: -30,
  });

  // Noise layer
  const noise = new Tone.Noise('brown');
  const noiseFilter = new Tone.Filter(200, 'lowpass');
  const noiseGain = new Tone.Gain(-28);
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);

  // LFO for gentle movement
  const lfo = new Tone.LFO(0.08, 0.3, 0.7);
  const filterLfo = new Tone.LFO(0.04, 150, 500);

  // Reverb
  const reverb = new Tone.Reverb({ decay: 8, wet: 0.6 });
  const delay = new Tone.FeedbackDelay(0.5, 0.3);
  const masterGain = new Tone.Gain(0.6);

  // Connect
  subOsc.connect(masterGain);
  midOsc.connect(masterGain);
  noiseGain.connect(masterGain);
  masterGain.connect(reverb);
  reverb.connect(delay);
  delay.toDestination();

  // LFO connections
  lfo.connect(masterGain.gain);
  filterLfo.connect(noiseFilter.frequency);

  return {
    start: () => {
      subOsc.start();
      midOsc.start();
      noise.start();
      lfo.start();
      filterLfo.start();
    },
    stop: () => {
      subOsc.stop();
      midOsc.stop();
      noise.stop();
      lfo.stop();
      filterLfo.stop();
    },
    dispose: () => {
      subOsc.dispose();
      midOsc.dispose();
      noise.dispose();
      noiseFilter.dispose();
      noiseGain.dispose();
      lfo.dispose();
      filterLfo.dispose();
      reverb.dispose();
      delay.dispose();
      masterGain.dispose();
    },
    setVolume: (v: number) => {
      masterGain.gain.rampTo(v * 0.6, 0.5);
    },
  };
}
