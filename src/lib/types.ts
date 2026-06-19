import type { WorldId } from './constants';

export interface WorldState {
  currentWorld: WorldId;
  previousWorld: WorldId | null;
  transitionPhase: 'idle' | 'exiting' | 'entering';
  transitionProgress: number;
}

export interface SettingsState {
  quality: 'high' | 'mid' | 'low';
  volume: number;
  isMuted: boolean;
  showNavigation: boolean;
}

export interface AnalyticsState {
  visits: Record<string, number>;
  sessionId: string | null;
  loading: boolean;
}
