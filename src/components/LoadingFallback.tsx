import { useEffect, useState } from 'react';

export default function LoadingFallback() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          border: '2px solid rgba(123, 104, 238, 0.2)',
          borderTopColor: '#7b68ee',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginBottom: '1rem',
        }}
      />
      <div
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: '0.85rem',
          letterSpacing: '0.15em',
        }}
      >
        ENTERING DRIFT{dots}
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
