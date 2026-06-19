import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0015',
            color: 'rgba(255,255,255,0.8)',
            fontFamily: "'Inter', sans-serif",
            padding: '2rem',
            textAlign: 'center',
            zIndex: 200,
          }}
        >
          <div
            style={{
              fontSize: '1.2rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
              color: '#ff6ec7',
            }}
          >
            Drift Anomaly Detected
          </div>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 300,
              opacity: 0.6,
              maxWidth: 400,
              marginBottom: '1.5rem',
            }}
          >
            {this.state.error?.message || 'An unexpected error occurred in the 3D renderer.'}
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              background: 'rgba(123, 104, 238, 0.2)',
              border: '1px solid rgba(123, 104, 238, 0.4)',
              color: '#fff',
              padding: '0.6rem 1.5rem',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontFamily: "'Inter', sans-serif",
              transition: 'background 0.2s',
            }}
          >
            Recalibrate
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
