export const WORLD_IDS = {
  THE_DRIFT: 'the_drift',
  NEBULA_HEART: 'nebula_heart',
  SINGULARITY: 'singularity',
  SOLAR_SAIL: 'solar_sail',
} as const;

export type WorldId = (typeof WORLD_IDS)[keyof typeof WORLD_IDS];

export interface WorldEntry {
  id: WorldId;
  path: string;
  label: string;
  subtitle: string;
  color: string;
  audioModule: string;
}

export const WORLD_REGISTRY: WorldEntry[] = [
  {
    id: WORLD_IDS.THE_DRIFT,
    path: '/drift',
    label: 'The Drift',
    subtitle: 'Infinite starfield',
    color: '#7b68ee',
    audioModule: 'driftPad',
  },
  {
    id: WORLD_IDS.NEBULA_HEART,
    path: '/nebula',
    label: "Nebula's Heart",
    subtitle: 'Volumetric color',
    color: '#ff6ec7',
    audioModule: 'nebulaBells',
  },
  {
    id: WORLD_IDS.SINGULARITY,
    path: '/singularity',
    label: 'Singularity',
    subtitle: 'Geometric fractal',
    color: '#ffffff',
    audioModule: 'singularityPulse',
  },
  {
    id: WORLD_IDS.SOLAR_SAIL,
    path: '/solar',
    label: 'Solar Sail',
    subtitle: 'Aurora light',
    color: '#ff8833',
    audioModule: 'solarStrings',
  },
];

export const QUALITY_TIERS = ['high', 'mid', 'low'] as const;
export type QualityTier = (typeof QUALITY_TIERS)[number];

export const PARTICLE_COUNTS: Record<QualityTier, number> = {
  high: 8000,
  mid: 4000,
  low: 1500,
};

export const DEFAULT_VOLUME = 0.5;
export const TRANSITION_EXIT_MS = 800;
export const TRANSITION_ENTER_MS = 600;
export const OVERLAY_AUTO_HIDE_MS = 3000;
export const VISIT_DEBOUNCE_MS = 2400;
