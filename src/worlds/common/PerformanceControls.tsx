import { useSettingsStore } from '../../store/settingsStore';
import PostEffects from './PostEffects';

export default function PerformanceControls() {
  const qualityTier = useSettingsStore((s) => s.quality);

  // On low quality, render nothing (skip all postprocessing)
  if (qualityTier === 'low') return null;

  // On high quality, render full EffectComposer
  if (qualityTier === 'high') {
    return <PostEffects />;
  }

  // On mid quality, still render postprocessing but it's already
  // adaptive inside PostEffects
  return <PostEffects />;
}
