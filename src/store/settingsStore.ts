import { create } from 'zustand';
import { DEFAULT_VOLUME, QUALITY_TIERS, OVERLAY_AUTO_HIDE_MS } from '../lib/constants';
import type { QualityTier } from '../lib/constants';

interface SettingsState {
  quality: QualityTier;
  volume: number;
  isMuted: boolean;
  showNavigation: boolean;
  setQuality: (q: QualityTier) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  setShowNavigation: (s: boolean) => void;
  autoHideNavigation: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  quality: detectQuality(),
  volume: DEFAULT_VOLUME,
  isMuted: false,
  showNavigation: true,

  setQuality: (quality) => set({ quality }),
  setVolume: (volume) => set({ volume }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  setShowNavigation: (showNavigation) => set({ showNavigation }),

  autoHideNavigation: () => {
    set({ showNavigation: true });
    const timer = setTimeout(() => {
      set({ showNavigation: false });
    }, OVERLAY_AUTO_HIDE_MS);
    return () => clearTimeout(timer);
  },
}));

function detectQuality(): QualityTier {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2');
  if (!gl) return 'low';

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo
    ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || ''
    : '';

  const isMobile = /iPhone|iPad|iPod|Android|Mobile|Mobi/i.test(navigator.userAgent);
  const cores = navigator.hardwareConcurrency || 4;

  if (isMobile || cores <= 4 || /Intel|Mali|Adreno 5|PowerVR/i.test(renderer)) {
    return cores <= 2 ? 'low' : 'mid';
  }
  return 'high';
}
