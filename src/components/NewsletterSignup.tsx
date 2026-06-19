import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [visible, setVisible] = useState(false);

  // Show after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('submitting');
    try {
      if (supabase) {
        const { error } = await supabase.from('subscribers').insert({ email });
        if (error && error.code !== '23505') throw error; // 23505 = duplicate, that's fine
      }
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 50,
        maxWidth: '280px',
        background: 'rgba(10, 10, 20, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(192, 160, 96, 0.3)',
        borderRadius: '8px',
        padding: '1rem',
        fontFamily: "'Inter', sans-serif",
        animation: 'fadeIn 0.6s ease-out',
      }}
    >
      {status === 'done' ? (
        <p style={{ color: '#c0a060', fontSize: '0.8rem', margin: 0, textAlign: 'center' }}>
          ✦ Transmission received ✦
        </p>
      ) : (
        <>
          <p
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.7rem',
              margin: '0 0 0.6rem 0',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Receive Transmissions
          </p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.4rem' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '4px',
                padding: '0.4rem 0.6rem',
                color: 'white',
                fontSize: '0.75rem',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              style={{
                background: 'rgba(192, 160, 96, 0.2)',
                border: '1px solid rgba(192, 160, 96, 0.4)',
                borderRadius: '4px',
                padding: '0.4rem 0.8rem',
                color: '#c0a060',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              {status === 'submitting' ? '...' : 'Join'}
            </button>
          </form>
          {status === 'error' && (
            <p style={{ color: '#ff4444', fontSize: '0.65rem', margin: '0.4rem 0 0 0' }}>
              Signal lost. Try again.
            </p>
          )}
        </>
      )}
    </div>
  );
}
