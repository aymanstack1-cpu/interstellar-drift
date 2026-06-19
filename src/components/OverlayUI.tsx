import { useEffect, useState, useRef } from 'react';
import { useWorldStore } from '../store/worldStore';
import { useAnalyticsStore } from '../store/analyticsStore';
import { WORLD_REGISTRY, OVERLAY_AUTO_HIDE_MS } from '../lib/constants';
import type { WorldId } from '../lib/constants';

export default function OverlayUI() {
  const currentWorld = useWorldStore((s) => s.currentWorld);
  const visits = useAnalyticsStore((s) => s.visits);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(false);
    }, OVERLAY_AUTO_HIDE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentWorld]);

  const worldEntry = WORLD_REGISTRY.find(
    (w) => w.id === currentWorld
  );
  const visitCount = visits[currentWorld] || 0;

  if (!worldEntry) return null;

  return (
    <div
      className="overlay"
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40,
        transition: 'opacity 1.5s ease',
        opacity: visible ? 0.7 : 0,
        pointerEvents: 'none',
        textAlign: 'center',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          color: '#fff',
          fontSize: '0.9rem',
          letterSpacing: '0.05em',
          textShadow: '0 0 20px rgba(0,0,0,0.8)',
        }}
      >
        {worldEntry.label}
        {visitCount > 0 && (
          <span style={{ opacity: 0.5, marginLeft: '0.5rem' }}>
            · {visitCount} visit{visitCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}
