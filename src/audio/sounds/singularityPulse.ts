import * as Tone from 'tone';

/**
 * Singularity: Percussive pulse and granular textures
 * Rhythmic clicks, low thrum, silence between pulses
 */
export function createSingularityPulse() {
  // Percussive synth
  const percSynth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 5,
    envelope: { attack: 0.001, decay: 0.2, sustain: 0 },
  });

  // Deep pulse
  const pulseOsc = new Tone.Oscillator({
    type: 'sine',
    frequency: 40,
    volume: -20,
  });

  // Granular texture using noise
  const noise = new Tone.Noise('white');
  const noiseEnv = new Tone.Gain(0);
  const noiseFilter = new Tone.Filter(800, 'highpass');
  noise.connect(noiseEnv);
  noiseEnv.connect(noiseFilter);
  noiseFilter.toDestination();

  // Effects
  const delay = new Tone.PingPongDelay(0.25, 0.7);
  const reverb = new Tone.Reverb({ decay: 4, wet: 0.4 });
  const masterGain = new Tone.Gain(0.6);

  percSynth.connect(masterGain);
  pulseOsc.connect(masterGain);
  masterGain.connect(reverb);
  reverb.connect(delay);
  delay.toDestination();

  // Rhythmic pattern
  let pulseInterval: ReturnType<typeof setInterval> | null = null;
  let patternStep = 0;
  const pattern = [1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1];

  return {
    start: () => {
      pulseOsc.start();
      // Granular puffs
      const granularInterval = setInterval(() => {
        noiseEnv.gain.rampTo(0.15, 0.01);
        setTimeout(() => noiseEnv.gain.rampTo(0, 0.3), 50);
      }, 2000);

      // Percussive pattern
      pulseInterval = setInterval(() => {
        if (pattern[patternStep % pattern.length]) {
          percSynth.triggerAttackRelease('C3', '16n');
        }
        patternStep++;
      }, 200);

      return () => {
        clearInterval(granularInterval);
      };
    },
    stop: () => {
      pulseOsc.stop();
      if (pulseInterval) clearInterval(pulseInterval);
      percSynth.triggerRelease();
    },
    dispose: () => {
      percSynth.dispose();
      pulseOsc.dispose();
      noise.dispose();
      noiseEnv.dispose();
      noiseFilter.dispose();
      delay.dispose();
      reverb.dispose();
      masterGain.dispose();
    },
    setVolume: (v: number) => {
      masterGain.gain.rampTo(v * 0.6, 0.3);
    },
  };
}
