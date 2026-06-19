import { useWorldStore } from '../store/worldStore';

export function useWorldTransition() {
  const currentWorld = useWorldStore((s) => s.currentWorld);
  const transitionPhase = useWorldStore((s) => s.transitionPhase);

  return {
    transitioning: transitionPhase !== 'idle',
    currentWorld,
    transitionPhase,
  } as const;
}
