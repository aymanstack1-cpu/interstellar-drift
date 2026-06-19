import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import audioEngine from './AudioEngine';

interface AudioContextValue {
  initialized: boolean;
  initAudio: () => Promise<void>;
}

const AudioContext = createContext<AudioContextValue>({
  initialized: false,
  initAudio: async () => {},
});

export function useAudio() {
  return useContext(AudioContext);
}

export default function AudioContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [initialized, setInitialized] = useState(false);
  const initStarted = useRef(false);

  const initAudio = async () => {
    if (initStarted.current) return;
    initStarted.current = true;
    try {
      await audioEngine.init();
      setInitialized(true);
    } catch (err) {
      console.warn('[AudioContext] Init failed:', err);
      initStarted.current = false;
    }
  };

  // Auto-init on first user interaction
  useEffect(() => {
    const handler = async () => {
      await initAudio();
    };
    window.addEventListener('click', handler, { once: true });
    window.addEventListener('touchstart', handler, { once: true });
    window.addEventListener('keydown', handler, { once: true });
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('touchstart', handler);
      window.removeEventListener('keydown', handler);
    };
  }, [initAudio]);

  return (
    <AudioContext.Provider value={{ initialized, initAudio }}>
      {children}
    </AudioContext.Provider>
  );
}
