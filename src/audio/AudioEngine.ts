import * as Tone from 'tone';
import { createDriftPad } from './sounds/driftPad';
import { createNebulaBells } from './sounds/nebulaBells';
import { createSingularityPulse } from './sounds/singularityPulse';
import { createSolarStrings } from './sounds/solarStrings';
import { WORLD_IDS, DEFAULT_VOLUME } from '../lib/constants';

type SynthModule = ReturnType<
  | typeof createDriftPad
  | typeof createNebulaBells
  | typeof createSingularityPulse
  | typeof createSolarStrings
>;

const synthFactories: Record<string, () => SynthModule> = {
  [WORLD_IDS.THE_DRIFT]: createDriftPad as () => SynthModule,
  [WORLD_IDS.NEBULA_HEART]: createNebulaBells as () => SynthModule,
  [WORLD_IDS.SINGULARITY]: createSingularityPulse as () => SynthModule,
  [WORLD_IDS.SOLAR_SAIL]: createSolarStrings as () => SynthModule,
  [WORLD_IDS.EXHIBITION]: createDriftPad as () => SynthModule,
};

class AudioEngine {
  private initialized = false;
  private currentSynth: SynthModule | null = null;
  private currentWorldId: string | null = null;
  private masterGain: Tone.Gain | null = null;
  private _volume: number = DEFAULT_VOLUME;

  async init(): Promise<void> {
    if (this.initialized) return;
    await Tone.start();
    this.masterGain = new Tone.Gain(DEFAULT_VOLUME);
    this.masterGain.toDestination();
    this.initialized = true;
    console.log('[AudioEngine] Initialized');
  }

  async playWorld(worldId: string): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }

    // If same world, do nothing
    if (this.currentWorldId === worldId && this.currentSynth) return;

    // Crossfade: stop current
    this.stop();

    // Create and start new synth
    const factory = synthFactories[worldId];
    if (!factory) {
      console.warn(`[AudioEngine] No synth for world: ${worldId}`);
      return;
    }

    this.currentSynth = factory();
    this.currentWorldId = worldId;

    // Connect to master gain
    if (this.masterGain && 'connect' in this.currentSynth) {
      // Synthesizer modules don't have a standard connect interface,
      // they route through Tone.js internally.
      // The volume setting will be applied via setVolume
    }

    this.currentSynth.start();
    this.currentSynth.setVolume(this._volume);
    console.log(`[AudioEngine] Playing world: ${worldId}`);
  }

  stop(): void {
    if (this.currentSynth) {
      this.currentSynth.stop();
      this.currentSynth.dispose();
      this.currentSynth = null;
      this.currentWorldId = null;
    }
  }

  set volume(v: number) {
    this._volume = v;
    if (this.currentSynth) {
      this.currentSynth.setVolume(v);
    }
    if (this.masterGain) {
      this.masterGain.gain.rampTo(v, 0.3);
    }
  }

  get volume(): number {
    return this._volume;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

const audioEngine = new AudioEngine();
export default audioEngine;
