import { create } from 'zustand';
import { fetchWorldVisits, incrementWorldVisit } from '../lib/supabase';

interface AnalyticsState {
  visits: Record<string, number>;
  sessionId: string | null;
  loading: boolean;
  fetchVisits: () => Promise<void>;
  recordVisit: (worldId: string) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  visits: {},
  sessionId: typeof crypto !== 'undefined' ? crypto.randomUUID() : 'session',
  loading: false,

  fetchVisits: async () => {
    set({ loading: true });
    const visits = await fetchWorldVisits();
    set({ visits, loading: false });
  },

  recordVisit: async (worldId: string) => {
    const count = await incrementWorldVisit(worldId);
    if (count !== null) {
      set((s) => ({
        visits: { ...s.visits, [worldId]: count },
      }));
    } else {
      // Fallback: increment locally
      set((s) => ({
        visits: {
          ...s.visits,
          [worldId]: (s.visits[worldId] || 0) + 1,
        },
      }));
    }
  },
}));
