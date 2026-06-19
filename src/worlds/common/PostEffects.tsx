import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { useSettingsStore } from '../../store/settingsStore';

export default function PostEffects() {
  const qualityTier = useSettingsStore((s) => s.quality);

  if (qualityTier === 'low') return null;

  return (
    <EffectComposer>
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.025}
        mipmapBlur
      />
      <Vignette
        darkness={0.5}
        offset={0.3}
      />
      <Noise opacity={qualityTier === 'high' ? 0.02 : 0} />
    </EffectComposer>
  );
}
