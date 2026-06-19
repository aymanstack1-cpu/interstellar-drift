import { useWorldStore } from '../store/worldStore';

export default function TransitionOverlay() {
  const phase = useWorldStore((s) => s.transitionPhase);
  const progress = useWorldStore((s) => s.transitionProgress);

  const isActive = phase !== 'idle';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        pointerEvents: isActive ? 'auto' : 'none',
        backgroundColor: '#000',
        opacity: isActive ? (phase === 'exiting' ? progress : 1 - progress) : 0,
        transition: isActive ? 'none' : 'opacity 0.5s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isActive && (
        <div
          style={{
            color: 'rgba(255,255,255,0.3)',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: '0.8rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          {phase === 'exiting' ? 'Drifting away...' : 'Entering...'}
        </div>
      )}
    </div>
  );
}
