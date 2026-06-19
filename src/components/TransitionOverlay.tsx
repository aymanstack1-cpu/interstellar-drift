import { useWorldStore } from '../store/worldStore';
import { WORLD_REGISTRY } from '../lib/constants';

export default function TransitionOverlay() {
  const phase = useWorldStore((s) => s.transitionPhase);
  const progress = useWorldStore((s) => s.transitionProgress);
  const previousWorld = useWorldStore((s) => s.previousWorld);
  const currentWorld = useWorldStore((s) => s.currentWorld);

  const isActive = phase !== 'idle';

  const fromLabel = WORLD_REGISTRY.find((w) => w.id === previousWorld)?.label ?? '';
  const toLabel = WORLD_REGISTRY.find((w) => w.id === currentWorld)?.label ?? '';

  if (!isActive) return null;

  return (
    <>
      {/* Warp circle effect */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 45,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, rgba(10,0,21,0) 0%, rgba(10,0,21,0.98) 100%)',
          opacity: phase === 'exiting' ? progress : 1 - progress,
          transition: 'none',
        }}
      />

      {/* Radial streaks (simulated via box shadows) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 46,
          pointerEvents: 'none',
          background: `
            radial-gradient(circle at 50% 50%, transparent 30%, rgba(123,104,238,${phase === 'exiting' ? progress * 0.3 : (1 - progress) * 0.3}) 100%)
          `,
          transition: 'none',
        }}
      />

      {/* Center text overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: phase === 'exiting' ? Math.min(progress * 2, 1) : Math.max((1 - progress) * 2, 0),
          transition: 'none',
        }}
      >
        {phase === 'exiting' ? (
          <>
            <div
              style={{
                color: 'rgba(255,255,255,0.3)',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: '0.65rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginBottom: '0.3rem',
              }}
            >
              Leaving
            </div>
            <div
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: '1.2rem',
                letterSpacing: '0.15em',
              }}
            >
              {fromLabel}
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                color: 'rgba(255,255,255,0.3)',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: '0.65rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginBottom: '0.3rem',
              }}
            >
              Entering
            </div>
            <div
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: '1.4rem',
                letterSpacing: '0.15em',
              }}
            >
              {toLabel}
            </div>
          </>
        )}
      </div>

      {/* Speed lines (horizontal streaks) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 47,
          pointerEvents: 'none',
          overflow: 'hidden',
          opacity: isActive ? 0.4 : 0,
        }}
      >
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${40 + Math.random() * 120}px`,
              height: '1px',
              background: `rgba(255,255,255,${0.1 + Math.random() * 0.3})`,
              transform: `rotate(${Math.random() * 180}deg) scaleX(${phase === 'exiting' ? progress : 1 - progress})`,
              transition: 'none',
            }}
          />
        ))}
      </div>
    </>
  );
}
