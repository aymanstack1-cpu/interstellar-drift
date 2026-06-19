import { create } from 'zustand';
import { WORLD_IDS, TRANSITION_EXIT_MS, TRANSITION_ENTER_MS } from '../lib/constants';
import type { WorldId } from '../lib/constants';

interface WorldState {
  currentWorld: WorldId;
  previousWorld: WorldId | null;
  transitionPhase: 'idle' | 'exiting' | 'entering';
  transitionProgress: number;
  setWorld: (id: WorldId) => void;
  setTransitionPhase: (phase: WorldState['transitionPhase']) => void;
  setTransitionProgress: (p: number) => void;
}

export const useWorldStore = create<WorldState>((set, get) => ({
  currentWorld: WORLD_IDS.THE_DRIFT,
  previousWorld: null,
  transitionPhase: 'idle',
  transitionProgress: 0,

  setWorld: (id: WorldId) => {
    const state = get();
    if (state.transitionPhase !== 'idle') return;
    if (state.currentWorld === id) return;

    set({
      previousWorld: state.currentWorld,
      transitionPhase: 'exiting',
      transitionProgress: 0,
    });

    // Exit phase
    const exitStart = performance.now();
    const animateExit = (now: number) => {
      const elapsed = now - exitStart;
      const progress = Math.min(elapsed / TRANSITION_EXIT_MS, 1);
      set({ transitionProgress: progress });
      if (progress < 1) {
        requestAnimationFrame(animateExit);
      } else {
        // Switch world
        set({
          currentWorld: id,
          transitionPhase: 'entering',
          transitionProgress: 0,
        });

        // Enter phase
        const enterStart = performance.now();
        const animateEnter = (now2: number) => {
          const elapsed2 = now2 - enterStart;
          const progress2 = Math.min(elapsed2 / TRANSITION_ENTER_MS, 1);
          set({ transitionProgress: progress2 });
          if (progress2 < 1) {
            requestAnimationFrame(animateEnter);
          } else {
            set({ transitionPhase: 'idle', transitionProgress: 1 });
          }
        };
        requestAnimationFrame(animateEnter);
      }
    };
    requestAnimationFrame(animateExit);
  },

  setTransitionPhase: (phase) => set({ transitionPhase: phase }),
  setTransitionProgress: (p) => set({ transitionProgress: p }),
}));
