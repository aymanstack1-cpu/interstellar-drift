import { useEffect, useRef } from 'react';
import { useWorldStore } from '../store/worldStore';
import { useAnalyticsStore } from '../store/analyticsStore';
import { VISIT_DEBOUNCE_MS } from '../lib/constants';

export function useVisitCounter() {
  const currentWorld = useWorldStore((s) => s.currentWorld);
  const recordVisit = useAnalyticsStore((s) => s.recordVisit);
  const lastVisit = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!currentWorld) return;
    if (lastVisit.current === currentWorld) return;

    // Debounce: don't record if same world was recently recorded
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      lastVisit.current = currentWorld;
      recordVisit(currentWorld).catch(() => {
        // Fallback handled by the store
      });
    }, VISIT_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentWorld, recordVisit]);
}
