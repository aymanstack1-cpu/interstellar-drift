import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useSettingsStore } from '../../store/settingsStore';
import { useWorldStore } from '../../store/worldStore';
import { WORLD_IDS } from '../../lib/constants';
import type { WorldId } from '../../lib/constants';

interface WorldPostConfig {
  bloom: { intensity: number; luminanceThreshold: number };
  vignette: { darkness: number; offset: number };
  chromaticAberration: { offset: number };
  noise: { opacity: number };
}

const POST_CONFIGS: Record<WorldId, WorldPostConfig> = {
  [WORLD_IDS.THE_DRIFT]: {
    bloom: { intensity: 0.4, luminanceThreshold: 0.3 },
    vignette: { darkness: 0.4, offset: 0.3 },
    chromaticAberration: { offset: 0.001 },
    noise: { opacity: 0.02 },
  },
  [WORLD_IDS.NEBULA_HEART]: {
    bloom: { intensity: 0.8, luminanceThreshold: 0.15 },
    vignette: { darkness: 0.3, offset: 0.2 },
    chromaticAberration: { offset: 0.003 },
    noise: { opacity: 0.015 },
  },
  [WORLD_IDS.SINGULARITY]: {
    bloom: { intensity: 0.3, luminanceThreshold: 0.5 },
    vignette: { darkness: 0.7, offset: 0.1 },
    chromaticAberration: { offset: 0.002 },
    noise: { opacity: 0.04 },
  },
  [WORLD_IDS.SOLAR_SAIL]: {
    bloom: { intensity: 0.6, luminanceThreshold: 0.2 },
    vignette: { darkness: 0.35, offset: 0.25 },
    chromaticAberration: { offset: 0.0015 },
    noise: { opacity: 0.02 },
  },
  [WORLD_IDS.EXHIBITION]: {
    bloom: { intensity: 0.3, luminanceThreshold: 0.4 },
    vignette: { darkness: 0.5, offset: 0.2 },
    chromaticAberration: { offset: 0.0005 },
    noise: { opacity: 0.03 },
  },
};

export default function PostEffects() {
  const quality = useSettingsStore((s) => s.quality);
  const currentWorld = useWorldStore((s) => s.currentWorld);

  if (quality === 'low') return null;

  const config = POST_CONFIGS[currentWorld] ?? POST_CONFIGS[WORLD_IDS.THE_DRIFT];
  const isMid = quality === 'mid';
  const caOffset = new THREE.Vector2(
    isMid ? 0 : config.chromaticAberration.offset,
    isMid ? 0 : config.chromaticAberration.offset
  );

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={isMid ? config.bloom.intensity * 0.5 : config.bloom.intensity}
        luminanceThreshold={config.bloom.luminanceThreshold}
        luminanceSmoothing={0.025}
        mipmapBlur
      />
      <Vignette
        darkness={config.vignette.darkness}
        offset={config.vignette.offset}
      />
      <ChromaticAberration
        offset={caOffset}
        radialModulation={false}
        modulationOffset={0}
      />
      <Noise opacity={isMid ? 0 : config.noise.opacity} />
    </EffectComposer>
  );
}
